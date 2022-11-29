import memoize from "@github/memoize/decorator";
import { IGambit, Proofs, Proof } from "./types";

const deepGetObjectByKey = (entity: any, pathArr: string[]): any => {
  return pathArr.reduce((obj, key) => {
    // if key is an array format []
    if (/[0-9]/.test(key)) {
      const index = key.replace(/[^0-9]/g, "");
      const property = key.replace(/[^a-zA-Z]/g, "");
      return obj?.[property]?.[index];
    }

    return obj?.[key];
  }, entity);
};

export default class Gambit<TFact, TValue> implements IGambit<TFact, TValue> {
  private _proofs: Proofs<TFact, TValue>;

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

  constructor(proofs: Proofs<TFact, TValue>) {
    this._proofs = proofs;
  }

  @memoize()
  evaluate(fact: TFact): Proof<TFact, TValue> | undefined {
    return this._proofs.find((proof) => {
      const clauseResults = proof.statements.map((statement) => {
        // SPLIT THE FIELDS BY . NOTATION TO DETERMINE NESTED PROPERTIES
        const evaluators = { ...this._evaluators };
        const keys = statement.variable.split(".");

        // GET THE VARIABLE FOR THE CURRENT PROOF FROM THE FACT
        const variable = deepGetObjectByKey(fact, keys);

        // ONlY PERFORM EVALUATIONS IF THE VARIABLE EXISTS
        if (variable) {
          if (Array.isArray(statement.value))
            return statement.value.every((value) =>
              evaluators[statement.operator](variable, value)
            );

          return evaluators[statement.operator](variable, statement.value);
        }
        return false;
      });

      if (clauseResults && proof.logicGate) {
        return this._logicGates[proof.logicGate](clauseResults) && proof;
      }

      return clauseResults.every((clause) => clause) && proof;
    });
  }
}
