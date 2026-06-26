# Astra Command Center UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, interactive Astra command-center UI for the Kumbh MVP scenario.

**Architecture:** A static `index.html` shell loads focused ES modules from `src/`. Pure scenario calculations live in `src/simulation.js` and are covered by Node tests before browser UI code consumes them. UI rendering and interaction live in `src/app.js`; visual identity lives in `src/styles.css`.

**Tech Stack:** HTML, CSS, vanilla JavaScript ES modules, Node built-in test runner. No package install required.

## Global Constraints

- No network dependency for the demo UI.
- No real camera integration.
- No person re-identification.
- No backend server required.
- Keep all demo data local and deterministic.
- The UI must be responsive on desktop and mobile.
- JavaScript logic must pass tests before declaring complete.

---

### Task 1: Scenario Logic

**Files:**
- Create: `src/simulation.js`
- Create: `tests/simulation.test.js`
- Create: `package.json`

**Interfaces:**
- Produces: `calculateCongestion(population: number, capacity: number): number`
- Produces: `classifyRisk(score: number): "stable" | "watch" | "strain" | "critical"`
- Produces: `getActiveScenarioStep(index: number): ScenarioStep`
- Produces: `projectBridgeRisk(step: ScenarioStep): BridgeProjection`
- Produces: `calculateDiversionImpact(step: ScenarioStep, diversionShare: number): DiversionImpact`

- [ ] Write failing Node tests for congestion scoring, risk classification, step clamping, bridge projection, and diversion impact.
- [ ] Run `npm test` and confirm failure because `src/simulation.js` is missing.
- [ ] Implement `src/simulation.js` with deterministic scenario data and pure helper functions.
- [ ] Run `npm test` and confirm all tests pass.

### Task 2: Static App Shell And Visual System

**Files:**
- Create: `index.html`
- Create: `src/styles.css`
- Create: `src/app.js`

**Interfaces:**
- Consumes: exports from `src/simulation.js`.
- Produces: a browser-rendered command-center dashboard.

- [ ] Create semantic HTML regions for header, graph, metrics, alerts, and timeline.
- [ ] Add CSS variables for the command-center palette and responsive layout.
- [ ] Implement initial render from scenario step 0.
- [ ] Wire timeline buttons to re-render scenario state.
- [ ] Run JavaScript syntax checks.

### Task 3: Demo Polish And Verification

**Files:**
- Modify: `README.md`
- Modify: `index.html`
- Modify: `src/styles.css`
- Modify: `src/app.js`

**Interfaces:**
- Consumes: static app from Task 2.
- Produces: documented local preview instructions and final demo polish.

- [ ] Add README instructions for opening the UI.
- [ ] Verify no draft markers remain.
- [ ] Run `npm test`.
- [ ] Run JavaScript syntax checks.
- [ ] Start a local static server and inspect the UI in browser.
- [ ] Commit the completed UI.
