---
title: And I became an AI's shepherd
created: 2026-08-26
tags:
  - dev
  - ai
  - agents
  - architecture
---

## The Apostate's Dogma

Before **LLM**s became *The thing* I've been in [Github Copilot](https://github.com/features/copilot) insiders preview. I liked it but I didn't find it miraculous as a lot of people claimed.

The first day I tried giving it various tasks to see how high its bar was. I didn't like the result, it was good on very easy tasks and started hallucinating or not doing exactly what I asked on more difficult ones. The caveat was that also on easy tasks it would take me more time to explain what I wanted and to check what it did than writing what I needed in the first place.

So I started using it as fast **line-completion** assistant, if it proposed something longer than one single line I'd hit *ESC* immediately (as if I wasn't using the *ESC* key enough as a **vim** user). I used like that for a year or so and I was pretty happy with it. Most of the time it allowed me to avoid rechecking libraries syntax on docs and proposed the right one as completion, making my flow faster and steadier.

Then *ChatGPT* became famous (not as famous as now, it was in its early days) and I was obviously curious so I tried it. I was quite impressed (since I'm working in computer science not as impressed as a common user, but still quite impressed). After a week or so of experimentation I uncovered the good and the bad parts, and knowing its limits I learned how to use it productively. 

As with copilot I avoided using it for heavy tasks (like coding) but it was very useful to produce boring boilerplate snippets, or for querying about libraries (of course always checking the results, not accepting them as a ground truth).

And then a lot of models came out: *Bard* -> *Gemini*, *Claude* I tried them all, each one had good and bad parts and not all of those parts were overlapping, one thing where they all failed was on logic tricks but I expected it. I didn't settle over one, I kept using them as I was and I was happy with it.

After some time where the chatbots became extremely famous it was the agent era, people were handing over their computer's reins to the models and they were acting on human behalf. My fifth and half sense screamed **DANGER! DANGER!** as people started *vibecoding* (even if the term wasn't born yet).

Out of curiosity (and of course in an as-airgapped-as-i-could sandbox) I wanted to try it and the result were quite lousy. Hallucinations, endless silly loop on the same error, lousy code (I don't know why I hate the term *slop*), jenga or non existing architectures. A software architect horror movie. But people were claiming "it will take our jobs".

That Christmas I went visiting my parents and one evening my Dad asked me to write a videogame he had in mind for quite long. The gameplay would have been nice, but coding it sounded boring as hell, also it needed a lot of data to be scraped from publicly available sources. So I decided to install **gemini-cli** on an empty laptop and check if it could help me skip the boring parts.
It took me an hour of trial and error to get the sensitivity about how far can I stretch the rope, but something clicked in me. If I already have the architecture in mind (or drawn somewhere) and I fed it steps small enough, it would produce the code as I wanted it, not some programming-version of a Pollock painting. After three hours I had an MVP to show my Dad, I believe I could've done it in six or seven, so it was a real advantage and definitely worth exploring further.

## The big flock problem

In the following months I kept using coding agents (mostly gemini-cli) for some of my side projects. It was a good but not great experience, outstanding for fast prototyping, but for large projects involving a lot of steps despite the discipline I developed I had the feeling the agent was too "sensitive". A little perturbation would trigger a big (and bad) domino effect. So I had to git reset and restart because for a little off-wording the model fell in a rabbit-hole, or despite it seemed to understand what I wanted it obstinately refused to comply.

It was like being a single shepherd trying to herd a very big flock from point A to point B. Sometimes everything went smoothly and pleasantly, but most often I had to run a lot just to prevent the flock from scattering everywhere. Those times I had to fallback in progressively smaller steps (and as I said they were already small on start) just to be able to guide it through a not so far goal that the  LLM refused to see or worse it was trying to steer away from for an unknown reason.

In the meanwhile I tried every new piece of tech that came out in order to tame the flock: *custom instructions with guardrails*, *skills*, *plan mode*, I also made a custom **MCP** that acted as a state machine. All these "solutions" helped but did not solve. 

## Enter the Border Collies

One of my biggest passions is dogs, although I work in a completely different field I'm a professional dog trainer. So when I encountered spec driven development I thought immediately it may be what I was looking for. Usually shepherds don't guide big flocks all alone, they train dogs so they would just orchestrate the dogs to move the flock. And they can [reach incredible results](https://www.youtube.com/watch?v=qniwI2hNhDs)!

Hence, I started using specs, tests and custom instructions as my border collies to guide the agent toward my goal. It changed everything, and I also had some byproduct that I could reuse for other tasks.

I tried a lot of frameworks like [conductor](https://github.com/gemini-cli-extensions/conductor), [superpowers](https://github.com/obra/superpowers) , [maestro](https://github.com/josstei/maestro-orchestrate) and [Matt Pocock's skills](https://github.com/mattpocock/skills). The biggest lesson I learnt from them is the importance of  **alignment** and **grounding**. 

In a nutshell **Alignment** is making sure that you and the agent are talking about the same thing and that no assumption should be left foggy for the agent. The best way I found to perform this is spending a session talking with the model and letting it float every corner that is fuzzy so I can specify what I really want. Jumping to code should be strictly prevented, our goal is to produce a document that would describe in detail what I want. Here *skills* are kicking in to let this table tennis with the LLM endure as long as the document is neat and fully understandable for the agent itself, it may propose alternatives but the point is that it **NEVER** should take chances, we are in command!

After the alignment phase is finished, we pass to **Grounding**, where (also using *skills*) the agent pinpoints the freshly produced document to our real codebase. It's important that during this phase we'll enumerate all the callsites (the places that may be affected by this change) to ensure we don't trigger a domino effect or break something.
Another back and forth session is needed to make sure we don't leave any loose ends. We'll end up with a final document that is our bulletproof spec.
It will describe in detail what we want and where it should be implemented, not leaving any space for the model creativity to kick in while coding.

Once we have our shiny new spec, the next step is to break it in *small-enough tasks*. Each task should be small and simple enough to be carried out by a junior developer. It will contain where to make the change, how to make the change and, very important, how to test the change. Here I like to have the task list sorted in manner that will allow what I call a *chain of green*. That is at the end of each task all the existing tests should pass, hence preventing a new task to start in a crooked codebase.
At the end of this phase we finally end up with a plan document which will map our spec to "simple enough" actions to be carried out by **subagents**. I said subagent, because if the tasks are neat we don't need any more the global context so we should let our "junior agents" work on a clean slate.

Since the task description encompasses the tests as well, the implementing agents will automatically have their guardrails preventing them to stray from the clear path. But at the end we'll need nevertheless to deeply review what's produced.

**## Slow Is Smooth, Smooth Is Fast**

At first glance, this entire workflow might look counterintuitive. You are spending a lot of time and burning thousands of tokens on back-and-forth conversations, alignment passes, and detailed specifications before asking the model to write a single line of real code.

It feels like a heavy overhead, until you measure the alternative.

The hours developers spend "vibe-coding" are rarely spent building. They are spent debugging hallucinations, wrestling with context drift, fixing sneaky regressions, and running `git reset --hard` after an agent runs wild. That "small" upfront investment in alignment and grounding completely eliminates those endless trial-and-error loops. More importantly, tokens are cheap; engineering sanity and clean architecture are not.

By treating specs, tests, and skills as our sheepdogs, we stop desperately chasing a scattered flock across the hillside. We don't hand over our thinking to the model, we formalize it. The end result isn't just an MVP that happens to run, but clean, maintainable code that looks like it was written with clear intent.