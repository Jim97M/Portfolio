const test = require("node:test");
const assert = require("node:assert/strict");
const { createSlug } = require("../src/utils/slug");

test("creates a lowercase URL slug from a title", () => {
  assert.equal(createSlug("A Calmer Approach to Production Incidents"), "a-calmer-approach-to-production-incidents");
});

test("normalizes accents and trims slug length", () => {
  assert.equal(createSlug("Café déjà vu"), "cafe-deja-vu");
  assert.equal(createSlug("a".repeat(250)).length, 200);
});