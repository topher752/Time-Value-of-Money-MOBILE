/**
 * State for one calculator screen, on the original's model: fill in every
 * field but one, press that one's Compute, and the answer is written back
 * into it. No live recalculation -- computing is always explicit, and the
 * result becomes an ordinary editable value.
 */
import { useCallback, useMemo, useReducer } from "react";
import {
  type AmortizationSchedule,
  buildAmortizationSchedule,
} from "../lib/tvm.ts";
import { formatNumber, parseNumeric } from "../lib/format.ts";
import {
  type CalculatorDef,
  type FieldId,
  type FieldValues,
  type TargetId,
  amortizationInputs,
} from "../lib/calculators.ts";

export interface CalculatorState {
  /** Raw text as typed, keyed by field. */
  raw: Partial<Record<FieldId, string>>;
  /** Most recently solved target, for result highlighting. */
  computed: TargetId | null;
  /** Status line: help text, completion, or a validation message. */
  note: string;
  invalidField: FieldId | null;
}

type Action =
  | { type: "setField"; field: FieldId; value: string }
  | { type: "compute"; target: TargetId; calculator: CalculatorDef }
  | { type: "reset"; calculator: CalculatorDef }
  | { type: "note"; note: string };

function toValues(raw: CalculatorState["raw"]): FieldValues {
  const values: FieldValues = {};
  (Object.keys(raw) as FieldId[]).forEach((id) => {
    values[id] = parseNumeric(raw[id]);
  });
  return values;
}

function initialState(calculator: CalculatorDef): CalculatorState {
  return {
    raw: {},
    computed: null,
    note: calculator.defaultNote,
    invalidField: null,
  };
}

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case "setField":
      return {
        ...state,
        raw: { ...state.raw, [action.field]: action.value },
        // Editing clears the highlight: the answer no longer matches the inputs.
        computed: null,
        invalidField:
          state.invalidField === action.field ? null : state.invalidField,
      };

    case "compute": {
      const result = action.calculator.solve(
        action.target,
        toValues(state.raw),
      );

      if (!result.ok) {
        return {
          ...state,
          computed: null,
          note: result.note,
          invalidField: result.field ?? null,
        };
      }

      // Written back formatted, as the mockups show; parseNumeric strips
      // the separators again so a result can be reused as an input.
      const raw = { ...state.raw };
      (Object.keys(result.updates) as FieldId[]).forEach((id) => {
        const value = result.updates[id];
        raw[id] = value === undefined ? "" : formatNumber(value);
      });

      return { raw, computed: result.computed, note: result.note, invalidField: null };
    }

    case "reset":
      return initialState(action.calculator);

    case "note":
      return { ...state, note: action.note };

    default:
      return state;
  }
}

export interface UseCalculator {
  state: CalculatorState;
  values: FieldValues;
  setField: (field: FieldId, value: string) => void;
  compute: (target: TargetId) => void;
  reset: () => void;
  setNote: (note: string) => void;
  /** Most recently computed value, or "" since the last edit. */
  computedValue: string;
  /** Label for the pill beside the headline. */
  computedLabel: string;
  buildSchedule: () => AmortizationSchedule;
}

export function useCalculator(calculator: CalculatorDef): UseCalculator {
  const [state, dispatch] = useReducer(reducer, calculator, initialState);

  const setField = useCallback(
    (field: FieldId, value: string) =>
      dispatch({ type: "setField", field, value }),
    [],
  );

  const compute = useCallback(
    (target: TargetId) => dispatch({ type: "compute", target, calculator }),
    [calculator],
  );

  const reset = useCallback(
    () => dispatch({ type: "reset", calculator }),
    [calculator],
  );

  const setNote = useCallback(
    (note: string) => dispatch({ type: "note", note }),
    [],
  );

  const values = useMemo(() => toValues(state.raw), [state.raw]);

  const { computedValue, computedLabel } = useMemo(() => {
    if (state.computed === null) return { computedValue: "", computedLabel: "" };

    // "term" spans two fields, so it reports as a pair.
    if (state.computed === "term") {
      const years = state.raw.years ?? "0";
      const months = state.raw.months ?? "0";
      return { computedValue: `${years}y ${months}m`, computedLabel: "Term" };
    }

    const field = calculator.fields.find((f) => f.id === state.computed);
    return {
      computedValue: state.raw[state.computed as FieldId] ?? "",
      computedLabel: field?.label ?? "",
    };
  }, [state.computed, state.raw, calculator.fields]);

  const buildSchedule = useCallback(() => {
    const input = amortizationInputs(calculator, values);
    return buildAmortizationSchedule(
      input.term,
      input.rate,
      input.presentValue,
      input.payment,
      input.infAdj,
    );
  }, [calculator, values]);

  return {
    state,
    values,
    setField,
    compute,
    reset,
    setNote,
    computedValue,
    computedLabel,
    buildSchedule,
  };
}
