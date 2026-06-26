# Astra Command Center UI Design

Date: 2026-06-27

## Status

Approved for implementation.

## Goal

Create a single-page command-center UI that demonstrates the Kumbh MVP scenario: ritual-driven inflow converges on Main Bridge and Sangam Ghat, Astra predicts unsafe congestion, and recommends a Route B diversion plus communication action.

## Design Direction

The UI should feel like an emergency operations display for a temporary sacred city. It should not look like a generic SaaS analytics dashboard.

Visual language:

- Deep indigo command surface.
- Saffron signal accents for ritual urgency.
- Ganga blue for water/river intelligence.
- Fine map-grid and flow-line motifs.
- Sharp, instrument-like cards rather than soft marketing panels.

Typography:

- System-safe stack with strong letterspacing and compact data labels.
- Large display headline for the active operational thesis.
- Tabular numeric treatment for capacity, minutes, and confidence.

Signature element:

- A schematic Kumbh flow graph with animated pilgrim flow pulses and a red/orange risk halo around Main Bridge.

## Scope

Build:

- Static HTML/CSS/JavaScript app.
- In-browser scenario simulator.
- Tested pure simulation helpers.
- Responsive layout that works on desktop and mobile.

Do not build:

- Real backend.
- Live camera integration.
- Package-managed React/Vite setup.
- Authentication.
- Production routing or GIS ingestion.

## User Experience

The page opens directly into the dashboard.

Primary regions:

- Top command header with scenario status.
- Left visual graph of multimodal inflow and route diversion.
- Center operational metrics and pressure cards.
- Right alert and recommendation panel.
- Bottom timeline showing the Amrit Snan surge.

The core message should be visible without interaction:

```text
Main Bridge will cross safe capacity in 12 minutes. Redirect 35% flow to Route B.
```

## Data And Logic

Use local constants for nodes, edges, and scenario steps.

Pure functions:

- `calculateCongestion(population, capacity)`
- `classifyRisk(score)`
- `projectBridgeRisk(step)`
- `calculateDiversionImpact(step, diversionShare)`
- `getActiveScenarioStep(index)`

These functions will be tested with Node's built-in test runner.

## Accessibility

- Use semantic HTML landmarks.
- Ensure keyboard focus states are visible.
- Avoid color-only meaning by including labels like `critical`, `watch`, and `stable`.
- Respect reduced-motion preferences.

## Verification

- Run unit tests for simulation helpers.
- Run a syntax check for JavaScript files.
- Load the UI locally and inspect it in the browser if possible.

