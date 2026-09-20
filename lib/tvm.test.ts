/**
 * Differential tests: lib/tvm.ts vs the original math, run side by side.
 *
 * __fixtures__/cal_utils.legacy.js is the original with the Velo plumbing
 * stripped; that strip was verified lossless across 35,000 comparisons.
 * buildAmortizationSchedule cannot be compared this way -- the original
 * printed it into a Velo text element -- so its output was captured first,
 * into __fixtures__/amortization.golden.ts.
 *
 * node:test plus native TS type stripping: no test dependency. `npm test`.
 */
import test from "node:test";
import assert from "node:assert/strict";

import * as legacy from "./__fixtures__/cal_utils.legacy.js";


import {
  trim,
  calcTerm,
  calcPayment,
  calcPresentValue,
  calcIntRate,
  calcFutureValue,
  calcTtlPayments,
  buildAmortizationSchedule,
  MAX_MONTHS,
  MAX_VALUE,
  MIN_VALUE,
} from "./tvm.ts";
import golden from "./__fixtures__/amortization.golden.ts";

/**
 * Shape for the untyped legacy module. TS infers `number | undefined` for
 * calc_payment and calc_int_rate because the original declares them without
 * an initializer; both are provably assigned by a loop that always runs once.
 */
interface LegacyCalcUtils {
  MAX_MONTHS: number;
  MAX_VALUE: number;
  MIN_VALUE: number;
  trim(x: number): number;
  calc_term(rate: number, init: number, pmt: number, end: number, inf: number): number;
  calc_payment(term: number, rate: number, pv: number, fv: number, inf: number): number;
  calc_present_value(term: number, rate: number, pmt: number, fv: number, inf: number): number;
  calc_int_rate(term: number, pv: number, pmt: number, fv: number, inf: number): number;
  calc_ttl_payments(pmt: number, term: number, inf: number): number;
  calc_future_value(
    term: number, rate: number, pv: number, pmt: number, inf: number,
  ): number;
}

const orig = legacy as unknown as LegacyCalcUtils;

/** Deterministic, so a failure is reproducible. */
function prng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
}

function cases(seed: number, count: number) {
  const rnd = prng(seed);
  const pick = (lo: number, hi: number) => lo + rnd() * (hi - lo);
  return Array.from({ length: count }, () => ({
    term: Math.max(1, Math.floor(pick(1, 480))),
    rate: pick(0, 25),
    pv: pick(-500_000, 500_000),
    fv: pick(-500_000, 500_000),
    pmt: pick(-8_000, 8_000),
    inf: pick(0, 8),
  }));
}

/** Object.is: NaN equals NaN, -0 does not equal 0. */
function identical(actual: number, expected: number, msg: string) {
  assert.ok(
    Object.is(actual, expected),
    `${msg}\n  original = ${expected}\n  port     = ${actual}`,
  );
}

test("constants match the original", () => {
  assert.equal(MAX_MONTHS, orig.MAX_MONTHS);
  assert.equal(MAX_VALUE, orig.MAX_VALUE);
  assert.equal(MIN_VALUE, orig.MIN_VALUE);
});

test("calcTerm matches the original", () => {
  for (const { rate, pv, pmt, fv, inf } of cases(1337, 1500)) {
    identical(
      calcTerm(rate, pv, pmt, fv, inf),
      orig.calc_term(rate, pv, pmt, fv, inf),
      `calcTerm(${rate}, ${pv}, ${pmt}, ${fv}, ${inf})`,
    );
  }
});

test("calcPayment matches the original", () => {
  for (const { term, rate, pv, fv, inf } of cases(2024, 1500)) {
    identical(
      calcPayment(term, rate, pv, fv, inf),
      orig.calc_payment(term, rate, pv, fv, inf),
      `calcPayment(${term}, ${rate}, ${pv}, ${fv}, ${inf})`,
    );
  }
});

test("calcPresentValue matches the original", () => {
  for (const { term, rate, pmt, fv, inf } of cases(77, 1500)) {
    identical(
      calcPresentValue(term, rate, pmt, fv, inf),
      orig.calc_present_value(term, rate, pmt, fv, inf),
      `calcPresentValue(${term}, ${rate}, ${pmt}, ${fv}, ${inf})`,
    );
  }
});

