# Pyscape Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** 2025-10-08  
**Owner:** Product / Founding Team  
**Status:** Draft for MVP Execution

---
## 1. Executive Summary
Pyscape is an adaptive Python + AI learning platform guiding beginners and career switchers from fundamentals to a portfolio-worthy project. The MVP focuses on a tight learning loop: interest selection → personalized roadmap → module lessons (reading, quiz, coding) → auto-grading → guided project lab → portfolio export. Delivery target: Early December 2025 (8-week execution window).

Success = Demonstrating measurable user progression, retention through the first project unlock, and a compelling exportable portfolio artifact.

---
## 2. Problem Statement
Learners struggle to stay motivated and achieve structured progression in Python/AI:
- Overwhelm from fragmented content and lack of sequencing.
- Practice platforms lack applied context and narrative progression.
- Slow time-to-first win reduces retention.
- Few platforms convert early momentum into a finishable project + portfolio output.

Pyscape addresses these through adaptive sequencing, fast feedback, guided application, and portfolio generation.

---
## 3. Vision
Become the most motivating on-ramp to Python + Applied AI that turns curiosity into a completed first project within weeks.

**Tagline:** Learn. Apply. Ship your first AI project.

---
## 4. Target Users & Personas
| Persona | Motivation | Pain | Success Definition |
|---------|-----------|------|--------------------|
| Aspiring Switcher (Primary) | Career transition | Too many unfocused resources | Completes roadmap + project + exports portfolio |
| University Student | Reinforce learning | Theory-heavy curriculum | Finishes structured path & project |
| Motivated Hobbyist | Personal growth | Hard to sustain focus | Reaches project completion quickly |
| Bootcamp Completer (Phase 2) | Momentum maintenance | Post-bootcamp drift | Builds second portfolio artifact |

---
## 5. Core User Journeys
1. **First Session:** Sign up → Interest selection (Reddit-style multi-tag chooser) → Roadmap generated → Start first module → First pass on a coding problem.
2. **Learning Loop:** Visit dashboard → See “Next Up” → Complete lesson/problem → Gain XP → Progress bar updates.
3. **Project Unlock:** Reach XP threshold → Start Sentiment Analyzer lab → Complete guided steps.
4. **Portfolio Export:** After project completion → Export PDF / Markdown artifact with metrics + achievements.
5. **Roadmap Refresh (Optional):** User revisits interest selector → adjusts topics → regenerated roadmap with explanation of changes.

---
## 6. MVP Scope
### In (MUST HAVE)
- Authentication & profile (Supabase)
- Interest selection (Reddit-style UI with categories, search, multi-select)
- Topic-driven rule-based roadmap (deterministic; no quiz dependency)
- 3 modules × 3 lessons each (mixed: read/quiz/code)
- 5 auto-graded coding problems
- Docker (or service) based execution + hidden test cases
- XP system + basic badges + unlock threshold
- Single guided Sentiment Analyzer project lab
- Portfolio generation (Markdown → PDF)
- Events tracking for analytics (TTFP, unlock, completion, interest selection)
- Dashboard with progress & next recommendation

### Phase 2 (Post-MVP)
- Real-time code duels, leaderboards
- Multiple project labs
- Adaptive difficulty (IRT/BKT)
- AI tutor chat
- Social sharing & peer review
- Expanded algorithm visualizers
- Advanced ML sandbox features

### Explicitly Out (Now)
- Payments/subscriptions
- Mobile native app
- Multi-tenant org accounts
- Complex microservices
- Collaborative editing

---
## 7. Functional Requirements
### 7.1 Interest Selection (Topic Tagging)
- UI: Reddit-style grid/list of topic chips with category filters, search, popularity hints.
- User can select 3–10 topics; soft minimum prompt at <3.
- Data stored as `profiles.selected_topics` (TEXT[]).
- Includes: quick-pick suggestions (e.g., "Get Started", "AI Path", "Data Analysis").
- Accessibility: fully keyboard navigable (arrow focus + space to toggle).
- Roadmap generation triggered on confirm; < 2s response target.

### 7.2 Roadmap Generator
- Inputs: selected_topics[] only (no quiz in MVP).
- Matching heuristic: tag overlap + prerequisite completeness + diversity penalty to avoid clustering.
- Outputs: ordered modules with: rank, reason (human-readable, e.g., "Foundational for ML topics you chose"), prerequisites[], difficulty, estimated_hours.
- Stored in `recommendations.roadmap`.
- Regenerates on topic changes or user-triggered refresh; diff explanation (e.g., "2 modules added due to new 'data-visualization' interest").

