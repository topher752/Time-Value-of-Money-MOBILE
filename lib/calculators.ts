/**
 * Declarative calculator definitions: each is a field list plus a solver, so
 * the UI stays generic rather than hand-built per calculator.
 *
 * The solvers reproduce the original Wix FinanceCalc/LoanCalc call sites
 * exactly, sign conventions included -- tvm.ts takes signed cash flows and
 * the negation happens here, at the boundary. This file supersedes them.
 */
import {
  MAX_MONTHS,
  MAX_VALUE,
  calcFutureValue,
  calcIntRate,
  calcPayment,
  calcPresentValue,
  calcTerm,
  trim,
} from "./tvm.ts";

export type FieldId =
  | "loanAmt"
  | "presentValue"
  | "rate"
  | "years"
  | "months"
  | "payment"
  | "futureValue"
  | "infAdj";

/** "term" resolves to the years+months pair together. */
export type TargetId =
  | "loanAmt"
  | "presentValue"
  | "rate"
  | "term"
  | "payment"
  | "futureValue";

export type FieldValues = Partial<Record<FieldId, number>>;

export interface FieldDef {
  id: FieldId;
  label: string;
  /** Dimmed italic, after the label. */
  secondaryLabel?: string;
  /** Shown on the Help screen and on validation failure. */
  help: string;
  /** What this field's button solves for; null for input-only (infAdj). */
  target: TargetId | null;
  /** Years and months share one row and one button. */
  group?: "term";
  /** Applied when this field is not the compute target. */
  rule: FieldRule;
  /** Input width from the frames: full 251, narrow 110, medium 148. */
  width?: "full" | "narrow" | "medium";
  /** The inflation adjustment is inset from the left margin. */
  indent?: boolean;
}

export interface SolveSuccess {
  ok: true;
  updates: Partial<Record<FieldId, number>>;
  computed: TargetId;
  note: string;
}

export interface SolveFailure {
  ok: false;
  note: string;
  /** Field to flag, when the failure is attributable to one. */
  field?: FieldId;
}

export type SolveResult = SolveSuccess | SolveFailure;

export interface HelpItem {
  /** Bold lead-in, e.g. "Present Value". */
  term: string;
  description: string;
}

/** A calculator's help overlay, per the Figma help frames. */
export interface HelpContent {
  title: string;
  intro: string;
  items: HelpItem[];
  closing: string;
}

export interface CalculatorDef {
  id: "financial" | "loan";
  title: string;
  /** Note shown before any computation. */
  defaultNote: string;
  fields: FieldDef[];
  helpContent: HelpContent;
  solve(target: TargetId, values: FieldValues): SolveResult;
}

export const COMPLETION_NOTE = "Computation Complete";

/* Help text recovered from the original, where help_display() was commented out. */

export const HELP = {
  /* Both frames show this line; the design's wording wins over the original's. */
  financialDefault:
    "To compute a value, enter values for all other cells and select Compute for the target",
  loanDefault:
    "To compute a value, enter values for all other cells and select Compute for the target",
  interest:
    "Enter the interest as a percentage, from -100 to 100. As an example, to show a 3.5 percent rate, you would enter 3.5",
  term: `Enter any legitimate combination of years & months as long as it's less than ${MAX_MONTHS} months in total.`,
  infadj: "Enter Payment/Withdrawal Yearly Adjustment (e.g. enter 3 for 3%)",
  presentVal: "Enter Present Value (i.e. initial investment)",
  futureVal:
    "Enter Future Value (i.e. ending value).  This can be positive or negative",
  payment:
    "Enter positive value for monthly payment or negative value for withdrawal",
  loanAmt: "Enter Loan Amount greater than zero",
  loanPayment: "Enter Monthly Payment greater than zero:  ",
} as const;

/** From the original help_display() functions. */
export const HELP_NOTES = [
  "To compute any value, enter values for all other values, then press the compute button for the target value.",
  "Any value that is not entered will be filled in as a zero.",
  "'inf adj' is a percentage value. It can be used to auto adjust the payment or withdrawal each year. It is an input value only and will not be computed.",
  "The Loan Length can be entered as any valid combination of years/months. For example, for 2 years, you could also enter 1 yr, 12 months, or 24 months.",
  "The amort button will print an amortization schedule.",
  "The reset button will clear all values to zero.",
] as const;

