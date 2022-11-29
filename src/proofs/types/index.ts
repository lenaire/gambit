export type Operator =
  | "equals"
  | "strictEquals"
  | "startsWith"
  | "endsWith"
  | "contains"
  | "greaterThan"
  | "greaterThanOrEqualTo"
  | "lessThanOrEqualTo"
  | "lessThan";

export type LogicGate = "AND" | "OR" | "XOR" | "NOT" | "NAND" | "NOR" | "XNOR";

export interface Statement<TValue> {
  variable: string;
  operator: Operator;
  value: TValue;
}

export interface Proof<TFact, TValue> {
  logicGate?: LogicGate;
  statements: Statement<TValue>[];
  outcome?: any | ((fact?: TFact) => any);
}

export type Proofs<TFact, TValue> = Proof<TFact, TValue>[];

export interface IGambit<TFact, TValue> {
  evaluate(fact: TFact): Proof<TFact, TValue> | undefined;
}
