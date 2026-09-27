import test from "node:test";
import assert from "node:assert/strict";

import { adjacentField } from "./field-navigation.ts";
import { CALCULATORS } from "./calculators.ts";

const FINANCIAL = CALCULATORS.financial.fields.map((f) => f.id);
const LOAN = CALCULATORS.loan.fields.map((f) => f.id);

test("moves forward and back through the declared order", () => {
  assert.equal(adjacentField(FINANCIAL, "presentValue", 1), "rate");
  assert.equal(adjacentField(FINANCIAL, "rate", 1), "years");
  assert.equal(adjacentField(FINANCIAL, "years", 1), "months");
  assert.equal(adjacentField(FINANCIAL, "months", -1), "years");
  assert.equal(adjacentField(FINANCIAL, "rate", -1), "presentValue");
});

test("clamps at both ends instead of wrapping", () => {
  assert.equal(adjacentField(FINANCIAL, FINANCIAL[0], -1), null);
  assert.equal(adjacentField(FINANCIAL, FINANCIAL[FINANCIAL.length - 1], 1), null);
  assert.equal(adjacentField(LOAN, LOAN[0], -1), null);
  assert.equal(adjacentField(LOAN, LOAN[LOAN.length - 1], 1), null);
});

test("handles no focus and unknown fields", () => {
  assert.equal(adjacentField(FINANCIAL, null, 1), null);
  assert.equal(adjacentField(LOAN, "futureValue" as never, 1), null);
});

test("every field is reachable by walking from the first", () => {
  for (const order of [FINANCIAL, LOAN]) {
    const walked = [order[0]];
    let current: string | null = order[0];
    while ((current = adjacentField(order, current as never, 1)) !== null) {
      walked.push(current as never);
    }
    assert.deepEqual(walked, [...order], "walk should visit every field once");
  }
});

test("the term pair is adjacent, so arrows step years -> months", () => {
  for (const order of [FINANCIAL, LOAN]) {
    assert.equal(adjacentField(order, "years" as never, 1), "months");
  }
});
