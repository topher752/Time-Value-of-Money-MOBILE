/**
 * Time-value-of-money engine.
 *
 * Ported from the original Wix app's cal_utils.js, preserving iteration
 * counts, tolerances and rounding exactly. Quirks that look like bugs are
 * flagged at each site and deliberately not corrected -- doing so would
 * change every previously-computed answer.
 *
 * Rates are yearly percentages (3.5 means 3.5%); `infadj` is a yearly payment
 * adjustment applied at each 12-month boundary; terms are in months. Callers
 * negate cash flows at the boundary, as the original did -- see calculators.ts.
 */

/** 100 years. Bounds the search loops. */
export const MAX_MONTHS = 1200;

/** Any input above this is treated as a conversion error by the validators. */
export const MAX_VALUE = 100_000_000;
export const MIN_VALUE = -MAX_VALUE;

/**
 * Truncate at 3 decimals via Math.floor, not symmetric truncation, so
 * negatives round away from zero: trim(-1.2345) is -1.235, trim(1.2345) is
 * 1.234. Changing it would shift the last digit of every negative output.
 */
export function trim(x: number): number {
  return Math.floor(x * 1000) / 1000;
}

/**
 * Months required to go from `initVal` to `endVal`.
 *
 * The loop is do/while, so the result is always at least 1 month, even when
 * the term is already satisfied at month 0.
 */
export function calcTerm(
  yearlyRate: number,
  initVal: number,
  payment: number,
  endVal: number,
  infadj: number,
): number {
  let monthlyInterest: number;
  let months = 0;
  let thisMonthsPrincipal: number;

  const monthlyIntRate = (yearlyRate / 12) * 0.01;
  const adj = infadj * 0.01;
  let adjustingPrincipal = initVal;
  let pmt = payment;

  do {
    months++;
    monthlyInterest = monthlyIntRate * adjustingPrincipal;
    thisMonthsPrincipal = pmt + monthlyInterest;
    adjustingPrincipal += thisMonthsPrincipal;
    if (months > MAX_MONTHS) break;
    if (months % 12 === 0) pmt *= 1 + adj;
  } while (
    Math.abs(adjustingPrincipal + endVal) > Math.abs(thisMonthsPrincipal)
  );

  return months;
}

/**
 * Monthly payment, by binary search. A closed form exists, but the yearly
 * inflation adjustment makes it awkward. Bounds, iteration cap and tolerance
 * are carried over verbatim.
 *
 * On non-convergence the last estimate is returned rather than an error, so
 * a bad input yields a plausible-looking wrong number -- callers range-check.
 */
export function calcPayment(
  term: number,
  yearlyRate: number,
  presentValue: number,
  futureValue: number,
  infAdj: number,
): number {
  let hiPayment = 10_000_000;
  let loPayment = -10_000_000;
  let maxTries = 0;
  let estPayment = 0;
  let ttlPrincipal: number;
  let payment: number;
  let monthlyInt: number;

  const rate = (yearlyRate / 12) * 0.01;
  const adj = infAdj * 0.01;

  while (maxTries++ < 100) {
    estPayment = (hiPayment + loPayment) / 2;
    ttlPrincipal = presentValue;
    payment = estPayment;

    for (let i = 1; i <= term; i++) {
      monthlyInt = ttlPrincipal * rate;
      ttlPrincipal += payment + monthlyInt;
      if (i % 12 === 0) payment *= 1 + adj;
    }

    if (Math.abs(ttlPrincipal + futureValue) < 0.005) break;

    if (ttlPrincipal < -futureValue) loPayment = estPayment;
    else hiPayment = estPayment;
  }

  return estPayment;
}

/** Present value, discounted backwards; negated because the walk runs in reverse. */
export function calcPresentValue(
  term: number,
  yearlyRate: number,
  payment: number,
  futureValue: number,
  infadj: number,
): number {
  let presentValue = futureValue;
  const monthlyIntRate = 1 + (yearlyRate / 12) * 0.01;

  const years = Math.floor((term - 1) / 12);
  const adj = infadj * 0.01;

  // Start fully escalated and de-escalate, mirroring calcFutureValue.
  let pmt = payment * Math.pow(1 + adj, years);

  for (let i = 1; i <= term; i++) {
    presentValue = (presentValue + pmt) / monthlyIntRate;
    if (i % 12 === 0) pmt /= 1 + adj;
  }

  return -presentValue;
}

/**
 * Total payments over the term.
 *
 * Unlike the other functions, `infadj` here is an already-scaled decimal
 * (0.03), not a percentage (3) -- the convention calcIntRate calls it with.
 */