test("calcIntRate matches the original", () => {
  for (const { term, pv, pmt, fv, inf } of cases(4242, 1500)) {
    identical(
      calcIntRate(term, pv, pmt, fv, inf),
      orig.calc_int_rate(term, pv, pmt, fv, inf),
      `calcIntRate(${term}, ${pv}, ${pmt}, ${fv}, ${inf})`,
    );
  }
});

test("calcFutureValue matches the original", () => {
  for (const { term, rate, pv, pmt, inf } of cases(8080, 1500)) {
    identical(
      calcFutureValue(term, rate, pv, pmt, inf),
      orig.calc_future_value(term, rate, pv, pmt, inf),
      `calcFutureValue(${term}, ${rate}, ${pv}, ${pmt}, ${inf})`,
    );
  }
});

test("calcTtlPayments matches the original (pre-scaled infadj)", () => {
  for (const { term, pmt, inf } of cases(555, 1000)) {
    const scaled = inf * 0.01;
    identical(
      calcTtlPayments(pmt, term, scaled),
      orig.calc_ttl_payments(pmt, term, scaled),
      `calcTtlPayments(${pmt}, ${term}, ${scaled})`,
    );
  }
});

test("trim matches the original, including negative floor behavior", () => {
  const edges = [-1.2345, -0.0005, 1.2345, 0, -0, 1e-9, -1e-9, 123456.789456];
  for (const v of edges) {
    identical(trim(v), orig.trim(v), `trim(${v})`);
  }
  // The asymmetry deliberately preserved from the original.
  assert.equal(trim(-1.2345), -1.235);
  assert.equal(trim(1.2345), 1.234);
});

/**
 * Normalizes -0 before comparing: JSON cannot represent it, so a zero-rate
 * month's -0 interest serialized as 0. Meaningless for a displayed figure;
 * the differential tests above still use strict Object.is.
 */
function identicalDisplay(actual: number, expected: number, msg: string) {
  identical(actual + 0, expected + 0, msg);
}

/**
 * The one function restructured rather than copied: the original interleaved
 * string formatting into calc_future_value. Its output was captured before
 * the Velo code was deleted.
 */
test("buildAmortizationSchedule matches the original's captured output", () => {
  let rows = 0;

  for (const { input, rows: expectedRows, totals } of golden) {
    const actual = buildAmortizationSchedule(
      input.term,
      input.rate,
      input.pv,
      input.pmt,
      input.inf,
    );

    assert.equal(
      actual.rows.length,
      expectedRows.length,
      `row count for term ${input.term}`,
    );

    expectedRows.forEach((expected, i) => {
      const r = actual.rows[i];
      identicalDisplay(r.month, expected.month, `row ${i} month`);
      identicalDisplay(trim(r.payment), expected.payment, `row ${i} payment`);
      identicalDisplay(trim(r.monthlyInterest), expected.monthlyInterest, `row ${i} monthlyInterest`);
      identicalDisplay(trim(r.monthlyPrincipal), expected.monthlyPrincipal, `row ${i} monthlyPrincipal`);
      identicalDisplay(trim(r.totalPrincipal), expected.totalPrincipal, `row ${i} totalPrincipal`);
      rows++;
    });

    identicalDisplay(trim(actual.totalPayments), totals.totalPayments, "totalPayments");
    identicalDisplay(trim(actual.totalInterest), totals.totalInterest, "totalInterest");
    identicalDisplay(trim(actual.finalValue), totals.finalValue, "finalValue");
  }

  // Guard against the fixture being emptied and the test silently passing.
  assert.ok(rows > 100, `expected the golden fixture to cover many rows, saw ${rows}`);
});

test("schedule's final value agrees with calcFutureValue", () => {
  for (const { term: rawTerm, rate, pv, pmt, inf } of cases(31337, 200)) {
    const term = Math.max(1, rawTerm % 120);
    const schedule = buildAmortizationSchedule(term, rate, pv, pmt, inf);
    identical(
      -schedule.finalValue,
      calcFutureValue(term, rate, pv, pmt, inf),
      `schedule vs calcFutureValue(${term}, ${rate}, ${pv}, ${pmt}, ${inf})`,
    );
  }
});
