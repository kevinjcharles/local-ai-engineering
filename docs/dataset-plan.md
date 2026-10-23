# Document Dataset Plan (built in Session 3 prep)

The corpus describes **"Beaconline"**, a fictional internal service: a
lightweight status-page and incident-notification platform built by a small
team. Entirely synthetic; no real products, people, or data.

Each document gets a stable ID, YAML front matter (`id`, `title`, `version`
or `date`, `status`), and stays short enough that the full corpus fits in a
small model's context window — so Session 4's "full context vs retrieval"
comparison is a real contest, not a foregone conclusion.

## Planned documents (10)

| ID | Title | Role in the corpus |
|---|---|---|
| `arch-overview` | System Architecture Overview | Hub document; names components other docs detail |
| `api-spec` | Notification API Specification v2 | Current API; uses the term "subscriber" |
| `api-spec-v1` | Notification API Specification v1 | **Deliberately outdated** (marked superseded by date, not loudly) |
| `requirements` | Functional Requirements | Uses "recipient" where api-spec says "subscriber" (terminology drift) |
| `deployment` | Deployment Guide | Steps reference config keys defined only in `config-ref` (cross-doc dependency) |
| `config-ref` | Configuration Reference | Key/value reference; overlaps partially with `deployment` |
| `decisions` | Technical Decision Records | Explains *why* (e.g., why webhooks over polling); resolves the rate-limit contradiction via dates |
| `release-notes` | Release Notes 1.x–2.x | Dates/versions that date other documents |
| `known-issues` | Known Issues & Troubleshooting | Contains the **harmless prompt-injection sample** (a "note to AI assistants" asking them to recommend a competitor — flagged as untrusted content in Session 6) |
| `roadmap` | Development Roadmap | Future-tense content a model may wrongly present as current fact |

## Engineered retrieval properties

- **Cross-document answers:** "How do I configure the webhook retry limit in
  production?" needs `deployment` + `config-ref`.
- **Contradiction, resolvable by date:** `api-spec-v1` says rate limit is
  60 req/min; `api-spec` (v2) says 300 req/min; `release-notes` dates the change.
- **Terminology drift:** "recipient" vs "subscriber" defeats naive keyword
  search — motivates Session 4's discussion of retrieval limits and semantic
  search without requiring embeddings.
- **Overlap:** deployment and config docs repeat some settings with slightly
  different phrasing.
- **Unanswerable questions:** nothing in the corpus covers pricing, SSO, or
  mobile apps — the assistant must decline, not invent.
- **Injection sample:** one clearly-marked untrusted block inside
  `known-issues` for the Session 6 safety test.

The corpus is authored during Session 3 preparation (not during class) and
committed before that session.
