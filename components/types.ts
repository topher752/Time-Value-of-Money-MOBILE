export interface ICalculator {
  rows: ICalculatorRow[];
  computedValue: string | number;
  computedLabel: string;
  resetFunction: () => void;
  viewAmortization?: boolean;
  viewAmortizationFunction: () => void;
}

export interface ICalculatorRow {
  header: string;
  setInputChange: () => void;
  calculateFunction: () => void;
  rowValue: string;
  secondHeader?: string;
  terms?: boolean;
  inflation?: boolean;
}
