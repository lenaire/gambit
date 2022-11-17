import memoize from "@github/memoize/decorator";
import { IGambit, Rules, Rule } from "./types";

const deepGetObjectByKey = (entity: any, pathArr: string[]): any => {
  // TODO: handle array?...
  return pathArr.reduce((obj, key) => obj?.[key], entity);
};

export default class Gambit<TFact, TValue> implements IGambit<TFact, TValue> {
  private _rules: Rules<TFact, TValue>;

  private _logicGates = {
    AND: (values: boolean[]) => values.every((val) => val),
    OR: (values: boolean[]) => values.some((val) => val),
    XOR: (values: boolean[]) => {
      const [first, second] = values;
      return first !== second;
    },
    NOT: (values: boolean[]) => {
      const [first] = values;
      return !first;
    },
    NAND: (values: boolean[]) => {
      const [first, second] = values;
      if (first && second) return false;
      return true;
    },
    NOR: (values: boolean[]) => {
      const [first, second] = values;
      return !first && !second;
    },
    XNOR: (values: boolean[]) => {
      if (values.every((val) => val) || values.every((val) => !val))
        return true;

      return false;
    },
  };

  private _evaluators = {
    equals: (variable: TValue, value: TValue): boolean => {
      if (typeof variable === "object")
        return JSON.stringify(variable) == JSON.stringify(value);

      return variable == value;
    },
    strictEquals: (variable: TValue, value: TValue): boolean => {
      if (typeof variable === "object")
        return JSON.stringify(variable) === JSON.stringify(value);

      return variable === value;
    },
    startsWith: (variable: TValue, value: any): boolean => {
      if (typeof variable === "string") return variable?.startsWith(value);

      return false;
    },
    endsWith: (variable: TValue, value: any): boolean => {
      if (typeof variable === "string") return variable?.endsWith(value);

      return false;
    },
    contains: (variable: TValue, value: any): boolean => {
      if (typeof variable === "string" || Array.isArray(variable))
        return variable?.includes(value);

      return false;
    },
    greaterThan: (variable: TValue, value: TValue): boolean => variable > value,
    greaterThanOrEqualTo: (variable: TValue, value: TValue): boolean =>
      variable >= value,
    lessThanOrEqualTo: (variable: TValue, value: TValue): boolean =>
      variable <= value,
    lessThan: (variable: TValue, value: TValue): boolean => variable < value,
  };

  constructor(rules: Rules<TFact, TValue>) {
    this._rules = rules;
  }

  @memoize()
  evaluate(fact: TFact): Rule<TFact, TValue> | undefined {
    return this._rules.find((rule) => {
      const clauseResults = rule.clauses.map((clause) => {
        // SPLIT THE FIELDS BY . NOTATION TO DETERMINE NESTED PROPERTIES
        const evaluators = { ...this._evaluators };
        const keys = clause.variable.split(".");

        // GET THE VARIABLE FOR THE CURRENT RULE FROM THE FACT
        const variable = deepGetObjectByKey(fact, keys);

        // ONlY PERFORM EVALUATIONS IF THE VARIABLE EXISTS
        if (variable) {
          if (Array.isArray(clause.values))
            return clause.values.every((value) =>
              evaluators[clause.operator](variable, value)
            );

          return evaluators[clause.operator](variable, clause.values);
        }
        return false;
      });

      if (clauseResults && rule.gate) {
        return this._logicGates[rule.gate](clauseResults) && rule;
      }

      return clauseResults.every((clause) => clause) && rule;
    });
  }
}
