# 🏛️ Fed-Poster Governance

> How decisions get made, who makes them, and how the community influences the direction of Fed-Poster. Governance here is deliberately lightweight — the project is small, volunteer-maintained, and values velocity and transparency over ceremony. This document exists so that expectations are explicit and so contributors know how to move from "I have an idea" to "it shipped."

<div align="center">
  <img src="https://img.shields.io/badge/model-meritocratic%20benevolent%20maintainer-blue?style=for-the-badge" alt="Governance model" />
  <img src="https://img.shields.io/badge/decisions-transparent%20ADR-success?style=for-the-badge" alt="ADR-driven" />
  <img src="https://img.shields.io/badge/community-discussions--driven-orange?style=for-the-badge" alt="Community-driven" />
</div>

---

## 🧭 Governance Model

Fed-Poster operates under a **meritocratic, benevolent-maintainer** model. Day-to-day, the maintainer team (currently a single lead maintainer, expandable as trusted contributors emerge) holds final decision authority over what merges, what releases, and how the project is run. Authority is exercised transparently: architectural decisions are recorded as ADRs (see [`ADR.md`](ADR.md)), priorities are published in [`ROADMAP.md`](ROADMAP.md), and significant changes land via pull requests that the community can see and comment on.

The model is *meritocratic* in that sustained, high-quality contributors earn review authority and, over time, merge authority — not by title, but by demonstrated judgement and reliability. It is *benevolent* in that the maintainers' north star is the project's stated vision (privacy-first, browser-native, free and open) and the community's collective interest, not personal preference or commercial pressure. It is *not* a democracy: popularity alone does not merge a change, because some decisions have security, privacy, or architectural consequences that the maintainer team is accountable for and best positioned to judge.

## 👥 Roles

### Contributors
Anyone who opens a pull request, files a well-researched issue, answers questions in Discussions, improves documentation, or writes a wiki page. Contributors retain copyright over their own work and agree, by submitting, that it will be licensed under the project's MIT License (see [`COPYING.md`](COPYING.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md)). No formal role is required to contribute — start with a "good first issue" or a Discussion.

### Triagers
Contributors recognised for consistently high-quality issue triage — reproducing bugs, labelling, routing, and closing duplicates. Triagers help keep the issue tracker navigable and have permission to apply and remove labels. Triager status is granted by a maintainer after a track record of helpful, accurate triage; it is not a permanent title and reflects ongoing involvement.

### Reviewers
Contributors with the authority to review pull requests and request changes. A reviewer's approval signals that a change is sound; final merge authority remains with maintainers. Reviewers are appointed by maintainers based on demonstrated domain expertise (e.g. a contributor who reliably lands clean platform integrations may become a reviewer for platform-related PRs).

### Maintainers
The maintainers hold final merge authority, set the release cadence, accept or reject ADRs, and are accountable for the project's security posture and the integrity of the privacy promise. Maintainers follow the operating protocol in [`AGENTS.md`](AGENTS.md) and the contribution rules in [`CONTRIBUTING.md`](CONTRIBUTING.md). New maintainers are added by existing maintainer consensus after sustained, high-trust contribution and a demonstrated commitment to the project's vision and code of conduct.

### The Community
Every user, voter in a Discussions poll, 👍-er on a feature request, and Ko-fi supporter. The community shapes priorities through signal (see "How Priorities Get Set" below) and is the reason the project exists. The community does not vote on merges, but its aggregated, well-argued input carries substantial weight.

## 🗳️ How Priorities Get Set

Priority is a function of three signals, weighted by maintainer judgement and capacity:

First, **community signal** — the volume and quality of interest in Discussions polls, 👍 reactions on feature requests, and real-world use cases articulated in Q&A. A feature with a hundred 👍s and three concrete use cases outranks one with a single vague request. Second, **maintainer capacity** — Fed-Poster is volunteer-maintained, so even a popular feature ships only when someone has the time to build and maintain it. Third, **platform API reality** — an integration may jump up or fall off the roadmap based on a platform's API changes, deprecation, or new restrictions.

