# Spatial Intelligence Platform Design

Date: 2026-06-27

## Status

Approved for documentation foundation. Implementation planning should begin only after this spec is reviewed.

## Context

This repository starts as an empty project. The product idea comes from a Kumbh Mela civic hackathon concept: use static or live visual observations, mapped pathways, and distance/capacity data to understand crowd movement and predict congestion.

The refined direction is not a crowd-counting tool. It is a Spatial Intelligence Platform centered on a Spatial Knowledge Graph.

## Problem

Large public gatherings rely on disconnected feeds:

- CCTV cameras
- Drones
- Maps
- Weather feeds
- River sensors
- Operator reports
- Manual field updates

These feeds usually show what is currently happening. Operators need to know what is likely to happen next and which intervention will reduce risk.

## Product Thesis

Astra should convert observations into a continuously updated Spatial Knowledge Graph. The graph should support prediction and recommendation workflows across crowd movement, infrastructure load, risk, emergency access, and civic operations.

## Recommended Approach

Use a docs-first foundation with two connected layers:

- Long-term product architecture: Spatial Intelligence Platform and Spatial Knowledge Graph.
- Near-term validation: 8-12 hour hackathon MVP for Kumbh Mela crowd flow intelligence.

This avoids prematurely building a large app before the domain model and MVP boundaries are clear.

## Alternatives Considered

### Pitch-only package

Pros:

- Fast to create.
- Useful for presentation.

Cons:

- Does not define enough technical structure for implementation.
- Risks becoming vague product language without buildable scope.

### Full application scaffold immediately

Pros:

- Creates visible progress quickly.
- Could become a demo faster if scope is already known.

Cons:

- Premature without a graph model.
- Likely to produce a generic dashboard rather than a defensible platform concept.

### Spatial Knowledge Graph plus MVP docs

Pros:

- Defines the core intellectual property.
- Keeps the hackathon build realistic.
- Creates a reusable architecture for future implementation.

Cons:

- Requires a short documentation phase before code.

Decision: Use the Spatial Knowledge Graph plus MVP docs approach.

## Scope

In scope:

- Product vision.
- Spatial Knowledge Graph model.
- Hackathon MVP boundaries.
- Technical architecture for a deterministic proof of concept.
- Implementation-ready documentation structure.

Out of scope for this spec:

- Production video ingestion.
- Person re-identification.
- Real-time camera streaming.
- User authentication.
- Government workflow approvals.
- Production deployment.
- Full GIS ingestion.

## Architecture

The long-term architecture follows this flow:

```text
Inputs -> Ingestion -> Spatial Knowledge Graph -> Prediction -> Recommendation -> Dashboard -> Action
```

Inputs include CCTV images, drone imagery, GIS data, weather, river sensors, IoT sensors, and operator reports.

The Spatial Knowledge Graph stores entities, relationships, observations, state, events, predictions, and recommendations.

Prediction and recommendation modules must remain deterministic and explainable for the MVP.

## Core Concepts

The graph model has seven fundamentals:

- Entity
- Relationship
- Observation
- State
- Event
- Prediction
- Action

MVP entity types:

- Node
- FlowEdge
- Sensor

MVP operational objects:

- Observation
- State
- Prediction
- Recommendation
- Event

## MVP Demo

The MVP should model a small Kumbh-style route network:

```text
Parking -> Gate A -> Bridge -> Sangam Ghat
                 \-> Route B -> Sangam Ghat
```

The demo should show:

- Current estimated crowd at each node.
- Predicted crowd at each node over 10-15 minutes.
- Congestion score on nodes and edges.
- Heatmap status.
- Alert card for the riskiest predicted bottleneck.
- Recommendation with expected impact.

## Data Strategy

Use deterministic synthetic data first. This keeps the demo repeatable and avoids dependence on fragile external datasets.

Required demo files:

- `nodes.json`
- `edges.json`
- `sensors.json`
- `scenario-events.json`

Static crowd images may be added later, but image processing should not block the first demo.

## Algorithm Strategy

Use explainable heuristics:

```text
future_population = current_population + expected_inflow - expected_outflow
congestion_score = future_population / safe_capacity
```

Flow estimation should use:

- Source population
- Edge distance
- Walking time
- Safe flow capacity
- Route split percentages
- Delayed arrivals

Recommendation rules should be transparent:

```text
IF bridge predicted congestion > 0.90
AND alternate route congestion < 0.70
THEN recommend redirecting part of the crowd to the alternate route
```

## User Experience

The MVP dashboard should communicate the idea within 30 seconds.

Required views:

- Schematic route map.
- Node population cards.
- Edge congestion indicators.
- Predicted risk heatmap.
- Alert and recommendation panel.
- Timeline or scenario playback control.

The visual language should feel like an operations command center, not a generic analytics dashboard.

## Reliability and Safety

The product must label estimates clearly.

Use:

- Estimated population
- Predicted congestion
- Confidence
- Recommended action
- Expected impact

Avoid claims of perfect accuracy or guaranteed safety.

## Error Handling

MVP error handling:

- Missing node or edge definitions should fail with clear validation errors.
- Observations for unknown nodes should be rejected and logged.
- Predictions should not run if required capacity values are missing.
- Recommendations should include "insufficient confidence" when supporting data is weak.

## Testing Strategy

Initial implementation should include:

- Unit tests for graph loading.
- Unit tests for observation validation.
- Unit tests for flow propagation.
- Unit tests for congestion scoring.
- Unit tests for recommendation rules.
- Scenario test proving the bridge becomes risky and Route B diversion reduces risk.

## Documentation Produced

This spec is accompanied by:

- `README.md`
- `docs/01-product-vision.md`
- `docs/02-spatial-knowledge-graph.md`
- `docs/03-hackathon-mvp.md`
- `docs/04-technical-architecture.md`

## Implementation Readiness

The next step is to review this spec. If approved, create an implementation plan that starts with the MVP data model and deterministic simulation engine before frontend polish.