/* ------------------------------------------------------------------------- */

const v = (values: FieldValues, id: FieldId): number => values[id] ?? 0;

/** Total term in months, from the years + months pair. */
const termMonths = (values: FieldValues): number =>
  12 * v(values, "years") + v(values, "months");

/**
 * Range check on a computed result, from the original verify_result(), which
 * flagged the problem but still wrote the value into the field.
 */
function verifyComputed(value: number): { value: number; note: string | null } {
  if (value < -MAX_VALUE || value > MAX_VALUE || Number.isNaN(value)) {
    return { value, note: `***Invalid Computation: ${value}` };
  }
  return { value, note: null };
}

function verifyComputedMonths(value: number): {
  value: number;
  note: string | null;
} {
  if (value < 0 || value > MAX_MONTHS || Number.isNaN(value)) {
    return { value, note: `***Invalid Computation: ${value}` };
  }
  return { value, note: null };
}

/** Split months into the years/months pair the UI shows. */
function splitTerm(months: number): { years: number; months: number } {
  return { years: Math.floor(months / 12), months: Math.floor(months % 12) };
}

function succeed(
  computed: TargetId,
  updates: Partial<Record<FieldId, number>>,
  note: string | null,
): SolveSuccess {
  return { ok: true, updates, computed, note: note ?? COMPLETION_NOTE };
}

/* -------------------------------------------------------------------------
 * Shared validators, ported from the verify_* functions in LoanCalc.js.
 * ---------------------------------------------------------------------- */

/**
 * Validation rule, applied when a field is *not* the one being solved for.
 *
 *   signed   -- any sign, bounded magnitude (present/future value, payment)
 *   positive -- greater than zero (loan amount, loan payment)
 *   percent  -- -100..100 (rate, inflation adjustment). The original
 *               verify_rate() enforced 0..100; the Help frames say
 *               -100 to 100, and the wider range wins.
 *   termPart -- years/months, validated together as a total
 */
export type FieldRule = "signed" | "positive" | "percent" | "termPart";

/**
 * Reject anything that cannot take part in arithmetic.
 *
 * Closes a hole in the original: every comparison against NaN is false, so
 * `x <= 0 || x > MAX_VALUE` passed it through. Only computed results were
 * ever NaN-checked, never inputs, so non-numeric text reached the solvers.
 */
function checkFinite(
  values: FieldValues,
  id: FieldId,
  help: string,
): SolveFailure | null {
  if (!Number.isFinite(v(values, id))) {
    return { ok: false, note: help, field: id };
  }
  return null;
}

/** Apply one field's rule; term parts are handled as a pair. */
function checkField(
  values: FieldValues,
  field: FieldDef,
): SolveFailure | null {
  if (field.rule === "termPart") return null;

  const nonFinite = checkFinite(values, field.id, field.help);
  if (nonFinite) return nonFinite;

  const x = v(values, field.id);
  const fail: SolveFailure = { ok: false, note: field.help, field: field.id };

  switch (field.rule) {
    case "positive":
      return x <= 0 || x > MAX_VALUE ? fail : null;
    case "percent":
      return x < -100 || x > 100 ? fail : null;
    case "signed":
    default:
      return Math.abs(x) > MAX_VALUE ? fail : null;
  }
}

/** The years+months pair, validated as a single total. */
function checkTerm(values: FieldValues): SolveFailure | null {
  const years = v(values, "years");
  const months = v(values, "months");

  if (!Number.isFinite(years) || !Number.isFinite(months)) {
    return { ok: false, note: HELP.term, field: "years" };
  }
  const total = 12 * years + months;
  if (total <= 0 || total > MAX_MONTHS) {
    return { ok: false, note: HELP.term, field: "years" };
  }
  return null;
}

/** Fields a target writes to -- solving for a value must not require it first. */
function fieldsOwnedBy(target: TargetId): FieldId[] {
  return target === "term" ? ["years", "months"] : [target as FieldId];
}

/**
 * Validate every input except the ones the target overwrites, in declared
 * order, so the message matches the topmost problem on screen.
 */
