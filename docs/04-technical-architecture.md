# Technical Architecture

## Architecture Principle

The platform should keep calculations deterministic and explainable. AI models may produce observations or natural-language explanations, but operational state, predictions, and recommendations should be traceable to graph data and rules.

## High-Level Architecture

```text
Inputs
  CCTV images
  Simulated sensors
  GIS data
  Weather
  Operator reports

Ingestion Layer
  Normalize observations
  Validate confidence
  Append immutable events

Spatial Knowledge Graph
  Entities
  Relationships
  State
  Events

Prediction Engine
  Flow propagation
  Capacity forecasting
  Risk scoring

Recommendation Engine
  Rule evaluation
  Intervention ranking
  Expected impact calculation

Operator Dashboard
  Graph map
  Heatmap
  Alerts
  Recommendations
  Timeline
```

## MVP Architecture

For the hackathon, the system can run as a single local app.

```text
JSON demo data
   |
Scenario playback service
   |
In-memory graph engine
   |
Prediction and recommendation modules
   |
Frontend dashboard
```

## Suggested Module Boundaries

### Graph Model

Responsibilities:

- Load node, edge, sensor, and scenario definitions.
- Maintain current state.
- Expose graph queries.

Should not:

- Render UI.
- Generate recommendations.
- Mutate state without an event.

### Observation Service

Responsibilities:

- Accept sensor observations.
- Validate required fields.
- Normalize payloads.
- Create ObservationReceived events.

Should not:

- Directly overwrite graph state without emitting events.

### State Engine

Responsibilities:

- Convert observations into derived state.
- Merge multiple observations with confidence.
- Update current node and edge state.

### Flow Engine

Responsibilities:

- Estimate movement between connected nodes.
- Calculate edge flow, speed, and congestion.
- Support future replacement with more advanced algorithms.

### Prediction Engine

Responsibilities:

- Forecast population and congestion over a fixed time horizon.
- Produce prediction records with confidence and supporting evidence.

### Risk Engine

Responsibilities:

- Convert predicted population, capacity, and environmental conditions into risk scores.
- Classify risk into green, yellow, orange, and red.

### Recommendation Engine

Responsibilities:

- Generate candidate interventions.
- Rank recommendations by urgency, impact, and confidence.
- Estimate expected benefit.

### Dashboard

Responsibilities:

- Visualize current and predicted state.
- Show alerts and recommendations.
- Let judges understand the system within 30 seconds.

## Data Flow

```text
Scenario event
  -> Observation
  -> Event log
  -> State update
  -> Flow estimation
  -> Prediction
  -> Risk score
  -> Recommendation
  -> Dashboard update
```

## MVP Data Files

### nodes.json

```json
{
  "id": "bridge",
  "type": "infrastructure",
  "subtype": "bridge",
  "name": "Main Bridge",
  "capacitySafe": 1200,
  "capacityMax": 1800,
  "position": { "x": 520, "y": 240 },
  "riskTypes": ["stampede", "structural"]
}
```

### edges.json

```json
{
  "id": "gate-a-to-bridge",
  "from": "gate-a",
  "to": "bridge",
  "distanceMeters": 350,
  "widthMeters": 5,
  "safeFlowPerMinute": 240,
  "maxFlowPerMinute": 380,
  "walkingTimeSeconds": 300,
  "isEmergencyRoute": false
}
```

### scenario-events.json

```json
{
  "timestampSeconds": 300,
  "sensorId": "camera-gate-a",
  "nodeId": "gate-a",
  "estimatedPopulation": 950,
  "confidence": 0.86
}
```

## Flow Estimation Heuristic

For MVP purposes:

```text
expected_departure = source_population * route_outflow_rate
travel_delay = edge.walking_time_seconds
expected_arrival = delayed_departure_at_previous_timestep
```

Route outflow can be configured per node.

Example:

```json
{
  "nodeId": "gate-a",
  "outflowRatePerMinute": 0.08,
  "routing": [
    { "edgeId": "gate-a-to-bridge", "share": 0.75 },
    { "edgeId": "gate-a-to-route-b", "share": 0.25 }
  ]
}
```

## Congestion and Risk

Node congestion:

```text
node_congestion = predicted_population / capacity_safe
```

Edge congestion:

```text
edge_congestion = predicted_flow_per_minute / safe_flow_per_minute
```

Risk level:

```text
green  = score < 0.60
yellow = score >= 0.60 and < 0.75
orange = score >= 0.75 and < 0.90
red    = score >= 0.90
```

## Recommendation Rules

Example rules:

```text
IF bridge predicted congestion > 0.90 within 15 minutes
AND alternate route congestion < 0.70
THEN recommend redirect crowd to Route B
```

```text
IF ghat predicted population > safe capacity
THEN recommend slowing inflow at Gate A
```

```text
IF medical camp is reachable from high-risk node within 5 minutes
AND node risk is critical
THEN recommend dispatching medical team
```

## LLM Use

LLMs can help generate operator-facing summaries:

```text
Bridge congestion is expected to reach unsafe levels in 12 minutes.
Redirecting 35% of Gate A flow to Route B is expected to reduce congestion by 25%.
```

LLMs should not be responsible for:

- Capacity math
- Safety thresholds
- Route calculations
- Event history
- Source-of-truth state

## Reliability and Safety

The MVP should be honest about uncertainty.

Every observation, prediction, and recommendation should carry confidence. The dashboard should avoid presenting estimates as exact facts.

Recommended wording:

- "estimated population"
- "predicted congestion"
- "recommended action"
- "expected impact"
- "confidence"

Avoid:

- "actual count"
- "guaranteed safe"
- "confirmed route"
- "perfect prediction"

## Future Production Architecture

A production system would likely add:

- Streaming ingestion
- Durable event store
- Graph database
- Geospatial database
- Model inference service
- Role-based access
- Audit logs
- Multi-agency workflows
- Simulation environment
- Mobile operator app
- Integration with public alert systems

## Future Research

Research tracks:

- Agent-based crowd simulation
- Multi-source sensor fusion
- Reinforcement learning for resource allocation
- Federated learning across events
- Drone-assisted graph updates
- Privacy-preserving crowd intelligence
- Ontology-driven AI agents for civic operations

