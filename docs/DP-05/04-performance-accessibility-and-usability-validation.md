# DP-05 — Performance, Accessibility and Usability Validation

| Metadata | Value |
|---|---|
| Version | v0.1.0 |
| Status | Draft — Not Approved |
| Approval gate | AG-05 — Not Approved |
| Purpose | Turn approved FA-007 B beta targets into reproducible measurements. |

## 1. Authority and measurement scope

The [Decision Registry](../DP-01/03-decision-registry.md) records FA-007 B as current Product Owner approval. [DP-02 journeys](../DP-02/03-user-journeys-and-permissions.md), [UX](../DP-02/04-ux-and-interaction-specification.md), [DP-04 API](../DP-04/01-api-contract-and-resource-design.md), and [operations](../DP-04/04-infrastructure-and-deployment-operations.md) define the behaviors to measure. These are beta acceptance targets, **not commercial SLAs or current results**. Collect evidence on the release candidate; annotate build, environment, dataset and measurement window per [strategy](01-test-strategy-and-risk-based-coverage.md). GAP-001/002/003/007 remain Open; exclude unresolved dependent workflows from executable scope while reporting the coverage gap. AG-05 is Not Approved.

## 2. Frontend Web Vitals

| ID | Approved target | Measurement contract |
|---|---|---|
| VAL-001 | LCP p75 ≤ 2.5 seconds | Capture actual page-load LCP per page group and device class; show count, p75 and distribution. |
| VAL-002 | INP p75 ≤ 200 milliseconds | Capture real interactions (search/filter, Lesson controls, enrollment, assessment, progress) per page group/device class; show count, p75 and long-tail examples. |
| VAL-003 | CLS p75 ≤ 0.1 | Capture page lifecycle shifts including media/fonts and dynamic assessment UI; show count, p75 and offending elements. |

Page groups: public catalog/search, Path/Course detail, free flagship Lesson, authenticated workspace/progress, enrollment, assessment start/answer/submit/result, Admin author/preview/publish. Evaluate mobile and desktop separately under documented browser/device, viewport, network and cache conditions. Use a representative range of network conditions rather than silently selecting a fast-only profile. Segment by route group, device and release; avoid pooled p75 masking a failing critical group. Record first/new versus returning navigation, sample size and missing-interaction limitations. Initial beta traffic may be too sparse for robust field p75; label such results `Insufficient field sample` and keep the criterion unresolved until representative evidence or a separately approved disposition exists.

Use privacy-safe real-user monitoring (RUM) for field percentiles, with consent/privacy controls and no personal content. Controlled lab runs diagnose regressions using recorded device/network/cache settings and repeatable traces. A Lighthouse score or laboratory p75 alone **does not prove field p75 compliance**. Capture route-group distributions, raw metric export, lab trace and build/environment information. Critical-route failures are reported individually; no unstated exemption is created.

## 3. API performance and load

| ID | Approved target | Measurement contract |
|---|---|---|
| VAL-004 | Read API p95 ≤ 500 ms | Classify `GET`/read operations from API-001–044; calculate p95 from individual request latencies within each representative operation group and overall, with critical operation detail. |
| VAL-005 | Write API p95 ≤ 1,000 ms | Classify state-changing operations; include authentication/ownership, transaction and required provider time in the server boundary, with each critical command shown separately. |
| VAL-006 | HTTP 5xx error rate < 1% | Numerator all HTTP 5xx responses; denominator all completed HTTP requests in the measured workload, plus per-group rates. Timeouts/network failures reported separately and investigated, never hidden. |
| VAL-007 | Initial load test at 50 concurrent virtual users | Sustain 50 concurrent VUs with realistic think time and representative authorized mix; report achieved concurrency, request mix, throughput and errors without inventing an approved throughput target. |

Read groups: catalog/detail/flagship Lesson, own enrollments/Path progress, own Attempt/result, Admin draft/audit. Write groups: Path join/Course enroll, evidence/completion, Attempt start/submit, Admin publish/archive/migration, deletion request. Include a representative mix of Guest, Student and Admin sessions reflecting intended beta usage, and state the chosen percentages as **test assumptions**, not product decisions. Seed published/draft/archived Course versions, enrollments, attempts, notes and deletion cases at a documented scale; test warm and cold-cache conditions. Ensure no workload creates unauthorized personal data or uncontrolled real-user actions.

