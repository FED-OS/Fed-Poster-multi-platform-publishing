# 📚 CITATIONS — How to Cite Fed-Poster

> If you reference Fed-Poster in academic work, a published comparison, a tutorial, or a dataset, please cite it. This keeps the project discoverable and gives credit to the contributors. The project does not currently have a DOI; use the repository and release tags as persistent references.

## Recommended Citation (APA-style)

> The Fed-Poster Contributors. (2024). *Fed-Poster: A privacy-first, browser-native multi-platform social publishing dashboard* (v1.x) [Computer software]. GitHub. https://github.com/fedpromptly/fed-poster

## Recommended Citation (IEEE-style)

> The Fed-Poster Contributors, "Fed-Poster: A privacy-first, browser-native multi-platform social publishing dashboard," v1.x. GitHub repository, 2024. [Online]. Available: https://github.com/fedpromptly/fed-poster

## BibTeX Entry

```bibtex
@software{fedposter,
  author       = {{The Fed-Poster Contributors}},
  title        = {{Fed-Poster: A privacy-first, browser-native
                  multi-platform social publishing dashboard}},
  year         = {2024},
  version      = {1.x},
  url          = {https://github.com/fedpromptly/fed-poster},
  note         = {MIT licensed; static HTML/CSS/JS; no required backend.
                  Credentials stored client-side in localStorage.}
}
```

## Citing a Specific Release

If you depend on a specific version, cite the release tag rather than `main` so your reference is reproducible:

```bibtex
@software{fedposter_v1_2_0,
  author       = {{The Fed-Poster Contributors}},
  title        = {{Fed-Poster: A privacy-first, browser-native
                  multi-platform social publishing dashboard}},
  year         = {2024},
  version      = {1.2.0},
  url          = {https://github.com/fedpromptly/fed-poster/releases/tag/v1.2.0},
  note         = {Release v1.2.0}
}
```

Replace the version, year, and tag URL with the release you actually used. Releases are listed on the [Releases page](https://github.com/fedpromptly/fed-poster/releases) and summarised in [`CHANGELOG.md`](CHANGELOG.md).

## Attribution in Derivative Works

If you fork or rebrand Fed-Poster, the MIT License requires only that you retain the copyright and permission notice (see [`COPYING.md`](COPYING.md)). As a courtesy, we additionally ask that you credit the upstream project in your documentation, for example:

> "Based on Fed-Poster by The Fed-Poster Contributors (https://github.com/fedpromptly/fed-poster), used under the MIT License."

## Related Work to Cite Alongside

When discussing the privacy or architectural approach, the following concepts and prior art may be relevant context (not affiliated, cited for completeness):

- **OAuth 2.0** — Hardt, D. (2012). *The OAuth 2.0 Authorization Framework*. RFC 6749. https://datatracker.ietf.org/doc/html/rfc6749
- **ActivityPub** — W3C Recommendation, federated social networking protocol used by Mastodon. https://www.w3.org/TR/activitypub/
- **AT Protocol** — Bluesky's authenticated transfer protocol. https://atproto.com/
- **Content Security Policy** — West, M., et al. *Content Security Policy Level 3*. W3C. https://www.w3.org/TR/CSP3/
- **Keep a Changelog** — https://keepachangelog.com/ — the changelog format Fed-Poster follows (see [`CHANGELOG.md`](CHANGELOG.md)).
- **Semantic Versioning 2.0.0** — https://semver.org/ — the versioning scheme Fed-Poster follows (ADR-009).

## Key Architectural References

For work analysing the architecture, cite the relevant ADRs in [`ADR.md`](ADR.md):

- **ADR-001** — Run fully client-side, no required backend.
- **ADR-002** — Credentials in localStorage, namespaced `fedposter_*`.
- **ADR-003** — Vanilla HTML/CSS/JS over a framework; no build step.
- **ADR-005** — Stateless Supabase Edge Functions for OAuth bridges.
- **ADR-006** — Buffer & WordPress Jetpack as proxy bridges for closed platforms.

## Contact for Citation Questions

If you need a formal letter of attribution, a specific citation format not listed here, or want to notify us that you've cited the project, reach out via [GitHub Discussions](https://github.com/fedpromptly/fed-poster/discussions) or email **business@fedpromptly.com**.

---

<div align="center">
  <sub>📚 Cite the release tag you used, not <code>main</code>, for reproducibility.</sub>
</div>