### 7.3 Modules & Lessons
- Module: id, title, difficulty, prerequisites[]
- Lesson types: read | quiz | code | labTrigger
- Quiz lessons: 3–5 questions, instant feedback
- Code lessons: statement + editor + run + submit → graded
- Progress persisted in `progress`

### 7.4 Auto-Grader
- Accepts submission: { user_id, problem_id, language, code }
- Runs tests under resource limits (time, memory)
- Returns: status, passed_count, failed_count, runtime_ms, feedback
- Stores in `submissions`

### 7.5 Project Lab (Sentiment Analyzer)
Expected Steps:
1. Dataset ingestion
2. Cleaning / preprocessing
3. Feature extraction
4. Model training (baseline)
5. Evaluation (accuracy, F1)
6. Report assembly
- Auto-validation rules per step (regex / static inspection / test harness)
- Artifacts stored in `artifacts`

### 7.6 Portfolio Generation
- Aggregates: modules completed, submission stats, project metrics, badges
- Markdown template → client PDF render (fallback: raw Markdown)

### 7.7 Gamification
- XP events: lesson completion, first pass, project step, streak (Phase 2)
- Badges: First Submission, First Pass, Project Complete
- Level formula: `level = floor( sqrt(XP) / k )` (k tuned empirically)

### 7.8 Dashboard
- Panels: Next Up, XP & Level, Roadmap snapshot, Project status
- “Next Up” = earliest incomplete recommended module’s first incomplete lesson

### 7.9 Events Tracking
Events table: `type`, `user_id`, `meta`, `ts`
Tracked events: interests_selected, roadmap_generated, lesson_completed, submission_passed, project_step_completed, portfolio_exported

### 7.10 Admin / Internal Tools (Light)
- Script to seed content
- Manual roadmap regeneration command

---
## 8. Non-Functional Requirements
| Category | Requirement |
|----------|------------|
| Performance | Grader p95 latency < 8s; dashboard TTI < 1.5s cached |
| Availability | Single-node acceptable; graceful restarts |
| Security | No network egress from executor; RLS enforced; code scanning pre-run |
| Scalability | Support 500 DAU on single DB + worker node |
| Reliability | Grader infra failure rate < 2% |
| Observability | Submission lifecycle logs; event aggregation views |
| Accessibility | Keyboard nav, semantic markup, contrast compliance |
| Privacy | Only minimal PII (email); deletion path available |
| Maintainability | Modular service boundary (grading isolated) |
| Portability | Docker-based executor; reproducible dev env |

---
## 9. Data Model
```
users(id, email, handle, created_at)
profiles(id, full_name, nickname, onboarding_completed, selected_topics[], ...)
modules(id, title, difficulty, prerequisites[])
lessons(id, module_id, type, order_index)
problems(id, lesson_id, lang, starter_code, tests_hidden)
submissions(id, user_id, problem_id, status, score, runtime_ms, created_at)
events(id, user_id, type, meta jsonb, ts)
progress(user_id, lesson_id, state, score, updated_at)
gamification(user_id, points, badges[])
projects(id, title, steps jsonb, repo_template)
artifacts(id, user_id, project_id, step, s3_key, created_at)
recommendations(user_id, roadmap jsonb, updated_at)
```
`recommendations.roadmap` example (topic-based):
```json
{
  "generated_at": "2025-10-08T10:00:00Z",
  "algorithm_version": "rule-1.0",
  "selected_topics": ["basics", "ml_intro"],
  "modules": [
    {"module_id": 1, "rank": 1, "title": "Python Fundamentals", "reason": "Core gap detected", "difficulty": "beginner", "prerequisites": [], "estimated_hours": 6},
    {"module_id": 2, "rank": 2, "title": "Data Structures", "reason": "Supports ML readiness", "difficulty": "beginner", "prerequisites": [1]}
  ]
}
```

---
## 10. Architecture Overview
### Frontend
- React + Tailwind; React Query adoption planned
- Supabase JS client for auth & data
- Monaco editor (roadmap replacement for CodeMirror if needed)
- Client-side PDF generation (html2pdf / jsPDF)

