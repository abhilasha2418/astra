import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateCongestion,
  calculateDiversionImpact,
  classifyRisk,
  getActiveScenarioStep,
  projectBridgeRisk,
  scenarioSteps
} from "../src/simulation.js";

test("calculateCongestion returns a rounded capacity ratio", () => {
  assert.equal(calculateCongestion(940, 1000), 0.94);
  assert.equal(calculateCongestion(333, 1000), 0.33);
});

test("calculateCongestion returns zero for invalid capacity", () => {
  assert.equal(calculateCongestion(500, 0), 0);
  assert.equal(calculateCongestion(500, -20), 0);
});

test("classifyRisk maps scores to stable, watch, strain, and critical", () => {
  assert.equal(classifyRisk(0.42), "stable");
  assert.equal(classifyRisk(0.68), "watch");
  assert.equal(classifyRisk(0.82), "strain");
  assert.equal(classifyRisk(0.94), "critical");
});

test("getActiveScenarioStep clamps indexes to the available range", () => {
  assert.equal(getActiveScenarioStep(-10), scenarioSteps[0]);
  assert.equal(getActiveScenarioStep(999), scenarioSteps[scenarioSteps.length - 1]);
});

test("projectBridgeRisk calculates time, score, and risk label for a step", () => {
  const step = getActiveScenarioStep(2);
  const projection = projectBridgeRisk(step);

  assert.equal(projection.nodeId, "main-bridge");
  assert.equal(projection.minutesToCritical, 12);
  assert.equal(projection.projectedScore, 0.94);
  assert.equal(projection.riskLabel, "critical");
});

test("calculateDiversionImpact estimates lower bridge pressure after diversion", () => {
  const step = getActiveScenarioStep(2);
  const impact = calculateDiversionImpact(step, 0.35);

  assert.equal(impact.divertedPeople, 144);
  assert.equal(impact.beforeScore, 0.94);
  assert.equal(impact.afterScore, 0.67);
  assert.equal(impact.reduction, 0.27);
});