export function calcTtlPayments(
  payment: number,
  term: number,
  infadj: number,
): number {
  let ttl = 0;
  let pmt = payment;

  for (let i = 1; i <= term; i++) {
    ttl += pmt;
    if (i % 12 === 0) pmt *= 1 + infadj;
  }
  return ttl;
}

/**
 * Interest rate, by binary search on total interest paid -- there is no
 * closed form. Bounds are monthly rates of +/- 0.99; returns a yearly
 * percentage. As with calcPayment, non-convergence returns the last estimate.
 */
export function calcIntRate(
  term: number,
  presentValue: number,
  payment: number,
  futureValue: number,
  infadj: number,
): number {
  let adjustingPrincipal: number;
  let estimatedRate = 0;
  let ttlInt: number;
  let monthlyInterest: number;
  let hiRate = 0.99;
  let loRate = -0.99;
  let maxTries = 0;
  let newPayment: number;

  const adj = infadj * 0.01;
  const ttlPayments = calcTtlPayments(payment, term, adj);
  const exactInt = Math.abs(ttlPayments + (futureValue + presentValue));

  while (maxTries++ < 100) {
    ttlInt = 0;
    estimatedRate = (hiRate + loRate) / 2;
    adjustingPrincipal = presentValue;
    newPayment = payment;

    for (let i = 1; i <= term; i++) {
      monthlyInterest = adjustingPrincipal * estimatedRate;
      ttlInt += monthlyInterest;
      adjustingPrincipal += newPayment + monthlyInterest;
      if (i % 12 === 0) newPayment *= 1 + adj;
    }

    ttlInt = Math.abs(ttlInt);

    if (Math.abs(ttlInt - exactInt) < 0.005) break;
    if (ttlInt < exactInt) loRate = estimatedRate;
    else hiRate = estimatedRate;
  }

  return estimatedRate * 12.0 * 100.0;
}

/**
 * Compound forward to the future value.
 *
 * The original interleaved an amortization report into this loop via Velo
 * parameters; that is split out into buildAmortizationSchedule below, which
 * walks the identical loop and returns data instead of strings.
 */
export function calcFutureValue(
  term: number,
  yearlyRate: number,
  presentValue: number,
  payment: number,
  infadj: number,
): number {
  let futureValue = presentValue;
  let monthlyInterest: number;

  const monthlyIntRate = (yearlyRate / 12) * 0.01;
  const adj = infadj * 0.01;
  let pmt = payment;

  for (let i = 1; i <= term; i++) {
    monthlyInterest = futureValue * monthlyIntRate;
    futureValue += monthlyInterest + pmt;
    if (i % 12 === 0) pmt *= 1 + adj;
  }

  return -futureValue;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  monthlyInterest: number;
  monthlyPrincipal: number;
  totalPrincipal: number;
}

export interface AmortizationSchedule {
  term: number;
  yearlyRate: number;
  initialPrincipal: number;
  yearlyPaymentAdjustment: number;
  rows: AmortizationRow[];
  totalPayments: number;
  totalInterest: number;
  finalValue: number;
}

/**
 * Amortization schedule, extracted from the original's reporting branch.
 *
 * Accumulation order matters: `totalPrincipal` is recorded *before* the
 * month's principal is added, so the first row is the opening balance.
 */
export function buildAmortizationSchedule(
  term: number,
  yearlyRate: number,
  presentValue: number,
  payment: number,
  infadj: number,
): AmortizationSchedule {
  const monthlyIntRate = (yearlyRate / 12) * 0.01;
  const adj = infadj * 0.01;

  let futureValue = presentValue;
  let ttlPrincipal = presentValue;
  let ttlPayments = 0;
  let ttlInt = 0;
  let pmt = payment;

  const rows: AmortizationRow[] = [];

  for (let i = 1; i <= term; i++) {
    const monthlyInterest = futureValue * monthlyIntRate;
    const monthlyPrincipal = pmt + monthlyInterest;

    rows.push({
      month: i,
      payment: pmt,
      monthlyInterest,
      monthlyPrincipal,
      totalPrincipal: ttlPrincipal,
    });

    ttlPrincipal += monthlyPrincipal;
    ttlInt += monthlyInterest;
    ttlPayments += pmt;
    futureValue += monthlyInterest + pmt;
    if (i % 12 === 0) pmt *= 1 + adj;
  }

  return {
    term,
    yearlyRate,
    initialPrincipal: presentValue,
    yearlyPaymentAdjustment: adj,
    rows,
    totalPayments: ttlPayments,
    totalInterest: ttlInt,
    finalValue: futureValue,
  };
}
