# 📑 Fed-Poster — Project Summary

<div align="center">
  <img src="https://img.shields.io/badge/version-2.0-brightgreen?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/platforms-20%20direct%20%2B%20450%2B%20via%20Zapier-blue?style=for-the-badge" alt="Platforms" />
</div>

A one-page summary of the Fed-Poster project for quick orientation. For depth, follow the linked documents.

---

## What is Fed-Poster?

Fed-Poster is an **open-source, browser-first multi-channel publishing dashboard**. You compose once, select your platforms, and publish everywhere — with full ownership of your data. It supports ~20 direct integrations and 450+ additional platforms via Zapier.

- **Repo:** https://github.com/FED-OS/Fed-Poster
- **Org:** FED-OS / fedpromptly.com
- **License:** MIT (see [LICENSE](LICENSE), [COPYING.md](COPYING.md))
- **Status:** Active, Beta

---

## The 200% Upgrade at a Glance

This upgrade transformed Fed-Poster from a basic landing page into a **production-grade, community-ready open-source project**:

| Area                  | Before                          | After                                           |
|-----------------------|---------------------------------|-------------------------------------------------|
| Code structure        | Inline CSS in `index.html`      | External `styles.css` (themable)                |
| Governance            | None                            | [GOVERNANCE.md](GOVERNANCE.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) |
| Contribution flow     | None                            | [CONTRIBUTING.md](CONTRIBUTING.md), issue & PR templates |
| Security              | Basic SECURITY.md               | Hardened [SECURITY.md](SECURITY.md), version table, hardening checklist |
| Architecture history  | None                            | [ADR.md](ADR.md) — 10 recorded decisions        |
| Direction             | None                            | [ROADMAP.md](ROADMAP.md) — milestones & backlog |
| Releases              | None                            | [CHANGELOG.md](CHANGELOG.md) — SemVer + Keep a Changelog |
| Deployment            | Implied                         | [DEPLOYMENT.md](DEPLOYMENT.md) — 5 options + checklist |
| AI-assisted dev       | None                            | [CLAUDE.md](CLAUDE.md), [AGENTS.md](AGENTS.md)  |
| Community             | None                            | Discussions, funding, wiki, social previews     |
| Maintenance           | Manual                          | [Dependabot](.github/dependabot.yml), FUNDING   |

---

## Repository Map

```
Fed-Poster/
├── index.html                  # Landing dashboard (static)
├── styles.css                  # Extracted, themable CSS
├── README.md                   # Project overview & quick start
├── usage.md                    # Detailed usage guide
├── PRICING.md                  # Pricing tiers
├── CHANGELOG.md                # Release history (SemVer)
├── ROADMAP.md                  # Future direction
├── ADR.md                      # Architecture Decision Records
├── DEPLOYMENT.md               # Deployment options & checklist
├── SUMMARY.md                  # This file
├── CONTRIBUTING.md             # How to contribute
├── CODE_OF_CONDUCT.md          # Community standards
├── GOVERNANCE.md               # Roles & decision-making
├── SECURITY.md                 # Security policy
├── SUPPORT.md                  # Getting help
├── COPYING.md                  # License details
├── CITATIONS.md                # How to cite the project
├── LICENSE                     # MIT license
├── CLAUDE.md                   # Guidance for Claude (AI agent)
├── AGENTS.md                   # General AI-agent protocol
├── todo.md                     # Execution / planning log
├── bug_report.md               # Root bug report template
├── feature_request.md          # Root feature request template
├── PULL_REQUEST_TEMPLATE.md    # Root PR template
├── .gitignore
├── .github/
│   ├── dependabot.yml          # Dependency automation
│   ├── FUNDING.yml             # Sponsorship buttons
│   ├── DISCUSSION_WELCOME_README.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       ├── feature_request.md
│       └── custom.md
└── assets/
    └── social-preview/
        └── README.md           # Social preview generation prompts
```

---

## Key Facts

- **Tech:** Static front-end (HTML/CSS/JS); optional Supabase Edge Functions for OAuth proxies; optional Zapier for 450+ platforms.
- **Integrations (direct):** Facebook, YouTube, Instagram, TikTok (limited), X, LinkedIn, Reddit, Discord, Telegram, Medium, WordPress, GitHub (limited), GitLab (limited), + more (see README).
- **Integrations (via Zapier):** 450+ (Twitch, Tumblr, Quora, WeChat, Snapchat, Pinterest, VK, …).
- **Credentials:** OAuth tokens only, stored in the browser `localStorage`. No passwords, no server-side user data.
- **Self-host:** Fully supported (see [DEPLOYMENT.md](DEPLOYMENT.md)).

---

## Where to Start

| You want to…          | Read this                                  |
|-----------------------|--------------------------------------------|
| Use Fed-Poster        | [usage.md](usage.md)                       |
| Deploy it             | [DEPLOYMENT.md](DEPLOYMENT.md)             |
| Contribute            | [CONTRIBUTING.md](CONTRIBUTING.md)         |
| Understand decisions  | [ADR.md](ADR.md)                           |
| See what's planned    | [ROADMAP.md](ROADMAP.md)                   |
| Report a security bug | [SECURITY.md](SECURITY.md)                 |
| Cite the project      | [CITATIONS.md](CITATIONS.md)               |
| Get help              | [SUPPORT.md](SUPPORT.md)                   |

---

<div align="center">
  <sub>📑 <strong>Everything in its place, and a place for everything.</strong></sub>
</div>