Before measurement, verify fixture integrity and warm up caches/connections until stable; document the observed stabilization criterion. Select a measurement window long enough to include steady state, asynchronous work and tail latency; document duration and rationale **before execution** based on environment capacity and sample adequacy, without asserting a new normative minute count. Re-run with the same artifact, configuration, seed, mix, concurrency, warm-up and window, and preserve per-request timing/status export and backend traces. State whether latency is client-observed end-to-end or Go server timing; report both where available and never mix them in one percentile. Use nearest-rank percentile or the measurement tool's documented method consistently; report count, percentile method, excluded samples and confidence limitations. Do not discard slow errors or warm-up samples without stating boundaries.

Critical operations (Assessment submit/result, completion, deletion acceptance and access restriction, enrollment/pin) get independent p95/error reporting even if their frequency is low. A slow critical operation cannot hide behind fast catalog reads or an overall aggregate. If an operation genuinely needs a special threshold, propose it for Product Owner approval and keep the existing approved criterion in force until decided. No named Go host, numeric RPO/RTO, commercial SLA or instance size is inferred. Singapore deployment is only conditionally preferred after legal/latency validation.

## 4. Usability studies

| ID | Approved target | Task and pass observation |
|---|---|---|
| VAL-008 | Primary usability task success ≥ 90% | Define each primary task before study; count unassisted completion against a written end state and report numerator/denominator per task. |
| VAL-009 | Guest learning journey success ≥ 90% | Discover a flagship Course, open a free Lesson and complete an ungraded interaction without login; success requires all steps, no forged official status. |
| VAL-010 | Student enrollment-to-assessment journey success ≥ 90% | Sign in, explicitly enroll, find pinned Lesson, satisfy configured requirements, start/submit eligible Assessment and locate Result; success requires correct official state. |
| VAL-011 | No critical usability blocker at beta release; responsive mobile/desktop | Observe stuck, misleading or inaccessible critical flow and classify blocker; inspect both device classes and orientation/reflow. |

Recruit a mix of intended public learners and developers, new and returning users, mobile and desktop users and participants using assistive technology where practicable. Document recruitment criteria, consent, accommodations, device familiarity and exclusions; do not treat convenience sample as population proof. For every task, predeclare start/end, allowed help, time observation, error/recovery and success rubric. Observe without coaching, record task-level attempts, completion, critical misinterpretations and quotes only with consent and minimization. Report each ≥90% calculation separately with numerator, denominator and confidence/sample-size limitations; do not pool a strong Guest task with a weak Student assessment task. Small samples give uncertain percentages; recruit more or mark evidence limited. No critical blocker can be waived as an ordinary UX deviation.

## 5. Accessibility

| ID | Target | Verification |
|---|---|---|
| VAL-012 | WCAG 2.2 AA on critical journeys | Audit Guest discovery/free Lesson, login, enrollment, progress, assessment and own-account privacy request on mobile and desktop. Map each finding to applicable WCAG success criterion and severity. |
| VAL-013 | Keyboard/focus/semantics | Traverse all interactive controls without pointer; verify order, visible focus, focus return after dialogs/errors, semantic roles and names. |
| VAL-014 | Screen-reader/forms/errors | Test representative screen readers/browser combinations; labels, instructions, status/error announcements, question grouping and assessment result context. |
| VAL-015 | Contrast/reflow/interactive content | Measure color/text/control contrast, zoom/reflow, target usability, non-color cues, accessible Lesson Blocks and graded/ungraded interactions. |

Run automated checks on representative pages and component states, then manual keyboard, screen-reader, zoom/reflow and task-based checks. Save tool version, browser/device, page state, screenshots/recordings and criterion mapping. Automation detects a subset of issues; a passing scan alone **does not establish WCAG 2.2 AA**. Triage blockers against the [release gates](05-release-evidence-and-go-no-go-criteria.md). No results are claimed here; [functional scenarios](02-functional-integration-and-e2e-verification.md) and [traceability](06-verification-traceability-and-defect-management.md) provide the related journey and evidence links.
