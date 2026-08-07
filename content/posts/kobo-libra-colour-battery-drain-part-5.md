---
title: Chasing a Battery Drain on my Kobo Libra Colour -  Part 5
tags:
  - ereader
  - koreader
  - hardware
  - debugging
created: 2026-08-07
---
[[kobo-libra-colour-battery-drain-part-4 | Read part 4]]

I continued the investigation about who's keeping my WiFi active and I finally got the offender :)

## The trivial try

I was hoping to find a stray chatty process running on my devices, so I enabled the `ssh` plugin and connected to my kobo.

I tried to log some stats using the following command:

```bash
   nohup while true; do
       {
           date
           echo "tx_packets: $(cat /sys/class/net/wlan0/statistics/tx_packets)"
           ps
           echo "--- tcp ---"; cat /proc/net/tcp
           echo "--- udp ---"; cat /proc/net/udp
           echo "===================="
       } >> /mnt/onboard/.adds/koreader/netwatch.log
       sleep 30
   done
   ' > /dev/null 2>&1 &
```

I would log every 30 seconds the running processes, some network stats and the active connections. I then logged out, turned ssh off and restarted the network interface ([[nohup]] allowed me to logout leaving the process running).

Unfortunately I could see the packets ramping up, but no suspect among the processes. Just to be sure I also checked `/etc/wpa_supplicant.conf` and `/etc/dhcpd.conf` but I couldn't find anything sus either.

So it was time to bring out of the garage some heavy artillery.

## The network investigation

Of course [[tcpdump]] wasn't already installed on kobo's firmware so I searched on github and found  [this repository](https://github.com/leommxj/prebuilt-multiarch-bin) . In its `src` branch it contains a github action that will compile some useful tools as static binaries for multiple architectures.

Time to check which arch is the kobo running on

```bash
[root@kobo ~]# uname -a
Linux kobo 4.9.77 #1 SMP PREEMPT e5649aba8-20251107T154948-B1107155140 armv7l GNU/Linux
```

It's an `armv7l` hence **arm32** so time to upload the right binary.

```bash
scp -P 2222 ~/Downloads/tcpdump-arm32-static root@192.168.0.116:/mnt/onboard/.adds/tcpdump

tcpdump-arm32-static                              100% 1001KB   2.2MB/s   00:00
```

I wanted the measure to be ultra-pure so I tried leaving tcpdump running, disconnecting from ssh and toggling the WiFi off and on again. 

```bash
 nohup ./tcpdump -i wlan0 -n not port 2222 -Q out -w kobo-battery.pcap > /dev/null 2>&1 &
```

Unfortunately this procedure killed tcpdump so since I was already ignoring ssh traffic (KOReader's `dropbear` runs on port `2222`) I decided for a live inspection:

```bash
[root@kobo .adds]# ./tcpdump -i any -U -n not port 2222 -Q out                                                        
```

```
  tcpdump: verbose output suppressed, use -v or -vv for full protocol decode                                                                            
  listening on any, link-type LINUX_SLL (Linux cooked v1), capture size 262144 bytes                                                                    
  17:17:05.344803 IP6 <REDACTED>: ICMP6, neighbor solicitation, who has <REDACTED>, length 32 
  17:17:27.584801 IP6 <REDACTED>: ICMP6, neighbor solicitation, who has <REDACTED>, length 32 
  17:17:48.724878 IP 192.168.0.116 > 192.168.0.1: ICMP 192.168.0.116 udp port 137 unreachable, length 86                                                
  17:17:49.225856 IP 192.168.0.116 > 192.168.0.1: ICMP 192.168.0.116 udp port 137 unreachable, length 86                                                
  17:17:49.744699 IP6 <REDACTED>: ICMP6, neighbor solicitation, who has <REDACTED>, length 32 
  17:17:53.734785 ARP, Reply 192.168.0.116 is-at <REDACTED>, length 28                                                                           
  17:17:53.744181 ARP, Request who-has 192.168.0.1 tell 192.168.0.116, length 28                                                                        
  17:18:11.984695 IP6 <REDACTED>: ICMP6, neighbor solicitation, who has <REDACTED>, length 32 
  17:18:11.992222 ARP, Reply 192.168.0.116 is-at <REDACTED>, length 28                                                                           
  17:18:23.024807 IP6 <REDACTED> ICMP6, router solicitation, length 16                                                        
  17:18:34.224689 IP6 <REDACTED> ICMP6, neighbor solicitation, who has <REDACTED>, length 32 
  17:18:56.464673 IP6 f<REDACTED> ICMP6, neighbor solicitation, who has <REDACTED>, length 32 
  17:19:58.053106 IP6 <REDACTED> ICMP6, neighbor advertisement, tgt is <REDACTED>, length 32 
  17:19:58.059777 ARP, Reply 192.168.0.116 is-at <REDACTED>, length 28                                                                           
  17:20:03.104619 ARP, Request who-has 192.168.0.232 tell 192.168.0.116, length 28                                                                      
  17:20:03.105136 IP6 <REDACTED>: ICMP6, neighbor solicitation, who has <REDACTED>, length 32                                                   
  17:21:09.744660 IP6 <REDACTED>: ICMP6, neighbor solicitation, who has <REDACTED>, length 32 
  17:21:09.752747 ARP, Reply 192.168.0.116 is-at <REDACTED>, length 28                                                                           
  17:21:14.784639 ARP, Request who-has 192.168.0.232 tell 192.168.0.116, length 28                                                                      
  17:21:26.946050 IP6 <REDACTED>: ICMP6, neighbor advertisement, tgt is <REDACTED>, length 32 
  17:21:49.164998 IP6 <REDACTED> ICMP6, neighbor advertisement, tgt is <REDACTED>, length 32 
  17:22:16.464701 IP6 <REDACTED> ICMP6, neighbor solicitation, who has <REDACTED>, length 32 
  17:22:21.503644 ARP, Request who-has 192.168.0.232 tell 192.168.0.116, length 28
```

And we have the smoking gun!

In this dump we can see:
- My nosy router scanning for `netbios` hosts on my network, but it's quite sporadic.
- Some canonical ARP chores from the IPv4 stack (also sporadic).
- A lot of IPv6 neighbor solicitations and advertisements!

This IPv6 stuff is quite common to keep the adjacency tables up to date, but it's completely useless in my case, since I'm not using IPv6 on my network.

So I tried turning it off temporarily

```bash
echo 1 > /proc/sys/net/ipv6/conf/wlan0/disable_ipv6
```

Et voilá the `Disable WiFi when inactive` option started engaging like a charm :D

## Next steps - Soon but out of this investigation

Now that I know what's going on I feel better, but I still need to come up with some kind of patch for this. I would also like it to be robust to kobo's and KOReader's upgrades.

Once I'll get it sorted I also need to patch [AnnotationSync](https://github.com/dani84bs/AnnotationSync.koplugin) and come up with a strategy to exploit `Disable WiFi when inactive` option while keeping the reading progress in sync (I believe I'll have to find a magical page number to trigger the optimisation but not to fall too behind).

Thanks for reading :D