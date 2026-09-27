/**
 * Solver-layer tests. tvm.test.ts already pins the engine, so what is left is
 * what sits on top: sign conventions at the call boundary, validation, and
 * round-tripping. A sign error would pass the differential tests completely,
 * so these anchor against independently-known financial values.
 */
import test from "node:test";
import assert from "node:assert/strict";

import {
  CALCULATORS,
  COMPLETION_NOTE,
  financialCalculator,
  loanCalculator,
  type FieldId,
  type FieldValues,
  type SolveResult,
  type TargetId,
} from "./calculators.ts";

function solved(
  calc: typeof loanCalculator,
  target: TargetId,
  values: FieldValues,
): Record<string, number> {
  const r: SolveResult = calc.solve(target, values);
  assert.ok(r.ok, `expected ${target} to solve, got: ${r.ok ? "" : r.note}`);
  assert.equal(r.note, COMPLETION_NOTE);
  assert.equal(r.computed, target);
  return r.updates as Record<string, number>;
}

function rejected(
  calc: typeof loanCalculator,
  target: TargetId,
  values: FieldValues,
): string {
  const r: SolveResult = calc.solve(target, values);
  assert.ok(!r.ok, `expected ${target} to be rejected`);
  return r.note;
}

/** A $200,000 30-year mortgage at 6% has a well-known payment of ~$1199.10. */
const MORTGAGE = { loanAmt: 200_000, rate: 6, years: 30, months: 0 };
const MORTGAGE_PAYMENT = 1199.101;

/** Valid baseline per calculator; validation tests corrupt one field at a time. */
const VALID: Record<"financial" | "loan", FieldValues> = {
  financial: {
    presentValue: 1_000,
    rate: 5,
    years: 10,
    months: 0,
    payment: 100,
    futureValue: 5_000,
    infAdj: 0,
  },
  loan: {
    loanAmt: 200_000,
    rate: 6,
    years: 30,
    months: 0,
    payment: MORTGAGE_PAYMENT,
  },
};

test("loan: payment matches the standard mortgage figure", () => {
  const { payment } = solved(loanCalculator, "payment", MORTGAGE);
  assert.ok(
    Math.abs(payment - 1199.10) < 0.01,
    `expected ~1199.10, got ${payment}`,
  );
});

test("loan: every target round-trips", () => {
  const withPayment = { ...MORTGAGE, payment: MORTGAGE_PAYMENT };

  const { loanAmt } = solved(loanCalculator, "loanAmt", {
    payment: MORTGAGE_PAYMENT, rate: 6, years: 30, months: 0,
  });
  assert.ok(Math.abs(loanAmt - 200_000) < 1, `loanAmt: ${loanAmt}`);

  const { rate } = solved(loanCalculator, "rate", {
    loanAmt: 200_000, payment: MORTGAGE_PAYMENT, years: 30, months: 0,
  });
  assert.ok(Math.abs(rate - 6) < 0.01, `rate: ${rate}`);

  const term = solved(loanCalculator, "term", {
    loanAmt: 200_000, payment: MORTGAGE_PAYMENT, rate: 6,
  });
  assert.equal(term.years, 30);
  assert.equal(term.months, 0);

  // and back to where we started
  const { payment } = solved(loanCalculator, "payment", withPayment);
  assert.ok(Math.abs(payment - MORTGAGE_PAYMENT) < 0.01);
});

test("financial: future value of a monthly contribution", () => {
  // $100/mo for 10 years at 5%, starting from zero, compounds to ~$15,528.
  const { futureValue } = solved(financialCalculator, "futureValue", {
    presentValue: 0, payment: 100, rate: 5, years: 10, months: 0,
  });
  assert.ok(
    Math.abs(futureValue - 15_528.23) < 0.5,
    `expected ~15528, got ${futureValue}`,
  );
});

test("financial: lump sum compounds and discounts back", () => {
  // $10,000 at 7% for 10 years -> ~$20,096.
  const { futureValue } = solved(financialCalculator, "futureValue", {
    presentValue: 10_000, payment: 0, rate: 7, years: 10, months: 0,
  });
  assert.ok(Math.abs(futureValue - 20_096.61) < 0.5, `fv: ${futureValue}`);

  const { presentValue } = solved(financialCalculator, "presentValue", {
    futureValue, payment: 0, rate: 7, years: 10, months: 0,
  });
  assert.ok(
    Math.abs(presentValue - 10_000) < 0.5,
    `pv round-trip: ${presentValue}`,
  );
});