A fourth, overriding filter is the **privacy and security gate**: any proposal that risks the core privacy promise (credentials leaving the device, a mandatory backend, telemetry, unofficial API abuse) is deprioritized or rejected regardless of popularity. This is non-negotiable and codified in ADR-001 and ADR-002.

The full, current priority list lives in [`ROADMAP.md`](ROADMAP.md), which is updated as signals and capacity shift.

## 🧱 How Decisions Get Made

### Routine changes (bug fixes, features, docs, themes)
A contributor opens a pull request using the template in `.github/PULL_REQUEST_TEMPLATE.md`. A reviewer or maintainer reviews against the checklist in [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`CLAUDE.md`](CLAUDE.md). Approvals and merge happen when the change meets the definition of done. Small, uncontroversial changes can merge with one approval; larger changes benefit from two. The maintainer team aims to triage PRs within 72 hours.

### Architectural decisions
Any change that alters where data lives, introduces a framework or build step, adds a third-party runtime dependency, changes the licence, or affects the privacy/security posture is **architectural** and must be captured as an Architecture Decision Record (ADR) in [`ADR.md`](ADR.md) before merge. ADRs move from `Proposed` to `Accepted` by maintainer review; they are never silently edited after acceptance — a superseding ADR links back to the one it replaces. The community is encouraged to comment on Proposed ADRs in Discussions before they are accepted.

### Security decisions
Follow the private disclosure process in [`SECURITY.md`](SECURITY.md). Security fixes are never debated in public issues; they ship as patches with a changelog entry and, where appropriate, a coordinated disclosure. See ADR-009 for the versioning convention.

### Roadmap and releases
The maintainer team owns [`ROADMAP.md`](ROADMAP.md) and the release cadence (see [`DEPLOYMENT.md`](DEPLOYMENT.md) and [`CHANGELOG.md`](CHANGELOG.md)). Releases are tagged following Semantic Versioning (ADR-009) and announced in Discussions → Announcements.

## 🤝 Conflict Resolution

Most disagreements resolve through ordinary discussion in a PR or Discussion thread. When a disagreement persists, the path is: (1) clarify the use case and the constraint, (2) seek a compromise that preserves the privacy promise, (3) if still unresolved, the maintainer team makes the call and records the reasoning. Decisions that close a Discussion or reject a PR include a brief written rationale so the reasoning is visible.

Behavioural conflicts (harassment, personal attacks, sustained unprofessional conduct) are handled under [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), which has its own enforcement process and escalation path. Governance disputes and conduct disputes are kept separate: you can disagree with a technical decision without it being a conduct matter, and vice versa.

## 🔄 Becoming a Maintainer

There is no application form. Maintainers emerge from contributors who, over time, demonstrate reliability, sound judgement aligned with the project's vision, respectful collaboration, and a willingness to do the unglamorous work (triage, review, docs, releases). When the existing maintainers agree that a contributor meets this bar, they are invited to join. The expectation in return is continued participation, adherence to the code of conduct, and stewardship of the privacy promise. A maintainer who steps back does so gracefully; emeritus status is acknowledged with thanks.

## 💰 Financial Governance

Fed-Poster is funded through Ko-fi community tips (see `.github/FUNDING.yml` and ADR-007) and the separate hosted commercial tiers at fedpromptly.com described in [`PRICING.md`](PRICING.md). Funding is voluntary and does not purchase merge authority, roadmap priority, or special treatment — a supporter's PR is reviewed by the same bar as anyone else's. The maintainer team is accountable for using funds to advance the project (new integrations, theme design, infrastructure, and the occasional coffee); significant expenditures are noted in Announcements. The project carries no venture obligations and no in-dashboard ads or telemetry.

## 📜 Amendments to This Document

Changes to this governance document are themselves architectural in flavour: propose the change in a Discussion, capture it as an ADR if significant, and merge via PR with maintainer review. The goal is to keep governance lightweight and explicit, never to let it ossify into ceremony.

---

<div align="center">
  <sub>🏛️ <strong>Lightweight, transparent, privacy-gated. Authority is earned and exercised in the open.</strong></sub>
</div>
