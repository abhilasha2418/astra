# Real-Map Crowd Flow Intelligence Design

Date: 2026-06-27
Project: Astra Spatial Intelligence Platform
Scope: One-day MVP UI upgrade for Kumbh Mela command-center demo

## Objective

Rebuild the current stylized digital-twin dashboard into a real geospatial operating view. The dashboard should show a real map, operational nodes, camera locations, movement between nodes, and red/yellow/green node status when risk changes.

The experience should communicate one clear story: command-center operators can see where people are moving, which node is becoming unsafe, which cameras observe it, and what action should be taken next.

## Recommended Approach

Use a browser map library with OpenStreetMap tiles for the central operating view. For the MVP, the node and camera coordinates will be seeded around the Prayagraj/Sangam event area and can later be replaced with real GPS or GIS data.

The UI should keep the visual strength of the original Crowd Flow Intelligence concept while improving the use case:

- Real map instead of a purely decorative map illustration.
- Privacy-safe aggregated crowd flow instead of person-level identity tracking.
- Operational nodes and cameras as first-class objects.
- Movement edges showing inflow, outflow, and diversion paths.
- Risk state visible directly on the map through node color.
- Actionable recommendations linked to the affected node.

## Layout

The dashboard will use a dense command-center layout inspired by the reference designs:

```text
+--------------------------------------------------------------------------------+
| Crowd Flow Intelligence / KPIs / Time / Scenario                               |
+----------------------+--------------------------------------+------------------+
| Operational Pipeline | Real Map: nodes, cameras, flows      | Metrics & Alerts |
| Camera Snapshots     | Selected risk node highlighted red   | Point Summary    |
+----------------------+--------------------------------------+------------------+
| Inflow / Outflow Chart                 | Timeline / AI Recommendation          |
+--------------------------------------------------------------------------------+
```

## Core UI Areas

### Header

The header should show the product identity and high-level mission KPIs:

- Total crowd estimate
- Core capacity usage
- Highest-risk node
- Active alerts
- Incidents
- Weather
- Current simulation time

### Real Map View

The central map should show OpenStreetMap tiles with operational overlays:

- Node markers for transport, entry, bridge, route, ghat, temple, medical, toilet, and exit points.
- Camera markers with camera IDs and coverage labels.
- Movement paths between nodes.
- Animated movement indicators along active paths.
- Emergency route highlighted in blue.
- Red/yellow/green marker states based on calculated risk.
- A selected node state for `Bridge-02`.

The MVP may use Leaflet from a CDN for the map library and OpenStreetMap tile URLs for the base layer. If network access is unavailable during demo, the UI should still degrade gracefully by showing a dark fallback grid/map panel with the same nodes and movement overlays.

### Nodes

Initial seeded nodes:

- Railway Station
- Parking Zone
- Entry Gate
- Bridge-02
- Route B
- Sangam Ghat
- Temple
- Medical Camp
- Toilet T2
- Exit Route

Each node should contain:

- `id`
- `name`
- `type`
- `latitude`
- `longitude`
- `capacity`
- `currentPopulation`
- `predictedPopulation`
- `riskScore`
- `riskState`: stable, watch, strain, or critical

### Cameras

Initial seeded cameras:

- `CAM-14`: Bridge east approach
- `CAM-18`: Bridge exit ramp
- `CAM-22`: Entry gate queue
- `DRONE-03`: Sangam aerial

Each camera should contain:

- `id`
- `label`
- `latitude`
- `longitude`
- `observedNodeIds`
- `count`
- `confidence`
- `status`

Camera thumbnails should remain in the left panel so the demo still communicates the original AI/crowd-detection idea.

### Movement

Movement should be represented as graph edges:

- Railway Station -> Entry Gate
- Parking Zone -> Entry Gate
- Entry Gate -> Bridge-02
- Entry Gate -> Route B
- Bridge-02 -> Sangam Ghat
- Route B -> Sangam Ghat
- Sangam Ghat -> Temple
- Sangam Ghat -> Exit Route
- Sangam Ghat -> Toilet T2
- Temple -> Medical Camp

Each edge should show:

- Direction
- Estimated flow per minute
- Distance label when available
- Risk styling when the downstream node is strained or critical
- Animated movement to show crowd direction

### Risk Behavior

Risk should be calculated from `currentPopulation / capacity` and projected crowd pressure.

Recommended states:

- Stable: below 60% capacity, green
- Watch: 60-74%, yellow-green
- Strain: 75-89%, amber
- Critical: 90% or above, red

When something goes wrong:

- The affected node turns red.
- The connected high-pressure edge becomes red or orange.
- The right panel changes to the affected node.
- The alert list explains the issue in operator language.
- The AI recommendation proposes the next operational action.

Example:

`Bridge-02 exceeded safe operating threshold. Divert 35% of Entry Gate flow to Route B for 8 minutes and keep the emergency lane open.`

## Data Strategy For MVP

The MVP should use seeded local data so it can be built and demonstrated in one day.

Data sources by maturity:

- Day-one demo: local JSON/JavaScript seed data for nodes, cameras, paths, risk, and simulated time steps.
- Real deployment: GIS survey data, CCTV/camera registry, police/administration route plans, public OpenStreetMap basemap, weather feeds, transport arrivals, and manual incident reports.
- Later AI integration: aggregated crowd counts from camera images, mobile tower density feeds where legally available, drone observations, and operator-confirmed event logs.

The MVP must not depend on live personal tracking or person re-identification.

## Interaction Model

Operators should be able to:

- Click a node on the map to inspect capacity, crowd, prediction, connected cameras, and recommendation.
- Click a camera marker to see which node it observes.
- Switch scenario time steps to watch risk evolve.
- See the affected node turn red automatically when risk crosses the threshold.
- Read the recommended action without leaving the map.

## Visual Direction

The visual language should be enterprise GIS command-center, not sci-fi:

- Dark charcoal base
- Satellite/map texture from real tiles
- Blue for emergency/access route
- Green/yellow/orange/red for operational risk
- Dense panels and data tables inspired by the original designs
- Clear typography and restrained motion
- One memorable signature: animated movement pulses traveling along real map routes

## Implementation Boundaries

In scope for this MVP:

- Add real map view with seeded node and camera coordinates.
- Add node/camera markers and movement edges.
- Add red/yellow/green risk states.
- Add selected-node inspector and alerts tied to map state.
- Preserve camera snapshot cards and operational pipeline.
- Preserve tests for risk, scenarios, and dashboard data helpers.

Out of scope for the one-day MVP:

- Real CCTV integration.
- Real computer vision inference.
- Live GIS backend.
- User authentication.
- Incident write-back workflows.
- Person-level deduplication or identity tracking.

## Testing And Verification

Minimum verification before delivery:

- Unit tests pass for risk classification, scenario clamping, KPI generation, and selected-node inspector data.
- JavaScript syntax checks pass.
- Browser smoke test confirms the dashboard loads without console errors.
- Desktop screenshot confirms real map panel, nodes, camera markers, red-risk node, and movement routes are visible.
- Mobile smoke test confirms no horizontal layout overflow.

## Success Criteria

The redesign is successful if a viewer can understand within 10 seconds:

- This is a real-map command-center product.
- The platform knows where operational nodes and cameras are located.
- Crowd movement is directional and visible.
- Bridge-02 is currently the risky node because it turns red.
- The system recommends an operational action, not just a visualization.
