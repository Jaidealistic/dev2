# Software Testing Strategy for LexFix

**Project:** LexFix (Accessible Language Learning Platform)

---

## 1. Executive Summary

This document defines the quality assurance strategy for **LexFix**, a neuro-inclusive language learning platform. given the diverse user base (learners with Dyslexia, ADHD, Autism, APD), **Accessibility Testing** and **User Experience Verification** are as critical as functional correctness.

This strategy covers:

1.  **Scope & Levels:** Unit, Integration, System, and User Acceptance Testing (UAT).
2.  **Critical Paths:** High-risk areas requiring immediate and robust coverage.
3.  **Traceability:** Mapping key roadmap features to test scenarios.
4.  **Tools & Environment:** The selected technology stack for QA.

---

## 2. Testing Scope & Levels

| Level                     | Scope                                                                                 | Responsibility         | Tools                                   | Definition of Done                                               |
| :------------------------ | :------------------------------------------------------------------------------------ | :--------------------- | :-------------------------------------- | :--------------------------------------------------------------- |
| **Unit Testing**          | Individual functions, hooks, utilities, and isolated UI components.                   | Developers             | **Vitest**, React Testing Library       | 100% success, >80% coverage on utils.                            |
| **Integration Testing**   | API routes, Database interactions (Prisma), Service communication (App ↔ ML Service). | Developers / QA        | **Vitest**, Supertest, Docker (Test DB) | All API endpoints return correct status codes & data structures. |
| **System/E2E Testing**    | Complete user flows (Sign up → Lesson → Progress) across the full stack.              | QA Automation          | **Playwright**                          | Critical paths pass in a staging environment.                    |
| **Accessibility Testing** | WCAG 2.1 AAA compliance, screen reader compatibility, keyboard navigation.            | Developers / Designers | **axe-core**, **Pa11y**, Manual Audit   | Zero "Critical" or "Serious" accessibility violations.           |
| **UAT**                   | Validation of business requirements by stakeholders and beta testers.                 | Product Owner / Users  | Manual / Beta Platform                  | Sign-off on roadmap requirements.                                |

---

## 3. Critical Paths (Immediate Focus)

Based on the roadmap, the following areas are **Critical** and represent the highest risk to user value.

### 3.1 Core Platform (Priority 1)

- **Onboarding & Profiling:** Verifying that disability-specific preferences (font, contrast, animations) are carefully saved and **immediately applied** to the UI.
- **Lesson Delivery Engine:** ensuring the "Multi-modal" promise works—text, audio, and visuals must sync perfectly.
- **Authentication:** Secure handling of User Roles (`LEARNER`, `PARENT`, `EDUCATOR`, `PARENT_EDUCATOR`).

### 3.2 Homeschooling Support (Priority 1)

- **Parent-Educator Switch:** testing the ability to toggle between "Parent View" (Dashboard) and "Teaching Mode" (Scripted Lesson).
- **Multi-ChildScheduling:** Verifying that updates to the `WeeklySchedule` correctly reflect for multiple `LearnerProfile`s under the same `HomeschoolFamily`.

### 3.3 Infrastructure Integrations (Priority 2)

- **ML Service Bridge:** ensuring the Next.js backend correctly communicates with the Python FastAPI service for speech analysis and receives a timely response.

---

## 4. Traceability Matrix

Mapping Roadmap Requirements to Test Scenarios.

### Roadmap 1: Accessible Language Platform

| ID          | Feature                  | Test Scenario                                                                                     | Test Level             | Priority |
| :---------- | :----------------------- | :------------------------------------------------------------------------------------------------ | :--------------------- | :------- |
| **REQ-1.1** | **Dyslexia Mode**        | Verify toggling 'OpenDyslexic' updates CSS variable / font-family globally.                       | Unit (Component) + E2E | High     |
| **REQ-1.2** | **ADHD Mode**            | Verify 'Focus Mode' hides sidebar and secondary navigation elements.                              | Unit (Visual)          | Medium   |
| **REQ-2.1** | **Speech Analysis**      | Send sample audio file to `/analyze` endpoint; verify JSON response contains pronunciation score. | Integration            | High     |
| **REQ-3.1** | **Dynamic Localization** | Verify UI text changes based on `Language` preference (English/Tamil).                            | System                 | Medium   |

### Roadmap 2: Homeschooling Support

| ID           | Feature           | Test Scenario                                                                       | Test Level  | Priority |
| :----------- | :---------------- | :---------------------------------------------------------------------------------- | :---------- | :------- |
| **REQ-HS-1** | **Dual Role**     | Login as `PARENT_EDUCATOR`; verify distinct access to `teaching-guide` logic.       | E2E         | High     |
| **REQ-HS-2** | **Co-op Mgmt**    | Create a `CoOp` group; Invite a `HomeschoolFamily`; Verify membership status in DB. | Integration | Medium   |
| **REQ-HS-3** | **NIOS Tracking** | Complete a `Lesson`; verify `NIOSCompetency` record is updated for the student.     | Integration | High     |

---

## 5. Recommended Testing Stack

The existing codebase uses Next.js (React) and TypeScript. The testing stack explicitly matches this environment.

### 5.1 Automation Stack

- **Runner & Unit:** **Vitest**
  - _Why:_ Native Vite support, faster than Jest, compatible with existing `vite.config.ts`.
- **Component Testing:** **React Testing Library**
  - _Why:_ Tests behavior/interaction rather than implementation details.
- **End-to-End (E2E):** **Playwright**
  - _Why:_ superior handling of modern web features (hydration), multi-tab support (needed for _Collaboration_ features), and built-in Accessibility checks.
- **Accessibility:** **jest-axe** (Unit) + **Playwright Axe** (E2E).

### 5.2 Manual / Exploratory Tools

- **Screen Readers:** NVDA (Windows), VoiceOver (Mac) for manual verification.
- **Network Throttling:** Chrome DevTools (Simulate low-bandwidth for rural India use cases).

---

## 6. Implementation Plan

### Phase 1: Configuration Fixes

1.  **Correct `vitest.config.ts`:** Update `resolve.alias` to point to `@/` -> `./app` or suitable root. Ensure it scans `app/**/*.test.ts` or `src/**/*.test.ts` correctly.
2.  **Initialize Playwright:** Run `npm init playwright@latest` to create the `e2e` directory and config.

### Phase 2: Core Coverage

1.  **Unit:** Write tests for `lib/utils.ts` and `hooks/use-speech.ts` (mocking the actual browser API).
2.  **Integration:** Create a `tests/integration/auth.test.ts` using a Dockerized Postgres instance to verify signup flow and profile creation.

### Phase 3: Pipeline Integration

1.  Add `test:ci` script to `package.json` that runs linting, typechecking, and unit tests.
2.  Configure GitHub Actions (see DevOps Document).

---

## 7. Definition of Done (DoD) for Testing

A feature is only "Test Complete" when:

- [ ] Unit tests cover >80% of business logic.
- [ ] All Happy Paths verified via Integration/E2E tests.
- [ ] Accessibility Audit passed (No Critical/Serious issues).
- [ ] Verified on Mobile Viewport (Responsive check).
