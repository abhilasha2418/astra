# Astra Reunite — Console & Role-Surface UI Design

Date: 2026-06-27
Project: Astra Spatial Intelligence Platform
Event: Claude Impact Lab, Mumbai 2026 — Missing Persons at Simhastha Kumbh Mela 2027
Scope: UI design + MVP feature scope for the Astra Reunite web application
Source spec: [`2026-06-27-astra-reunite-system-design.md`](2026-06-27-astra-reunite-system-design.md)

## 1. Goal

Build a single responsive **web** application that lets responders find missing people faster by shrinking *where to look* and connecting found people to family using spatial and relationship context. The app is a role-switched shell over one shared, deterministic, client-side engine.

No native phone build in this MVP — the Volunteer surface is a narrow-width web layout we can port later.

## 2. Design Principles

- **Deterministic and offline-first.** All search, matching, prediction, and extraction run client-side with no dependency on a remote AI service. Seeded local data; `localStorage` event queue; offline toggle.
- **Field-ready UX.** Large tap targets, high contrast, minimal typing, dropdowns/chips/icons, multilingual labels on critical actions. No technical jargon in citizen- or volunteer-facing text.
- **Every recommendation says why.** Reason text on predictions, matches, and tasks.
- **Progressive intake.** Create the case first (Stage 1), enrich later (Stages 2–4).
- **Privacy by trust.** Volunteers never see full family contact; visibility scales with trust level.
- **One shared engine.** Surfaces are views; the registry, search, prediction, match, and signal-fusion logic is built once.

## 3. Visual Language

Reuse the existing **Spatial Intelligence Platform** dark command-center design system (`src/styles.css` tokens): dark slate background, blue/cyan accents, status colors (green/yellow/orange/red), `--radius: 14px`, Aptos/system font, mono for data. Vanilla ES modules, no framework. The Reunite app is a new page/route in the same repo sharing these tokens.

The Volunteer surface uses the same tokens but a single-column, large-control, narrow (max ~480px) layout.

## 4. Architecture

```text
index: role switcher (shell)
  ├─ Reporter surface
  ├─ Volunteer surface (narrow layout, trust-gated)
  └─ Police / Command surface
        └─ all surfaces open Shared Deep-Views (Case Detail, Found-Person, Separation Incident, Item, Camera)

shared engine (vanilla JS modules, in-memory + localStorage):
  registry/graph · semantic search · spatial cells + grid + search-compression
  · relationship match · signal fusion + clusters · verification state machine
  · NLP extraction · event log · offline queue
```

### Module/unit boundaries