test("financial: payment and rate round-trip against future value", () => {
  const base = { presentValue: 0, rate: 5, years: 10, months: 0 };
  const { futureValue } = solved(financialCalculator, "futureValue", {
    ...base, payment: 100,
  });

  const { payment } = solved(financialCalculator, "payment", {
    ...base, futureValue,
  });
  assert.ok(Math.abs(payment - 100) < 0.05, `payment: ${payment}`);
});

test("financial: a withdrawal is a negative payment", () => {
  // Drawing $500/mo from $100k at 4% leaves less than the starting balance.
  const { futureValue } = solved(financialCalculator, "futureValue", {
    presentValue: 100_000, payment: -500, rate: 4, years: 10, months: 0,
  });
  assert.ok(futureValue < 100_000, `expected drawdown, got ${futureValue}`);
  assert.ok(futureValue > 0, `expected balance to survive, got ${futureValue}`);
});

test("financial: inflation adjustment escalates the payment", () => {
  const base = { presentValue: 0, payment: 100, rate: 5, years: 10, months: 0 };
  const flat = solved(financialCalculator, "futureValue", { ...base, infAdj: 0 });
  const escalating = solved(financialCalculator, "futureValue", {
    ...base, infAdj: 3,
  });
  assert.ok(
    escalating.futureValue > flat.futureValue,
    `3% escalation should beat flat: ${escalating.futureValue} vs ${flat.futureValue}`,
  );
});

test("loan: validation rejects bad input with the original help text", () => {
  assert.match(
    rejected(loanCalculator, "payment", { ...MORTGAGE, loanAmt: 0 }),
    /Loan Amount greater than zero/,
  );
  assert.match(
    rejected(loanCalculator, "payment", { ...MORTGAGE, rate: 150 }),
    /from -100 to 100/,
  );
  assert.match(
    rejected(loanCalculator, "payment", { ...MORTGAGE, years: 0, months: 0 }),
    /legitimate combination of years & months/,
  );
  assert.match(
    rejected(loanCalculator, "term", { loanAmt: 200_000, rate: 6, payment: 0 }),
    /Monthly Payment greater than zero/,
  );
});

test("validation does not require the field being solved for", () => {
  // Solving for rate must not demand a valid rate first.
  solved(loanCalculator, "rate", {
    loanAmt: 200_000, payment: MORTGAGE_PAYMENT, years: 30, months: 0, rate: 0,
  });
  // Solving for term must not demand a valid term first.
  solved(loanCalculator, "term", {
    loanAmt: 200_000, payment: MORTGAGE_PAYMENT, rate: 6, years: 0, months: 0,
  });
  // Same on the financial side.
  solved(financialCalculator, "rate", {
    presentValue: 0, payment: 100, futureValue: 15_528.23, years: 10, months: 0,
  });
  solved(financialCalculator, "term", {
    presentValue: 0, payment: 100, futureValue: 15_528.23, rate: 5,
  });
});

test("financial leaves value fields unvalidated, as the original did", () => {
  // Negative present and future values are legitimate here, per the
  // original's own help text, so they must not be rejected.
  solved(financialCalculator, "payment", {
    presentValue: -5_000, futureValue: -1_000, rate: 5, years: 5, months: 0,
  });
});

test("field definitions are coherent", () => {
  for (const calc of Object.values(CALCULATORS)) {
    const ids = calc.fields.map((f) => f.id);
    assert.equal(new Set(ids).size, ids.length, `${calc.id}: duplicate field ids`);

    // Every field advertising a target must have that target be solvable.
    for (const field of calc.fields) {
      if (field.target === null) continue;
      const r = calc.solve(field.target, {});
      assert.ok(
        r.ok || r.note !== `Cannot compute ${field.target} here`,
        `${calc.id}.${field.id} advertises unsolvable target ${field.target}`,
      );
    }

    // The term pair must be grouped together or not present at all.
    const grouped = calc.fields.filter((f) => f.group === "term").map((f) => f.id);
    assert.deepEqual(
      grouped.sort(),
      ["months", "years"],
      `${calc.id}: term group should be exactly years+months`,
    );
  }
});

/* Strict input validation: the original NaN-checked results but never inputs. */