function validateInputs(
  calculator: CalculatorDef,
  target: TargetId,
  values: FieldValues,
): SolveFailure | null {
  const owned = new Set(fieldsOwnedBy(target));

  const hasTermField = calculator.fields.some((f) => f.rule === "termPart");
  const skipTerm = target === "term" || !hasTermField;

  for (const field of calculator.fields) {
    if (owned.has(field.id)) continue;

    if (field.rule === "termPart") {
      // Check the pair once, at the position of the first term field.
      if (skipTerm) continue;
      const failure = checkTerm(values);
      if (failure) return failure;
      continue;
    }

    const failure = checkField(values, field);
    if (failure) return failure;
  }

  return null;
}

/* -------------------------------------------------------------------------
 * Financial calculator
 * ---------------------------------------------------------------------- */

export const financialCalculator: CalculatorDef = {
  id: "financial",
  title: "Financial Calculator",
  defaultNote: HELP.financialDefault,

  fields: [
    { id: "presentValue", label: "Present Val", help: HELP.presentVal, target: "presentValue", rule: "signed", width: "full" },
    { id: "rate", label: "Interest Rate", help: HELP.interest, target: "rate", rule: "percent", width: "full" },
    { id: "years", label: "Term", secondaryLabel: "(Years and Months)", help: HELP.term, target: "term", group: "term", rule: "termPart", width: "narrow" },
    { id: "months", label: "Months", help: HELP.term, target: "term", group: "term", rule: "termPart", width: "narrow" },
    { id: "payment", label: "Mo. +Dep/-Draw", help: HELP.payment, target: "payment", rule: "signed", width: "full" },
    { id: "infAdj", label: "Inflation Adjustment", help: HELP.infadj, target: null, rule: "percent", width: "medium", indent: true },
    { id: "futureValue", label: "Future Val", help: HELP.futureVal, target: "futureValue", rule: "signed", width: "full" },
  ],

  helpContent: {
    title: "Financial Calculator Assistance",
    intro: "There are 6 values that can be entered:",
    items: [
      {
        term: "Present Val",
        description:
          "The present value, or in simpler terms, the initial investment",
      },
      {
        term: "Interest Rate",
        description:
          "The interest as a percentage, from -100 to 100. For example, to enter a 3.5 percent rate, you would enter 3.5",
      },
      {
        term: "Term",
        description:
          "The length of time, entered as any legitimate combination of years and months",
      },
      {
        term: "Mo. +Dep/-Draw",
        description:
          "Your monthly deposit or withdrawal. Enter a positive value to deposit each month, or a negative value to withdraw",
      },
      {
        term: "Inflation Adjustment",
        description:
          "A yearly adjustment to the deposit or withdrawal above. For example, enter 3 for 3%",
      },
      {
        term: "Future Val",
        description:
          "The future or ending value, which can be positive or negative",
      },
    ],
    closing:
      "Fill in every value except the one you want, then press Compute next to it. That field is filled in from the others, and the result also appears at the top under Computed Value. Any field left blank counts as 0.",
  },

  solve(target, values) {
    const months = termMonths(values);
    const rate = v(values, "rate");
    const presentVal = v(values, "presentValue");
    const futureVal = v(values, "futureValue");
    const payment = v(values, "payment");
    const infAdj = v(values, "infAdj");

    /*
     * FinanceCalc ran no validation at all -- its "Vertify Values" comments
     * sit above nothing. Signs stay free on the value fields: present value,
     * future value and payment are all legitimately negative here.
     */
    const invalid = validateInputs(financialCalculator, target, values);
    if (invalid) return invalid;

    switch (target) {
      case "presentValue": {
        const raw = calcPresentValue(months, rate, -payment, futureVal, infAdj);
        const { value, note } = verifyComputed(trim(-raw));
        return succeed("presentValue", { presentValue: value }, note);
      }
      case "futureValue": {
        const raw = calcFutureValue(months, rate, -presentVal, -payment, infAdj);
        const { value, note } = verifyComputed(trim(raw));
        return succeed("futureValue", { futureValue: value }, note);
      }
      case "payment": {
        const raw = calcPayment(months, rate, -presentVal, futureVal, infAdj);
        const { value, note } = verifyComputed(trim(-raw));
        return succeed("payment", { payment: value }, note);
      }
      case "term": {
        const total = calcTerm(rate, -presentVal, -payment, futureVal, infAdj);
        const split = splitTerm(total);
        const { value, note } = verifyComputedMonths(split.months);
        return succeed("term", { years: split.years, months: value }, note);
      }
      case "rate": {
        const raw = calcIntRate(months, -presentVal, -payment, futureVal, infAdj);
        const { value, note } = verifyComputed(trim(raw));
        return succeed("rate", { rate: value }, note);
      }
      default:
        return { ok: false, note: `Cannot compute ${target} here` };
    }
  },
};

