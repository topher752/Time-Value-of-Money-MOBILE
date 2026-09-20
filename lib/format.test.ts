import test from "node:test";
import assert from "node:assert/strict";

import { formatNumber, parseNumeric } from "./format.ts";

test("formatNumber matches the mockups", () => {
  assert.equal(formatNumber(100_000), "100,000");
  assert.equal(formatNumber(131570.377), "131,570.377");
  assert.equal(formatNumber(5.5), "5.5");
  assert.equal(formatNumber(0), "0");
  assert.equal(formatNumber(-1199.101), "-1,199.101");
});

test("formatNumber drops trailing zeros and never exceeds trim()'s precision", () => {
  assert.equal(formatNumber(1200), "1,200");
  assert.equal(formatNumber(1200.5), "1,200.5");
  // trim() yields at most 3 decimals, so formatting never rounds it away.
  assert.equal(formatNumber(0.123), "0.123");
});

test("formatNumber returns empty for non-finite values", () => {
  assert.equal(formatNumber(NaN), "");
  assert.equal(formatNumber(Infinity), "");
});

test("formatted values round-trip through parseNumeric", () => {
  for (const v of [100_000, 131570.377, -1199.101, 0, 5.5, 1_000_000.25]) {
    assert.equal(parseNumeric(formatNumber(v)), v, `round-trip ${v}`);
  }
});

test("parseNumeric treats blank input as zero", () => {
  assert.equal(parseNumeric(""), 0);
  assert.equal(parseNumeric("   "), 0);
  assert.equal(parseNumeric(undefined), 0);
});

test("parseNumeric rejects partial numbers that parseFloat would accept", () => {
  // parseFloat("12abc") === 12 and parseFloat("1.2.3") === 1.2 -- both are
  // silent data corruption. Number() gives NaN, which the validators catch.
  assert.ok(Number.isNaN(parseNumeric("12abc")));
  assert.ok(Number.isNaN(parseNumeric("1.2.3")));
  assert.ok(Number.isNaN(parseNumeric("abc")));
  assert.ok(Number.isNaN(parseNumeric("-")));
});

test("parseNumeric accepts the shapes users actually type", () => {
  assert.equal(parseNumeric("1000"), 1000);
  assert.equal(parseNumeric("1,000"), 1000);
  assert.equal(parseNumeric("-500.25"), -500.25);
  assert.equal(parseNumeric(" 42 "), 42);
  assert.equal(parseNumeric("5."), 5);
  assert.equal(parseNumeric(".5"), 0.5);
});
