---
title: Chasing a Battery Drain on my Kobo Libra Colour -  Part 1
tags:
  - ereader
  - koreader
  - debugging
  - hardware
created: 2026-08-01
---
My Kobo Libra Colour was burning through ~10%/hour while I was actively reading — not suspended, just turning pages. That's high enough for an e-ink device that I went digging through the KOReader source instead of accepting it.

The setup: a vendor koreader checkout (`master` @ `730285210`), one extra plugin installed ([AnnotationSync](https://github.com/dani84bs/AnnotationSync.koplugin)), and the built-in BatteryStat plugin doing the measuring, so I'd have a consolidated awake-drain rate instead of a single noisy before/after reading.

## Ruling out the obvious

Before pinning the blame on anything, I went through the usual suspects in the source.

`AnnotationSync` was the first one I wanted to clear, since it's the only thing I'd added myself. Its progress-sync scheduling (`manager.lua:63`) only arms on `onPageUpdate` and gets explicitly unscheduled on `onCloseDocument`/`onSuspend` — no recurring timer running at rest, and it never touches Wi-Fi directly. Not it.

Next, the color panel itself. The Kaleido display can drive an expensive CFA waveform (GCC16/GLRC16) per refresh, but `base/ffi/framebuffer_mxcfb.lua:362-386` shows that only gets promoted when the `dither` flag is set — image content only. Plain text pages use the same grayscale waveform a mono Carta panel would. So the cover page of a book might cost one expensive refresh; the rest of it reads exactly like black-and-white hardware would.

Last, the CPU governor. `performanceCPUGovernor()` and `enableCPUCores(2)` get used during PDF/kopt re-rendering, and every call site I found reverts them afterward. Nothing leaks statically — I'd only chase this further on-device, and only once everything else is ruled out.

None of these explain a sustained 10%/hour on their own, which pushed me toward two other candidates.

## Wi-Fi, the prime suspect

I keep Wi-Fi on for the whole session so AnnotationSync can push reading progress as I go. An idle-but-associated radio is a well-known power draw on e-ink hardware — usually a bigger cost than the panel or the CPU — and turning it off isn't the free fix it sounds like with this plugin as currently written.

`AnnotationSync`'s "sync when network becomes available" hook (`main.lua:471-487`) only drives the *annotations* changed-doc tracker. Progress sync is a separate path (`manager.lua:184`) that does a one-shot connectivity check and gives up silently if Wi-Fi happens to be off at that exact moment — there's no reconnect-triggered retry for progress the way there is for annotations. Which means koreader's own "disable Wi-Fi when inactive" setting would likely cause silent progress-sync misses if I turned it on today.

## The panel and the frontlight

The second candidate is more structural: the Kaleido color filter array has lower reflectance than a mono Carta panel, so the white LED channel has to work harder for the same perceived brightness — a baseline cost that has nothing to do with warmth. On top of that, my warm frontlight bias draws current through the amber channel of the shared `lm3630a_led` mixer (`device.lua:548`), which is typically less efficient per mA than the white channel. This one's additive with the Wi-Fi cost, not a competing explanation for it.

## Testing the Wi-Fi hypothesis

Three freshly-reset, independent Wi-Fi-off sessions gave me 5%/h over ~12 minutes, 2.84%/h over ~20 minutes, and 2%/h over a full 30 minutes — falling as the sessions got longer, which is what I'd expect from gauge-quantization noise shrinking on a longer window. All three sit at roughly half the ~10%/hour Wi-Fi-on baseline or better, which is a solid signal that Wi-Fi really is the biggest single contributor. I left the frontlight alone throughout — same brightness and warmth as my usual reading settings, untouched on purpose — so Wi-Fi stayed the only variable in play.

The 30-minute session had a coda worth mentioning: I closed the sleep cover afterward, resumed 1.5 hours later, and the *awake* stat — not sleep — jumped to 5%/h. A few more short sessions right after that bounced around too: down to 3%/h, then back up to 6%/h. That's odd, because BatteryStat's awake/sleeping figures are running cumulative totals, only reset manually or on a charging transition. Those short sessions weren't reset first, so they were diluting into the average the 30-minute test had already left elevated — and the fact that the rate went *back up* after already being diluted once means the segment right before that check must have had a genuinely high instantaneous rate, not just short-window noise.

## A wrinkle: the post-nap jump

That bounce sent me back into the source to figure out what actually happens around resume. A full-screen refresh on resume (`device.lua:412-415`) only fires if `needsScreenRefreshAfterResume()` is true, which defaults to `false` on Kobo — not this. Wi-Fi restoring on resume (`networklistener.lua:219-227`) only fires if Wi-Fi was on before suspend, and mine was deliberately off — not this either.

What did stand out: `Kobo:standby()` bumps the CPU to the `performance` governor before entering light standby and restores it on wake (`kobo/device.lua:1259-1261`, reverted at `1326`). Light standby can cycle several times during what looks like one continuous sleep period, and if those internal cycles don't line up exactly with BatteryStat's own suspend/resume events, their cost would land in the "awake" bucket instead of "sleep" — which would explain the jump without needing anything as dramatic as the kernel refusing to suspend at all.

## Starting over, cleanly

One thing worth flagging before I go further: everything above was measured on a setup that had already been through months of plugin and settings tinkering before it settled down to "just AnnotationSync." That's plenty of room for leftover config cruft to be quietly skewing results in ways a single plugin audit wouldn't catch. So I've wiped koreader entirely and reinstalled it clean — factory defaults, zero plugins — and I'll be running the next round of experiments from that verified baseline instead, adding plugins back one at a time if I need to.

## What's next

Wi-Fi is confirmed as the leading contributor, with the panel and frontlight bias as a smaller, additive cost, and the CPU governor cleared as a standalone cause. The resume-cost theory is still just that — a theory — until I check the on-device `crash.log` for suspend/resume failures around that cover-closed window, and time a fresh check right after waking to see whether the jump is a single diluted spike or something recurring.

On the clean install, I want to re-establish the Wi-Fi-*on* baseline first before touching the radio at all — the old ~10%/hour number was measured on the cruft-laden setup, so it's due for a re-check on its own. Only once that's confirmed will I move back into the Wi-Fi-off sessions: a longer, uninterrupted, freshly-reset run for a fourth independent data point. 

Fortunately, Matt Dinniman keeps cranking out Dungeon Crawler Carl books, so I'm not short on reading material for the long sessions this is going to take.

More to come as I run those.

[[kobo-libra-colour-battery-drain-part-2 | Read part 2]]
