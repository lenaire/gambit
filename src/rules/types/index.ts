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

export type Gate = "AND" | "OR" | "XOR" | "NOT" | "NAND" | "NOR" | "XNOR";

export interface Clause<TValue> {
  variable: string;
  operator: Operator;
  values: TValue;
}

export interface Rule<TFact, TValue> {
  gate?: Gate;
  clauses: Clause<TValue>[];
  assignment?: any | ((fact?: TFact) => any);
}

export type Rules<TFact, TValue> = Rule<TFact, TValue>[];

export interface IGambit<TFact, TValue> {
  evaluate(fact: TFact): Rule<TFact, TValue> | undefined;
}
