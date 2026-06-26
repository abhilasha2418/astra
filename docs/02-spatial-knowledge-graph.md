# Spatial Knowledge Graph

## Purpose

The Spatial Knowledge Graph, or SKG, is the core intellectual property of Astra. It is the semantic layer connecting maps, sensors, camera observations, operational resources, predictions, and recommended actions.

The SKG is not only a GIS database, graph database, or dashboard model. It is the shared operational memory of a physical environment.

## Mental Model

```text
Physical World
  People
  Infrastructure
  Environment
  Resources

Observation Layer
  CCTV
  Drone
  IoT
  GIS
  Weather
  River sensors
  Operator reports

Spatial Knowledge Graph
  Entities
  Relationships
  State
  Events
  Context

AI Reasoning
  Prediction
  Risk scoring
  Recommendation
  Simulation

Operational Action
  Reroute
  Deploy
  Restrict
  Broadcast
  Rescue
  Clean
```

## Seven Fundamental Concepts

Every object in the SKG derives from one of seven concepts:

- Entity
- Relationship
- Observation
- State
- Event
- Prediction
- Action

## Entity Model

An Entity is anything that exists or needs to be reasoned about.

Core entity categories:

- Infrastructure
- Environment
- Human
- Vehicle
- Sensor
- Organization
- Resource
- Operational construct

Example infrastructure entities:

- Gate
- Ghat
- Bridge
- Road
- Path
- Corridor
- Temple
- Toilet
- Water point
- Medical camp
- Police booth
- Parking zone
- Barricade
- Control room
- Junction
- Helipad

Example environment entities:

- River
- River segment
- Water body
- Terrain
- Flood zone
- Danger zone
- Safe zone
- Weather cell

Example operational entities:

- Crowd
- Queue
- Incident
- Volunteer team
- Cleaning team
- Emergency team
- Lost person case
- Found person case
- Traffic flow

## Base Entity Fields

Every entity should inherit these fields:

```yaml
id: string
type: string
subtype: string
name: string
description: string
status: active | inactive | degraded | closed | unknown
owner: string
source: manual | gis | sensor | imported | inferred
confidence: number
version: number
created_at: timestamp
updated_at: timestamp
```

## Spatial Fields

Every entity is spatially aware.

```yaml
geometry:
  latitude: number
  longitude: number
  elevation: number
  polygon: geojson
  centroid: geojson
  bounding_box: geojson
  orientation_degrees: number
  floor: string
  zone_id: string
  sector_id: string
```

## Semantic Fields

Semantic fields describe operational meaning.

Example:

```yaml
semantic:
  purpose: religious_bathing
  importance: high
  attracts_crowd: true
  expected_stay_minutes: 32
  peak_hours:
    - start: "04:00"
      end: "08:00"
```

This lets the reasoning layer understand that a ghat, bridge, toilet, and medical camp have different operational roles even if they are all spatial nodes.

## Operational Fields

```yaml
operations:
  capacity_safe: number
  capacity_max: number
  current_load: number
  predicted_load: number
  available_capacity: number
  queue_length: number
  average_wait_minutes: number
  average_stay_minutes: number
  service_status: open | restricted | closed | unavailable
  priority: low | medium | high | critical
```

## Risk Layer

Each entity can expose multiple risks.

Risk categories:

- Stampede
- Fire
- Flood
- Drowning
- Structural
- Medical
- Security
- Heat
- Electrical
- Smoke
- Weather

Risk model:

```yaml
risk:
  stampede:
    probability: number
    severity: low | medium | high | critical
    current_score: number
    predicted_score: number
    confidence: number
  drowning:
    probability: number
    severity: low | medium | high | critical
    current_score: number
    predicted_score: number
    confidence: number
```

## Accessibility Layer

Accessibility should be modeled by capability, not a single yes/no field.

```yaml
accessibility:
  walking:
    allowed: true
    average_speed_mps: 1.2
  wheelchair:
    allowed: true
    average_speed_mps: 0.8
  ambulance:
    allowed: false
  police_vehicle:
    allowed: true
  fire_truck:
    allowed: false
  cleaning_vehicle:
    allowed: true
  boat:
    allowed: false
  drone:
    allowed: true
```

## River Intelligence

River segments deserve first-class modeling for Kumbh Mela and similar contexts.

```yaml
river_segment:
  depth_profile_meters: number[]
  current_speed_mps: number
  flow_direction_degrees: number
  river_bed_type: sand | rock | mud | mixed | unknown
  drop_points: geojson[]
  eddy_probability: number
  whirlpool_probability: number
  slippery_probability: number
  safe_depth_meters: number
  unsafe_depth_meters: number
  boat_access: true
  rescue_access: true
```

## Relationships

Relationships give meaning to graph edges.

Core relationship types:

- CONNECTED_TO
- OBSERVED_BY
- LOCATED_IN
- DEPENDS_ON
- SUPPLIED_BY
- PROTECTED_BY
- MAINTAINED_BY
- SERVES
- NEAREST_TO
- CAN_REACH
- CAN_EVACUATE_TO
- ALTERNATE_ROUTE
- RISK_TO
- VISIBLE_FROM
- BLOCKED_BY