/* -------------------------------------------------------------------------
 * Loan / mortgage calculator
 *
 * Every solver passes futureValue = 0 and infAdj = 0: a loan runs to zero
 * with no payment escalation. Sign conventions differ from the financial
 * calculator -- calcPayment takes -loanAmt, calcTerm and calcIntRate take it
 * positive. That asymmetry is the original's, reproduced not normalized.
 * ---------------------------------------------------------------------- */

export const loanCalculator: CalculatorDef = {
  id: "loan",
  title: "Loan & Mortgage Calculator",
  defaultNote: HELP.loanDefault,

  fields: [
    { id: "loanAmt", label: "Loan Amount", help: HELP.loanAmt, target: "loanAmt", rule: "positive", width: "full" },
    { id: "rate", label: "Rate", help: HELP.interest, target: "rate", rule: "percent", width: "full" },
    { id: "years", label: "Term", secondaryLabel: "(Years and Months)", help: HELP.term, target: "term", group: "term", rule: "termPart", width: "narrow" },
    { id: "months", label: "Months", help: HELP.term, target: "term", group: "term", rule: "termPart", width: "narrow" },
    { id: "payment", label: "Payment", help: HELP.loanPayment, target: "payment", rule: "positive", width: "full" },
  ],

  helpContent: {
    title: "Loan and Mortgage Calculator Assistance",
    intro: "There are 4 values that can be entered:",
    items: [
      {
        term: "Loan Amount",
        description: "The total amount being borrowed",
      },
      {
        term: "Rate",
        description:
          "The interest as a percentage, from -100 to 100. For example, to enter a 3.5 percent rate, you would enter 3.5",
      },
      {
        term: "Term",
        description:
          "The length of the loan, entered as any legitimate combination of years and months",
      },
      {
        term: "Payment",
        description: "The monthly payment, which must be greater than 0",
      },
    ],
    closing:
      "Fill in every value except the one you want, then press Compute next to it. That field is filled in from the others, and the result also appears at the top under Computed Value. Any field left blank counts as 0.",
  },

  solve(target, values) {
    const invalid = validateInputs(loanCalculator, target, values);
    if (invalid) return invalid;

    const months = termMonths(values);
    const rate = v(values, "rate");
    const loanAmt = v(values, "loanAmt");
    const payment = v(values, "payment");

    switch (target) {
      case "loanAmt": {
        const raw = calcPresentValue(months, rate, -payment, 0, 0);
        const { value, note } = verifyComputed(trim(raw));
        return succeed("loanAmt", { loanAmt: value }, note);
      }
      case "payment": {
        const raw = calcPayment(months, rate, -loanAmt, 0, 0);
        const { value, note } = verifyComputed(trim(raw));
        return succeed("payment", { payment: value }, note);
      }
      case "term": {
        const total = calcTerm(rate, loanAmt, -payment, 0, 0);
        const split = splitTerm(total);
        const { value, note } = verifyComputedMonths(split.months);
        return succeed("term", { years: split.years, months: value }, note);
      }
      case "rate": {
        const raw = calcIntRate(months, loanAmt, -payment, 0, 0);
        const { value, note } = verifyComputed(trim(raw));
        return succeed("rate", { rate: value }, note);
      }
      default:
        return { ok: false, note: `Cannot compute ${target} here` };
    }
  },
};

export const CALCULATORS = {
  financial: financialCalculator,
  loan: loanCalculator,
} as const;

/** Amortization inputs, in each calculator's own sign convention. */
export function amortizationInputs(
  calculator: CalculatorDef,
  values: FieldValues,
): { term: number; rate: number; presentValue: number; payment: number; infAdj: number } {
  const term = termMonths(values);
  const rate = v(values, "rate");

  if (calculator.id === "loan") {
    return {
      term,
      rate,
      presentValue: v(values, "loanAmt"),
      payment: -v(values, "payment"),
      infAdj: 0,
    };
  }
  return {
    term,
    rate,
    presentValue: -v(values, "presentValue"),
    payment: -v(values, "payment"),
    infAdj: v(values, "infAdj"),
  };
}
