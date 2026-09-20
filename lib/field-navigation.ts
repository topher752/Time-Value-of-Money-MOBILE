/**
 * Which field the keyboard toolbar's arrows move to.
 *
 * Pure and separate from the component so the ordering and the behavior at
 * the ends can be tested without rendering anything.
 */
export function adjacentField<T extends string>(
  order: readonly T[],
  current: T | null,
  delta: number,
): T | null {
  if (current === null) return null;

  const index = order.indexOf(current);
  if (index < 0) return null;

  // Clamped rather than wrapping: moving past either end does nothing.
  return order[index + delta] ?? null;
}