Relationship metadata:

```yaml
relationship:
  id: string
  type: string
  from_entity_id: string
  to_entity_id: string
  distance_meters: number
  travel_time_seconds: number
  capacity_safe: number
  capacity_max: number
  cost: number
  risk_score: number
  priority: low | medium | high | critical
  confidence: number
  status: active | blocked | restricted | unknown
```

## Flow Edge

The flow edge is the most important movement relationship.

```yaml
flow_edge:
  id: string
  from_node_id: string
  to_node_id: string
  distance_meters: number
  width_meters: number
  surface_type: paved | dirt | sand | temporary | mixed | unknown
  slope_degrees: number
  lighting: good | partial | poor | unknown
  walking_time_seconds: number
  vehicle_time_seconds: number
  current_flow_per_minute: number
  safe_flow_per_minute: number
  max_flow_per_minute: number
  predicted_flow_per_minute: number
  average_speed_mps: number
  density_people_per_square_meter: number
  congestion_score: number
  risk_score: number
  is_emergency_route: boolean
```

## Observation

Nothing updates graph state directly. Sensors and operators produce observations.

```yaml
observation:
  id: string
  sensor_id: string
  observed_entity_id: string
  type: crowd_count | queue_length | smoke | fire | water_level | temperature | manual_report
  timestamp: timestamp
  confidence: number
  payload: object
```

Examples:

- Camera estimated 1,250 people at Gate A.
- Operator reported Bridge B is partially blocked.
- River sensor reported water level rising.
- Weather feed reported reduced visibility.

## State

State is the current derived truth of an entity.

State is derived from observations, events, manual overrides, and predictions. It should not be treated as raw sensor data.

```yaml
state:
  entity_id: string
  timestamp: timestamp
  current_population: number
  predicted_population_15m: number
  queue_length: number
  service_status: string
  risk_score: number
  congestion_score: number
  confidence: number
```

## Event

Every meaningful change becomes an immutable event.

Event types:

- ObservationReceived
- StateUpdated
- PredictionUpdated
- RiskIncreased
- RecommendationCreated
- OperatorAcceptedAction
- OperatorRejectedAction
- ResourceDispatched
- IncidentCreated
- IncidentResolved
- RouteClosed
- GateOpened
- GateRestricted

```yaml
event:
  id: string
  type: string
  entity_id: string
  timestamp: timestamp
  actor: system | operator | sensor | external_api
  payload: object
  causation_id: string
  correlation_id: string
```

## Prediction

Predictions are graph objects, not temporary dashboard values.

```yaml
prediction:
  id: string
  target_entity_id: string
  type: population | congestion | risk | queue | facility_demand | route_delay
  horizon_minutes: number
  predicted_value: number
  confidence: number
  generated_by: string
  supporting_observation_ids: string[]
  created_at: timestamp
```

## Action and Recommendation

A recommendation is a proposed action with evidence.

```yaml
recommendation:
  id: string
  type: open_gate | close_route | redirect_crowd | deploy_volunteers | dispatch_ambulance | broadcast_message
  target_entity_id: string
  priority: low | medium | high | critical
  expected_benefit: string
  expected_impact_score: number
  time_to_act_minutes: number
  confidence: number
  supporting_prediction_ids: string[]
  status: proposed | accepted | rejected | completed | expired
```

## Ontology Examples

Bridge:

```text
Bridge IS_A Infrastructure
Bridge CONNECTS Place -> Place
Bridge ENABLES Movement
Bridge HAS Capacity
Bridge HAS Flow
Bridge HAS StampedeRisk
Bridge CAN_BE Observed
Bridge CAN_BE Closed
Bridge CAN_BE Blocked
Bridge CAN_BE Predicted
```

Ghat:

```text
Ghat IS_A ReligiousLocation
Ghat ENABLES Bathing
Ghat ATTRACTS Crowd
Ghat HAS RiverSegment
Ghat HAS SafeCapacity
Ghat HAS DrowningRisk
Ghat HAS BoatAccess
Ghat HAS EmergencyZone
Ghat OBSERVED_BY Camera
```

## Operational Memory

The SKG should remember the full decision loop:

```text
Observation -> Prediction -> Recommendation -> Operator action -> Outcome -> Learning
```

This makes it possible to answer:

- Which interventions reduced congestion?
- Which routes repeatedly became unsafe?
- Which facilities exceeded demand?
- Which locations had recurring incidents?
- Which recommendations operators ignored, and why?

## MVP Subset

The hackathon proof of concept should implement only this subset:

- Node
- FlowEdge
- Sensor
- Observation
- State
- Prediction
- Recommendation
- Event

The MVP should model a small Kumbh-style network:

```text
Parking -> Gate -> Bridge -> Ghat
                  -> Alternate Route -> Ghat
```

