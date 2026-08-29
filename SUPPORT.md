# 🛟 Fed-Poster — Getting Support

> Where to get help, what to expect, and how to get the fastest, most useful answer. Fed-Poster is a volunteer-maintained, open-source project, so support is community-powered — but it's also well-organised. This guide routes you to the right channel so you're not waiting in the wrong queue.

<div align="center">
  <img src="https://img.shields.io/badge/channels-5-blue?style=for-the-badge" alt="Channels" />
  <img src="https://img.shields.io/badge/triage-<72h-success?style=for-the-badge" alt="Triage" />
  <img src="https://img.shields.io/badge/security-private%20only-red?style=for-the-badge" alt="Security" />
</div>

---

## 🚦 Choose the Right Channel

| If you… | Use |
|---------|-----|
| Have a **usage question** ("how do I set up a Bluesky app password?") | [Discussions → Q&A](https://github.com/fedpromptly/fed-poster/discussions/categories/q-a) |
| Want to **propose an idea** before a formal request | [Discussions → Ideas](https://github.com/fedpromptly/fed-poster/discussions/categories/ideas) |
| Found a **reproducible bug** in the code | [Issue Tracker → Bug Report](https://github.com/fedpromptly/fed-poster/issues/new?template=bug_report.md) |
| Want to **request a feature** formally | [Issue Tracker → Feature Request](https://github.com/fedpromptly/fed-poster/issues/new?template=feature_request.md) |
| Discovered a **security vulnerability** | **Private only** — see [`SECURITY.md`](SECURITY.md); email **security@fed-poster.example.com** |
| Are a **paying customer** of the hosted product | Email **support@fedpromptly.com** (response times per your plan, below) |
| Want to **contribute code** | [`CONTRIBUTING.md`](CONTRIBUTING.md) + [Discussions → Q&A](https://github.com/fedpromptly/fed-poster/discussions) tagged `contributing` |
| Want to **support the project financially** | [Ko-fi](https://ko-fi.com/W3T61ZU5FS) |
| Just want to **say thanks** | A kind word in Discussions goes a long way 🧡 |

---

## ⏱️ What to Expect (Response Times)

These are targets, not guarantees — Fed-Poster is maintained by volunteers with day jobs, and a complex reproduction can take longer. We aim to hit these consistently.

| Channel | First response target |
|---------|----------------------|
| Discussions (Q&A / Ideas) | Within **3–5 days**, often faster for popular threads |
| Bug reports (issue tracker) | Triaged within **72 hours** |
| Feature requests | Reviewed in a **weekly sweep**; high-traction ones move to [`ROADMAP.md`](ROADMAP.md) |
| Pull requests | First review within **72 hours**; larger PRs may take longer |
| Security reports (private email) | Acknowledged within **48 hours**; see [`SECURITY.md`](SECURITY.md) for the full timeline |
| Hosted-product support (paying) | Per plan: Agency **1 hour** (SLA), Growth **4 hours**, Starter **12 hours** |

If you've waited meaningfully longer than these targets on an open issue or PR, a polite bump comment is welcome — sometimes things genuinely slip through.

---

## 📋 Before You Ask — the Self-Service Check

A little prep gets you a much faster answer. Before posting:

1. **Search first.** Use the Discussions and Issues search. Chances are someone hit the same wall. Add your 👍 and details to an existing thread rather than opening a duplicate.
2. **Check the wiki.** The [`wiki/`](wiki) holds per-platform setup guides, theme authoring, and troubleshooting. The platform you're struggling with likely has a page.
3. **Read [`usage.md`](usage.md) and [`README.md`](README.md).** The quickstart and usage guide cover the common paths.
4. **Update to the latest version.** A surprising number of reports are already fixed. Check [`CHANGELOG.md`](CHANGELOG.md) and the [Releases page](https://github.com/fedpromptly/fed-poster/releases).
5. **Gather your environment details.** For a bug report, that's the Fed-Poster version, how you're running it (local/Docker/hosted), browser + version, OS, active theme, and the affected platform. The bug report template asks for exactly this.
6. **Check the browser console.** DevTools → Console and Network tabs usually reveal the cause of a posting failure (a 401, a CORS error, a mixed-content block). Paste the red errors into your report — without them, we're guessing.

---

## 🐛 Filing a Great Bug Report

Open a bug via the [Bug Report template](https://github.com/fedpromptly/fed-poster/issues/new?template=bug_report.md). The template asks for the things that matter most: a clear summary, numbered reproduction steps, expected vs. actual behaviour, your environment, screenshots, console errors, and which platform was involved. The single biggest accelerant is a **minimal, reproducible step list** — "I clicked X, then Y, then saw Z" beats "it doesn't work" every time. If a screenshot or screen recording shows the issue, attach it. And please, never paste real tokens or passwords into a report; the template has a section noting this explicitly.

## ✨ Filing a Great Feature Request

Use the [Feature Request template](https://github.com/fedpromptly/fed-poster/issues/new?template=feature_request.md). Lead with the **use case** — the real-world problem you're solving — rather than the specific feature you imagine. State who benefits and roughly how many people. Consider the privacy implications (does this need a backend? a third party? new storage?). Indicate whether you'd be willing to contribute. High-quality, well-argued requests with community 👍s move to the roadmap; vague ones linger. If you're unsure whether something is worth a formal request, float it in [Discussions → Ideas](https://github.com/fedpromptly/fed-poster/discussions/categories/ideas) first.

## 🔒 Security Issues — Do Not Use Public Channels

If you've found a way to leak credentials, bypass the client-side storage protections, inject scripts, or otherwise compromise a user's data, **do not open a public issue or post in Discussions** — that puts users at risk before a fix is ready. Instead, follow the private disclosure process in [`SECURITY.md`](SECURITY.md): email **security@fed-poster.example.com** with a description, reproduction steps, and any code or screenshots. You'll get an acknowledgment within 48 hours and coordination on a fix and disclosure timeline. Reporters are credited in the release notes unless they prefer to remain anonymous.

## 💬 Community Norms

Fed-Poster's support channels are warm and judgement-free. There are no "obvious" questions — if you searched and didn't find an answer, asking is the right move. Answerers are volunteers; be patient and kind, and if you receive help, consider paying it forward by answering the next person's question. Behavioural expectations are codified in [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) and apply equally to askers and answerers. Gatekeeping, snark, and platform-bashing have no home here.

## 💖 Supporting the Project

If Fed-Poster saves you time and you'd like to keep it alive, the most valuable things are not always money: answer a question in Q&A, triage a duplicate issue, improve a wiki page, write a per-platform setup guide, or file a thoughtful bug report. If you'd like to give financially, [Ko-fi](https://ko-fi.com/W3T61ZU5FS) is the primary channel, and every contribution funds new integrations, themes, and the caffeine that powers late-night fixes.

## 📞 Direct Contact

- **General/business:** business@fedpromptly.com
- **Security (private):** security@fed-poster.example.com (see [`SECURITY.md`](SECURITY.md))
- **Hosted-product support (paying customers):** support@fedpromptly.com
- **Everything else:** prefer the public channels above — they're faster and the answers help everyone.

---

<div align="center">
  <sub>🛟 <strong>The right channel + a little prep = the fastest answer. We're glad you're here.</strong></sub>
</div>
