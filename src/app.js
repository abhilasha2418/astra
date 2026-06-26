import {
  calculateCongestion,
  calculateDiversionImpact,
  classifyRisk,
  edges,
  getActiveScenarioStep,
  getNodeCapacity,
  getNodePopulation,
  nodes,
  projectBridgeRisk,
  scenarioSteps
} from "./simulation.js";

const graphPositions = {
  "railway-station": { x: 9, y: 18 },
  "bus-stand": { x: 9, y: 42 },
  "parking-zone": { x: 9, y: 66 },
  "entry-gate": { x: 34, y: 42 },
  "main-bridge": { x: 59, y: 30 },
  "route-b": { x: 58, y: 61 },
  "sangam-ghat": { x: 83, y: 43 },
  "exit-route": { x: 89, y: 62 },
  "medical-camp": { x: 77, y: 15 },
  "river-safety-post": { x: 76, y: 73 },
  "toilet-block": { x: 43, y: 82 },
  "water-atm": { x: 28, y: 82 }
};

const visibleNodeIds = [
  "railway-station",
  "bus-stand",
  "parking-zone",
  "entry-gate",
  "main-bridge",
  "route-b",
  "sangam-ghat",
  "exit-route",
  "medical-camp",
  "river-safety-post"
];

const metricNodeIds = ["entry-gate", "main-bridge", "route-b", "sangam-ghat", "toilet-block", "water-atm"];

let activeStepIndex = 2;

function render() {
  const step = getActiveScenarioStep(activeStepIndex);
  const projection = projectBridgeRisk(step);
  const impact = calculateDiversionImpact(step, 0.35);

  renderHeader(step);
  renderThesis(step, projection);
  renderGraph(step, projection);
  renderMetrics(step);
  renderImpact(impact, projection);
  renderTimeline();
}

function renderHeader(step) {
  document.querySelector("#scenario-clock").textContent = step.time;
  document.querySelector("#scenario-label").textContent = step.label;
}

function renderThesis(step, projection) {
  document.querySelector("#bridge-thesis").textContent =
    projection.riskLabel === "critical"
      ? `Main Bridge crosses safe capacity in ${projection.minutesToCritical} minutes.`
      : `Main Bridge stabilizes with ${projection.minutesToCritical} minutes of buffer.`;

  document.querySelector("#bridge-explainer").textContent =
    `Ritual multiplier ${step.ritualMultiplier.toFixed(1)}x, projected bridge population ${projection.projectedPopulation.toLocaleString()}, confidence ${Math.round(projection.confidence * 100)}%.`;
}

function renderGraph(step, projection) {
  const routeMap = document.querySelector("#route-map");
  const lines = edges.map((edge) => renderEdge(edge, step)).join("");
  const nodeMarkup = visibleNodeIds.map((nodeId) => renderNode(nodeId, step, projection)).join("");

  routeMap.innerHTML = `
    <svg class="flow-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      ${lines}
    </svg>
    ${nodeMarkup}
    <div class="river-band" aria-hidden="true">Ganga / Yamuna confluence</div>
  `;
}

function renderEdge(edge, step) {
  const from = graphPositions[edge.from];
  const to = graphPositions[edge.to];
  const isPrimaryRisk = edge.from === "entry-gate" && edge.to === "main-bridge";
  const isDiversion = edge.to === "route-b";
  const className = [
    "flow-line",
    isPrimaryRisk ? "flow-line-hot" : "",
    isDiversion && activeStepIndex >= 2 ? "flow-line-divert" : ""
  ].filter(Boolean).join(" ");
  const width = isPrimaryRisk ? 1.5 + step.ritualMultiplier * 0.45 : 1.2;

  return `<line class="${className}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke-width="${width}" />`;
}

function renderNode(nodeId, step, projection) {
  const node = nodes.find((item) => item.id === nodeId);
  const position = graphPositions[nodeId];
  const population = getNodePopulation(step, nodeId);
  const score = nodeId === "main-bridge"
    ? projection.projectedScore
    : calculateCongestion(population, getNodeCapacity(nodeId));
  const risk = classifyRisk(score);
  const primaryLabel = nodeId === "main-bridge" ? "projected" : "current";

  return `
    <button class="map-node map-node-${risk} ${nodeId === "main-bridge" ? "map-node-focus" : ""}"
      style="--x: ${position.x}; --y: ${position.y};"
      aria-label="${node.name}: ${primaryLabel} ${Math.round(score * 100)} percent capacity, ${risk}">
      <span>${node.name}</span>
      <strong>${Math.round(score * 100)}%</strong>
    </button>
  `;
}

function renderMetrics(step) {
  const metricGrid = document.querySelector("#metric-grid");
  metricGrid.innerHTML = metricNodeIds.map((nodeId) => {
    const node = nodes.find((item) => item.id === nodeId);
    const population = getNodePopulation(step, nodeId);
    const score = calculateCongestion(population, node.capacity);
    const risk = classifyRisk(score);

    return `
      <article class="metric-card metric-${risk}">
        <p>${node.name}</p>
        <strong>${population.toLocaleString()}</strong>
        <span>${Math.round(score * 100)}% capacity / ${risk}</span>
      </article>
    `;
  }).join("");
}

function renderImpact(impact, projection) {
  document.querySelector("#impact-list").innerHTML = `
    <div>
      <dt>Risk window</dt>
      <dd>${projection.minutesToCritical} min</dd>
    </div>
    <div>
      <dt>Before action</dt>
      <dd>${Math.round(impact.beforeScore * 100)}%</dd>
    </div>
    <div>
      <dt>After action</dt>
      <dd>${Math.round(impact.afterScore * 100)}%</dd>
    </div>
    <div>
      <dt>People diverted</dt>
      <dd>${impact.divertedPeople}</dd>
    </div>
  `;
}

function renderTimeline() {
  const controls = document.querySelector("#timeline-controls");
  controls.innerHTML = scenarioSteps.map((step, index) => `
    <button class="timeline-step ${index === activeStepIndex ? "timeline-step-active" : ""}"
      type="button"
      data-step="${index}"
      aria-current="${index === activeStepIndex ? "step" : "false"}">
      <span>${step.time}</span>
      <strong>${step.label}</strong>
    </button>
  `).join("");

  controls.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeStepIndex = Number(button.dataset.step);
      render();
    });
  });
}

render();