| Unit | Responsibility | Depends on |
|------|----------------|-----------|
| `data/seed` | Seeded cells, nodes, edges, cases, signals, scenarios (derived from `data/*.csv`) | — |
| `engine/registry` | Entities, duplicate + reciprocal detection, event log | seed |
| `engine/semantic` | Query parse + ranked search with reasons | registry |
| `engine/spatial` | Cells, grid overlay, reachability, grid/attractor/exit scoring, containment | seed |
| `engine/predict` | Search-compression: combines spatial + persona + behavior + intent | spatial, registry |
| `engine/match` | Relationship-aware scoring (two ranked lists) | registry, spatial |
| `engine/signals` | Signal fusion, trust weights, clusters, negative signals | registry, spatial |
| `engine/verify` | Confidence score + state machine | registry |
| `engine/nlp` | `extractFields(rawText)` deterministic extractor (LLM seam) | — |
| `engine/store` | `localStorage` append-only queue + `pendingSync` | — |
| `ui/*` | One module per surface and deep-view, render-only | engine/* |

## 5. Screen Inventory & Per-Screen MVP Features

Legend: **must** · *nice* · `stub`

### Shell

**Landing / Role switcher** — *must*
- Three entries: Reporter · Volunteer (with trust selector) · Police
- Demo-scenario loader (seeded Scenarios 1–7)
- Offline toggle + "pending sync" indicator · reset/reseed · scenario clock

**Global semantic search** (header, primarily Police) — *must*
- NL query input → parsed-query preview chips ("red shirt", "since 2 PM", "Ramkund")
- Ranked results across reports / sightings / found-persons / items / incidents / known-contacts
- Reason badges ("same color", "same cell", "within 20 min", "mentions son Ramesh")
- One-click: open case · link as evidence · create report from query

**Metrics dashboard** — *nice*
- Counters: open / verified / active / located / reunited + average containment %

### Reporter surface (family / public / staff)

**Missing-Person Report (staged form)** — *must*
- Stage 1 critical fields → "Create case" in under 30s
- Progressive enrichment: Stage 2 narrowing · Stage 3 connection · Stage 4 safety (collapsible)
- Big targets, dropdowns/chips/icons, minimal typing; multilingual labels on critical fields
- Language capture (person + reporter) · raw-notes field · photo-ref chip · optional tag ID
- Reporting-location kept distinct from last-seen-location
- Submit → provisional/verified by confidence → shows assigned cell

**NLP Intake Agent** — *must*
- Free-text/paste input → deterministic extraction → fields with confidence + highlighted source phrase
- Missing-critical-field detection → targeted follow-up questions (gaps only)
- Pre-filled report review → creates provisional case · records raw transcript + extracted fields (`ReportIntakeSession`) · runs duplicate/reciprocal check
- Deterministic extractor by default; `extractFields()` is the seam for a future LLM call

**Submit / provisional confirmation** — *must*
- Case ID · assigned cell · verification status · estimated reachable area · next steps

### Volunteer surface (narrow web layout, trust-gated)

**Volunteer home** — *must*
- Trust badge: `unverified → registered → trained → marshal`
- Big buttons: report missing / found / sighting / lost-item / found-item · tag-scan `stub`
- Current location auto-attached (mock node)

**Quick edge report** — *must*
- Minimal fields per type + raw note + photo-ref → runs semantic + spatial + relationship match on submit

**Public-safe result card** — *must*
- Possible match (masked by trust) · nearby active search · nearest help-desk/medical/police/rendezvous
- Action buttons: Keep here · Guide to help desk · Mark with me · Request staff confirmation · Link as sighting
- No full family contact, ever

**Trust level model**
- Higher trust raises `sourceTrustWeight` in signal fusion, reveals more on the result card (masked name → safe description → nearest official point), and unlocks match confirmation (marshal).
- Police can elevate a volunteer's trust in-session.

### Police / Command surface (control room)

**Intake queue + verify** — *must*
- List: new reports · agent drafts · edge sightings · tag scans · unverified
- Confidence score + evidence panel (reporter role, contact, tag, duplicates, camera confirm, plausible location/time)
- Duplicate / reciprocal / merge recommendations
- Actions: verify · reject · merge · split · escalate · create case
- Confidence-driven default: low store · medium review · high activate · critical activate + perimeter

**Command console (grid map)** — *must*
- Active cell overlaid with **alphanumeric grid** (6×6 → A1…F6); each square scored + shaded; cleared squares marked
- Map layers (toggle): last-known node · exits · attractors · help desks · volunteer locations · camera nodes · clusters
- Search-prediction panel: elapsed time · **containment confidence** · ranked AOI grid squares · ranked attractors · ranked exit risks · "why" text (behavior profile + destination intent)
- Cluster-of-Attention panel: grouped signals · confidence · recommended action

**Tasking board** — *must*
- Engine-generated cards: volunteer sweep **by grid ref** · camera check · exit watch · rendezvous
- Assign · dispatch `stub` (console-log) · mark complete (cleared squares feed containment)

### Shared deep-views (opened from any surface)

**Case Detail (hub)** — *must*
- Persona panel (identity / language / mobility / health / resources / behavior / origin / possessions), staged & enrichable
- Stage 1–4 completion indicator
- Verification controls + state machine: `draft → provisional → verified → active_search → located → reunited`
- Timeline / audit: append-only events, actor + role, reason text
- Signals list + add observation
- Search-prediction summary (open in console)
- Relationship-match panel (ranked candidates + plain-language reasons)
- Actions: enrich · verify · escalate · locate · reunite

**Found-Person Case** — *must*
- Log unidentified person: current location, approx description, communication status, mentions (village/camp/language/relative), optional tag/item/photo
- Relationship match runs → two ranked lists (person-match candidates + known-contact candidates) with reasons
- Recommended action (keep here, notify ranked help desk/contact)
- Merge into incident on match

**Separation Incident** — *must*
- Detect reciprocal reports (A reports B, B reports A) → merge into `SeparationIncident`
- Assign safe rendezvous point (help desk) · guide both sides · close as reunited without two searches

**Lost/Found Item** — *nice*
- Category / location / description + link to person/case as clue → updates exit-breach risk + notifies medical/help desk

**Camera review** — `stub`
- Mock camera list per node/exit · add camera note (real event) · confirm/reject sighting cluster

## 6. Grid Search Model

The active `SearchCell` is divided into an alphanumeric grid (default 6×6, `A1…F6`). For each square the engine computes:

```text
squareScore =
  reachabilityScore        // walkable distance from last-seen node within elapsed time
  + destinationIntentScore // food/snan/toilet/medical/transport/meeting_point bias
  + behaviorProfileScore   // waits_where_lost / follows_crowd / returns_to_bus / ...
  + attractorScore         // help desks, water, shade, medical, ghats, police
  + flowAlignmentScore     // crowd-flow direction (seeded)
  + signalSupportScore     // sightings/camera notes inside the square
  - safetyRiskPenalty      // exit-breach proximity
```

Squares shade by score (hot → cold). Tasking assigns volunteers to specific squares ("sweep C3"). Marking a square **cleared** is a negative signal that raises containment confidence and removes it from the hot set. This replaces a vague "areas of interest" list with concrete, assignable, trackable units.

## 7. Relationship Match Scoring

Per source spec, two ranked lists ("who is this person?" and "who nearby knows them?"):

```text
finalScore =
    identityScore     * 0.35   // tag, name similarity, phone/contact, age/gender/language
  + relationshipScore * 0.25   // companion names, reciprocal report, same group/camp/village/language
  + spatialScore      * 0.25   // same/adjacent cell, same route, co-located in time window, shared cluster
  + evidenceScore     * 0.15   // official report, camera, tag scan, item clue, multiple signals
```

Every candidate shows plain-language reasons ("same Maithili language", "same Ramkund cell", "reporter Ramesh mentioned").

## 8. Real vs Stub

**Real (deterministic, client-side):** all four surfaces · NLP extraction · grid search engine · semantic search · registry + duplicate/reciprocal detection · verification state machine + confidence · relationship match · cluster of attention · trust-weighted signal fusion · timeline · offline `localStorage` queue.

**Stub (clean seam to swap later):**

| Stub | Seam |
|------|------|
| Map render (schematic grid, not geo tiles) | `renderGrid()` → real-map spec |
| Notify / tasking delivery (console log) | `dispatch(task)` → SMS/push |
| Camera review (mock list) | `getCameras(nodeId)` → feeds |
| Auth / role / trust (dropdowns) | `currentRole` / `currentTrust` → identity provider |
| Photo / voice (placeholder refs) | refs → upload / STT |
| NLP extraction (deterministic) | `extractFields(rawText)` → LLM call |
| Persistence (localStorage queue) | queue → backend sync |

## 9. Seed Data

Derive from existing `data/*.csv` (`Synthetic_Missing_Persons_2500.csv`, `CCTV_Locations.csv`, `Police_Stations.csv`, `Zone_Boundaries.csv`, `Chokepoints_Parking.csv`). Seed includes: Nashik cells (Ramkund/Panchavati, Trimbakeshwar, Sadhugram, Nashik Road, CBS, outbound corridors), nodes/edges/attractors/exits, a slice of cases/found-persons/sightings/items/known-contacts, and the 7 demo-scenario starting states.

## 10. Demo Scenarios (must run end-to-end)

1. Missing elderly person → search compression on grid → cluster → reunited.
2. Found person → relationship-aware match → family confirm.
3. Reciprocal separation → merged incident → rendezvous.
4. Lost item as clue → exit-risk update → notify.
5. Semantic search → rank across records → link sighting.
6. Volunteer edge report → public-safe result card → staff confirm.
7. Agent-assisted intake → extracted fields + gap questions → provisional case.

## 11. Out of Scope (this MVP)

Native phone build · real auth/OTP · real file/photo upload · real speech intake · live camera feeds · face recognition · real notifications/SMS/push · backend persistence/sync · real geo map tiles · full multilingual NLP · vector/embedding search.

## 12. Testing

- Unit: NLP extraction, missing-field detection, follow-up selection, verification transitions, duplicate + reciprocal detection, semantic parse + ranking, grid square scoring, reachability, attractor/exit ranking, containment, relationship-match scoring, cluster creation, trust-gated result-card visibility, reporting-vs-last-seen handling, offline queue.
- Browser smoke: create + verify report; agent-assisted intake; intake queue verification; volunteer edge sighting → safe card; generate grid prediction; add sighting + camera note → cluster; resolve as reunited; reciprocal separation; found-person match.

## 13. MVP Definition (done when a judge can see)

1. A verified report becomes a bounded Nashik search cell with a scored search grid.
2. The system shows which grid squares and exits to search, and **why**.
3. Crowd/camera/tag/item signals update the search and containment.
4. A found person is connected to family/known people without face recognition.
5. Duplicate and reciprocal reports are handled cleanly.
6. Every action is visible in an operational timeline.