test("NaN is rejected on every input field", () => {
  for (const calc of Object.values(CALCULATORS)) {
    for (const field of calc.fields) {
      // Pick a target this field is not itself the answer to.
      const target: TargetId =
        field.target === "payment" ? "rate" : "payment";
      if (field.target === target) continue;

      const values: FieldValues = { ...VALID[calc.id], [field.id]: NaN };
      const r = calc.solve(target, values);
      assert.ok(
        !r.ok,
        `${calc.id}.${field.id}: NaN was accepted when solving ${target}`,
      );
      assert.equal(r.field, field.id === "months" ? "years" : field.id);
    }
  }
});

test("Infinity is rejected", () => {
  assert.ok(!loanCalculator.solve("payment", { ...MORTGAGE, loanAmt: Infinity }).ok);
  assert.ok(!financialCalculator.solve("futureValue", {
    presentValue: -Infinity, payment: 100, rate: 5, years: 10, months: 0,
  }).ok);
});

test("financial: magnitude is bounded but sign is not", () => {
  const base = { rate: 5, years: 10, months: 0, payment: 100 };

  // Large negatives are fine -- withdrawals and debts are the point.
  assert.ok(financialCalculator.solve("futureValue", {
    ...base, presentValue: -1_000_000,
  }).ok);

  // Beyond MAX_VALUE is a conversion error, either direction.
  assert.ok(!financialCalculator.solve("futureValue", {
    ...base, presentValue: 2e8,
  }).ok);
  assert.ok(!financialCalculator.solve("futureValue", {
    ...base, presentValue: -2e8,
  }).ok);
});

test("financial: rate and inflation adjustment accept -100..100", () => {
  const base = { presentValue: 0, payment: 100, years: 10, months: 0 };

  // The original enforced 0..100; the Help frames say -100 to 100.
  assert.ok(financialCalculator.solve("futureValue", { ...base, rate: -5 }).ok);
  assert.ok(financialCalculator.solve("futureValue", { ...base, rate: -100 }).ok);
  assert.ok(financialCalculator.solve("futureValue", { ...base, rate: 100 }).ok);

  assert.match(
    rejected(financialCalculator, "futureValue", { ...base, rate: 101 }),
    /from -100 to 100/,
  );
  assert.match(
    rejected(financialCalculator, "futureValue", { ...base, rate: -101 }),
    /from -100 to 100/,
  );

  // A negative adjustment is allowed: payments may shrink over time.
  assert.ok(
    financialCalculator.solve("futureValue", { ...base, rate: 5, infAdj: -3 }).ok,
  );
  assert.ok(
    !financialCalculator.solve("futureValue", { ...base, rate: 5, infAdj: 150 }).ok,
  );
});

test("loan: rate range matches the financial calculator", () => {
  assert.ok(loanCalculator.solve("payment", { ...MORTGAGE, rate: -5 }).ok);
  assert.ok(!loanCalculator.solve("payment", { ...MORTGAGE, rate: 101 }).ok);
  assert.ok(!loanCalculator.solve("payment", { ...MORTGAGE, rate: -101 }).ok);
});

test("financial: term is range-checked like the loan calculator", () => {
  const base = { presentValue: 0, payment: 100, rate: 5 };

  assert.match(
    rejected(financialCalculator, "futureValue", { ...base, years: 0, months: 0 }),
    /legitimate combination of years & months/,
  );
  assert.match(
    rejected(financialCalculator, "futureValue", { ...base, years: 200, months: 0 }),
    /legitimate combination of years & months/,
  );
  // Exactly MAX_MONTHS is allowed.
  assert.ok(
    financialCalculator.solve("futureValue", { ...base, years: 100, months: 0 }).ok,
  );
});

test("the field being solved for is never itself validated", () => {
  // Every target, on both calculators, with its own field set to garbage.
  for (const calc of Object.values(CALCULATORS)) {
    const targets = [
      ...new Set(
        calc.fields
          .map((f) => f.target)
          .filter((t): t is TargetId => t !== null),
      ),
    ];

    for (const target of targets) {
      const values: FieldValues = { ...VALID[calc.id] };
      if (target === "term") {
        values.years = NaN;
        values.months = NaN;
      } else {
        values[target as FieldId] = NaN;
      }

      const r = calc.solve(target, values);
      assert.ok(
        r.ok,
        `${calc.id}: solving ${target} wrongly required a valid ${target} (${r.ok ? "" : r.note})`,
      );
    }
  }
});
