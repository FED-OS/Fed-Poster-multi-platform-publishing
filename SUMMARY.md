# 📄 Fed-Poster — Executive Summary

> A one-stop overview of the Fed-Poster project: what it is, who it's for, how it's built, how it's governed, and where it's going. If you read only one file, read this one — then jump to the linked deep-dives for detail.

<div align="center">
  <img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/platforms-12%2B-blue?style=for-the-badge" alt="Platforms" />
  <img src="https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/version-1.x-brightgreen?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/build%20step-none-orange?style=for-the-badge" alt="No build step" />
</div>

---

## What Fed-Poster Is

**Fed-Poster** is a privacy-first, browser-native dashboard for cross-posting a single message to **twelve or more social platforms** — Telegram, Bluesky, Mastodon, Discord, GitHub (Gist and Repo), Tumblr, DeviantArt, SafeW, plus the closed-network reach of Twitter/X, LinkedIn, Facebook, and Instagram via the Buffer and WordPress Jetpack proxy bridges. The defining characteristic is that **there is no required backend and no server-side credential store**: a user's tokens live in their browser's `localStorage`, and posts go directly from the browser to each platform's API over HTTPS. The result is a tool a creator can run by literally opening an HTML file, with a verifiable privacy promise baked into the architecture rather than promised in a policy.

The product ships as a static, multi-page site with a hand-built CSS design-token system powering twelve switchable themes (Deep Space, Cyberpunk, Synthwave, and friends), a shared vanilla-JavaScript layer, and per-page modules for the dashboard composer, a scheduling calendar, an analytics view, settings, pricing, and a branded 404 page. It is MIT-licensed and funded through Ko-fi community tips and a separate set of hosted commercial tiers rather than by ads, telemetry, or paywalling the open-source build.

## Who It's For

Three audiences overlap meaningfully. **Solo creators and bloggers** want to share one link or thought across five networks in a single click without re-typing it five times or surrendering their accounts to a black-box SaaS. **Busy entrepreneurs, agencies, and full-time creators** want done-for-you content, AI-assisted variants, scheduling, and analytics — the use cases the Growth tier addresses. **Marketing agencies, SaaS resellers, and digital service providers** want white-label rights, unlimited client accounts, a custom domain, and API access — the Agency tier. Developers and the privacy-conscious round out the audience: they value the no-backend architecture, the open source, and the ability to self-host by opening a file.

## How It's Built

The shipped code is **vanilla HTML, CSS, and JavaScript with no build step and no framework** — a deliberate choice documented in ADR-003, kept because "opens in a browser instantly" is treated as a first-class feature. Visual consistency flows from a CSS custom-property design system in `assets/fedposter.css`, where semantic tokens (`--bg-card`, `--accent`, `--text-primary`, `--radius`, and so on) are defined on `:root` and overridden per theme via `[data-theme="…"]`. A shared `assets/fedposter.js` handles theme persistence (`localStorage.fedposter_theme`), the mobile nav, scroll-reveal, and the live Discord-count badge. Per-page modules (`dashboard`, `calendar`, `analytics`, `settings`, `pricing`, `error`) layer page-specific behaviour on top.

Credential storage is namespaced under `fedposter_*` in `localStorage` (ADR-002), drafts use `IndexedDB` where size demands it, and every outbound call is HTTPS. Platforms that require OAuth or block direct browser calls (Tumblr, SafeW, DeviantArt) are bridged through **stateless** Supabase Edge Functions that store nothing and log no secrets (ADR-005). Closed networks (Twitter, LinkedIn, Facebook, Instagram) are reached via Buffer and WordPress Jetpack proxy bridges so Fed-Poster never touches their credentials directly (ADR-006). An optional Node/Express scheduling daemon exists for self-hosters who need posts to fire while the browser is closed, but it is not required for any posting flow.

The README's "Tech Stack" table references React, TypeScript, Tailwind, and Framer Motion as an aspirational future stack; ADR-010 (Proposed) tracks a possible v2 rewrite but the current, supported release line remains vanilla. Contributors should treat the actually-shipped code as the source of truth, as `CLAUDE.md` and `AGENTS.md` make explicit.

## Governance and Community

Fed-Poster is volunteer-maintained and community-driven. Decisions of lasting consequence are recorded as Architecture Decision Records in `ADR.md`; project direction is published transparently in `ROADMAP.md` and shaped by Discussions polls and feature-request traction. Contribution norms live in `CONTRIBUTING.md`, behaviour expectations in `CODE_OF_CONDUCT.md`, and the support model and response-time expectations in `SUPPORT.md`. Security vulnerabilities follow a private-disclosure process described in `SECURITY.md` — never a public issue. Funding is declared in `.github/FUNDING.yml` with Ko-fi as the primary channel, and the project carries no in-dashboard ads and no telemetry, a stance formalized in ADR-007.

## Pricing

The open-source repository is free and fully functional. The **hosted** commercial product at fedpromptly.com offers three tiers: **Starter** ($27/month) for unlimited posts across 500+ platforms with scheduling and analytics; **Growth** ($147/month) adding done-for-you content and AI image/video generation; and **Agency** ($497/month) adding white-label rights, unlimited client accounts, a custom domain, and API access. A 7-day free trial requires no credit card. Full detail and the competitor comparison table live in `PRICING.md`.

## Where It's Going

The roadmap pursues three durable themes: **more reach** (Nostr, Pixelfed, Threads, Reddit, LinkedIn direct, YouTube, Medium, Substack), **more control** (drafts and templates, AI-assisted content, queues and bulk scheduling, webhooks, team/agency workspaces, a browser extension, optional encrypted cloud sync), and **deeper trust** (CSP/SRI hardening, an optional self-hosted scheduling daemon, automated visual regression across all twelve themes, and i18n groundwork). The single significant architectural question open for community input is ADR-010 — whether to begin a React/TypeScript v2 track without abandoning the v1 static build or the no-backend privacy property.

## Key Documents at a Glance

| If you want to… | Read |
|------------------|------|
| Get started / install | `README.md`, `usage.md` |
| Understand the architecture and hard rules | `CLAUDE.md`, `ADR.md` |
| Contribute code | `CONTRIBUTING.md`, `AGENTS.md` |
| See what's planned | `ROADMAP.md` |
| Deploy it | `DEPLOYMENT.md` |
| Know what shipped when | `CHANGELOG.md` |
| Report or read about security | `SECURITY.md` |
| Understand pricing | `PRICING.md` |
| Get help | `SUPPORT.md` |
| See how the project is run | `GOVERNANCE.md`, `CODE_OF_CONDUCT.md` |
| Per-platform setup | `wiki/` |

---

<div align="center">
  <sub>📮 <strong>One Dashboard. Twelve Platforms. Zero Hassle.</strong> Privacy by architecture, not by promise.</sub>
</div>
