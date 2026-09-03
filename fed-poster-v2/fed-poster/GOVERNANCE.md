# 🏛️ Fed-Poster Governance

<div align="center">
  <img src="https://img.shields.io/badge/governance-meritocratic%20open%20source-blue?style=for-the-badge" alt="Governance" />
  <img src="https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge" alt="License" />
</div>

This document describes how the Fed-Poster project is governed: roles, decision-making, and how contributions become part of the official project. It is inspired by the [Meritocratic Governance Model](https://producingoss.com/en/governance-models.html) and adapted to our community's needs.

---

## 🎯 Project Vision

Fed-Poster aims to be the **most trustworthy, open-source, multi-channel publishing dashboard** — letting creators cross-post to every platform they care about from one workspace, with full data ownership and no lock-in. Governance exists to protect that vision and the people who build it.

---

## 👥 Roles & Responsibilities

### 1. Contributors

Anyone who submits a pull request, issue, discussion contribution, documentation, design, or translation is a **Contributor**.

- Submit PRs and issues following [CONTRIBUTING.md](CONTRIBUTING.md).
- Adhere to the [Code of Conduct](CODE_OF_CONDUCT.md).
- Gain recognition through sustained, quality contributions.

### 2. Triagers

Triagers help manage the issue/PR queue. Appointed by Maintainers after consistent, helpful community involvement.

**Responsibilities:**
- Triage and label incoming issues.
- Reproduce bugs and link duplicates.
- Help answer questions in Discussions.
- Close stale/invalid issues (per policy).

**Privileges:** Triage permissions on the repository.

### 3. Maintainers

Maintainers have commit access and are responsible for the technical health of the project. Appointed by the Core Team based on sustained, high-quality contributions and good judgment.

**Responsibilities:**
- Review and merge PRs (at least one approval required; two for large changes).
- Maintain code quality, tests, and CI.
- Make architectural decisions (recorded as ADRs — see [ADR.md](ADR.md)).
- Cut releases and write the changelog.
- Mentor contributors and triagers.

**Privileges:** Write access to the repository, release permissions.

### 4. Core Team (Steering Committee)

A small group responsible for the project's direction and health. Currently seeded by FED-OS / fedpromptly.com as the founding maintainer organization.

**Responsibilities:**
- Define roadmap and milestones ([ROADMAP.md](ROADMAP.md)).
- Approve major architectural or scope changes.
- Mediate disputes and enforce the Code of Conduct.
- Manage funding, sponsorship, and infrastructure.
- Appoint and remove Maintainers.

**Decision making:** The Core Team aims for **consensus**. If consensus cannot be reached, a **2/3 majority** vote of active Core Team members decides.

---

## 🗳️ Decision-Making Process

### Small / Routine Decisions
Maintainers decide through PR review. Examples: bug fixes, dependency bumps, minor features, docs.

### Medium Decisions
Discussed in an issue or Discussion; a Maintainer proposes a path; a second Maintainer approves. Examples: new platform adapters (see [ADR-0007](ADR.md)), minor API changes.

### Large / Strategic Decisions
Require an **Architecture Decision Record (ADR)** and Core Team approval. Examples: changing the license, switching the framework, major refactors, security architecture. Examples: [ADR.md](ADR.md).

> 📝 **All non-trivial architectural decisions are recorded as ADRs.** Once accepted, an ADR is only superseded by a new ADR — never silently deleted.

---

## 🔁 How to Become a Maintainer

1. Be an active Contributor with merged PRs and helpful issue triage.
2. Demonstrate sound judgment, respectful communication, and reliability.
3. Be nominated by an existing Maintainer.
4. Core Team reviews nominations; appointment requires majority approval.
5. New Maintainers start with a **30-day onboarding mentorship**.

Maintainers who are inactive for **6 months** may be moved to *Emeritus* status (honorary, no commit access), and can return when active again.

---

## ⚖️ Code of Conduct Enforcement

The Core Team is responsible for enforcing the [Code of Conduct](CODE_OF_CONDUCT.md). Reports go to **conduct@fedpromptly.com** and are handled confidentially. See the Code of Conduct for the enforcement ladder.

---

## 🔄 Changes to Governance

Changes to this document require a Core Team vote (2/3 majority) and a 7-day public comment period in Discussions before adoption. The change is recorded in the repository history.

---

## 📅 Cadence

| Activity               | Frequency      |
|------------------------|----------------|
| Maintainer sync (async)| Weekly (GitHub Discussions / issue board) |
| Core Team meeting      | Monthly        |
| Roadmap review         | Quarterly      |
| Governance review      | Annually       |

---

## 📜 License & Ownership

Fed-Poster is licensed under the **MIT License** ([LICENSE](LICENSE), [COPYING.md](COPYING.md)). Contributions are accepted under the same license (see the Developer Certificate of Origin in CONTRIBUTING.md). The FED-OS / fedpromptly.com entity holds the copyright for the original codebase; contributors retain copyright of their contributions.

---

<div align="center">
  <sub>🏛️ <strong>Open by default, transparent by design, fair to all.</strong></sub>
</div>