### Backend (Transition Plan)
Phase 1 (MVP): Supabase (Postgres + Auth) + lightweight serverless/edge (optional) for PDF or grader proxy.
Phase 1 Grader: Direct container runner or external API abstraction (Judge0 fallback if schedule risk high).
Phase 1 Security: Docker seccomp, no network, CPU/mem limits, ephemeral FS.
Phase 2: FastAPI monolith + Celery workers + Redis queue.

Executor Constraints (Target):
- Memory: 256MB
- CPU: 0.5 core cap
- Timeout: 5s (quiz), 15s (lab step)
- File write limit: < 5MB

---
## 11. Analytics & KPIs
Primary KPIs:
- TTFP (time to first pass) < 15 min (median)
- Interest selection completion (first session) ≥ 75%
- Roadmap acceptance ≥ 80%
- Project unlock conversion ≥ 40%
- Project completion ≥ 25%
- Portfolio export ≥ 15%
- Median grader latency < 6s

Secondary:
- XP distribution shape
- Submission pass ratio (30–50% first-attempt sweet spot)
- Abandonment step heatmap

---
## 12. Release Plan (8 Weeks)
| Week | Focus |
|------|-------|
| 1 | Scope lock, schema finalization, seed first module, quiz draft |
| 2 | Quiz UI + roadmap engine + events ingestion |
| 3 | Executor prototype + submission API + 2 problems |
| 4 | Project Lab skeleton + artifact strategy |
| 5 | Lab completion + remaining problems + gamification + portfolio draft |
| 6 | Security hardening + resource limits + automated tests |
| 7 | UX polish + analytics SQL views + performance tuning |
| 8 | E2E test runs + bug fixing + demo script + documentation |

Post-MVP Q1 2026: Duels, adaptive difficulty, multi-lab expansion, AI tutor.

---
## 13. Dependencies & Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Grader latency too high | Poor UX | Pre-warm containers, cache deps |
| Code execution escape | Security breach | Harden seccomp, audit patterns |
| Content production lag | Incomplete loop | Parallelize content & infra early |
| Roadmap feels generic | Low differentiation | Add rationale copy + dynamic reasons |
| Poor topic taxonomy | Weak personalization | Iteratively refine based on selection analytics |
| Portfolio feels superficial | Low share value | Include metrics & code excerpt |
| Scope creep | Slippage | Enforce change control gate |
| PDF rendering inconsistencies | Broken deliverable | Provide raw Markdown fallback |

---
## 14. Open Questions
- Localization needs? (Defer)
- AI hints in MVP? (Likely Phase 2)
- Portfolio hosting vs download only?
- Submission stdout storage cap? (Proposed 10KB)
- Plagiarism detection necessary now? (Phase 2)

---
## 15. Assumptions
- Desktop-first usage (>80%).
- Python only sufficient for MVP value.
- Single-region deployment acceptable.
- Users accept deterministic roadmap transparency over “AI magic” initially.

---
## 16. Success Criteria (MVP Definition of Done)
- New user completes: signup → interest selection → roadmap → first pass → project unlock → completes ≥2 project steps → exports portfolio within 5 guided sessions.
- 70%+ test cohort affirms “I always knew what to do next.”
- Stable demo reproducible 5 consecutive times.

---
## 17. Glossary
| Term | Definition |
|------|------------|
| Roadmap | Ordered recommended modules & rationale |
| Module | Group of conceptually related lessons |
| Lesson | Atomic unit (read/quiz/code/lab trigger) |
| Problem | Auto-graded coding task |
| Lab | Multi-step guided project experience |
| Artifact | Saved output, metrics, or snapshot from a project step |
| TTFP | Time from account creation to first passing submission |
| XP | Experience points earned for progression |

---
## 18. Appendices
### A. Sample XP Table (Draft)
- Lesson complete: +50 XP
- First code submission: +10 XP
- First pass: +100 XP
- Project step complete: +150 XP
- Portfolio export: +200 XP

### B. Roadmap Scoring Heuristic (Initial)
```
score = topic_match*w1 + difficulty_alignment*w2 + prerequisite_clearance*w3 - redundancy_penalty
```

### C. Future Enhancements (Teasers)
- Adaptive Model: Track concept mastery & adjust ordering.
- Social Learning: Peer review & challenge mode.
- AI Tutoring: Inline hint generation for failed submissions.

---
**End of Document**
