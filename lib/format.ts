/** Display formatting for calculator values. */

/** Matches what trim() yields, so formatting never rounds the engine's output. */
const MAX_FRACTION_DIGITS = 3;

/** 1200 renders as "1,200", not "1,200.000". */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "";
  return value.toLocaleString("en-US", {
    maximumFractionDigits: MAX_FRACTION_DIGITS,
    useGrouping: true,
  });
}

/**
 * Parse user input back to a number.
 *
 * Strips the separators formatNumber emits, so a computed "131,570.377"
 * round-trips instead of stopping at the comma. Uses Number() rather than
 * parseFloat(), which would silently turn "12abc" into 12 and "1.2.3" into
 * 1.2; NaN reaches the validators instead. Blank is zero, as the original did.
 */
export function parseNumeric(text: string | undefined): number {
  if (text === undefined) return 0;
  const cleaned = text.replace(/,/g, "").trim();
  return cleaned === "" ? 0 : Number(cleaned);
}
