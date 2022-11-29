[![test runner](https://github.com/lenaire/gambit/actions/workflows/test.yml/badge.svg)](https://github.com/lenaire/gambit/actions/workflows/test.yml) [![coverage report](https://github.com/lenaire/gambit/blob/gh-pages/badges.svg)](https://github.com/lenaire/gambit/actions/workflows/create-coverage-badges.yml)

# About Gambit
Gambit is a simple class that implements [Declarative Programming](https://en.wikipedia.org/wiki/Declarative_programming).  Declarative Programming allows abstracting away control flow for stating what outcomes are desired.  The rules contract attempts to follow a more General Purpose Language to offload learning additional terms for development and better conceptualize outcomes.  Gambit utilizes standard programming operators along with [logic gates](https://www.techtarget.com/whatis/definition/logic-gate-AND-OR-XOR-NOT-NAND-NOR-and-XNOR?vgnextfmt=print#xor) for more complex operations.  Preconfigured definitions allows for evaluating operations without long blocks of complex control flow.  This can limit tightly coupled business logic in an application.  If/Else and Case Statements become instructions, focus on resolutions rather than complex business rules.

## Example Use Cases
* [CaC](https://octopus.com/blog/config-as-code-what-is-it-how-is-it-beneficial#:~:text=Config%20as%20Code%20(CaC)%20separates,version%20control%20for%20your%20configuration.) is a concept of storing application configuration along side code
* [Feature toggles](https://medium.com/@wivvlenaire/javascript-a-use-case-for-declarative-programming-7c8092969438)
* Other business logic with complex control flow

## Operators
| Syntax | Description |
| ----------- | ----------- |
| stricEquals | any property === |
| equals | any property == |
| startsWith | string property starts with |
| endsWith | string property ends with |
| contains | array or string property contains any value |
| greaterThan | string or number property > |
| greaterThanOrEqualTo | string or number property >= |
| lessThanOrEqualTo | string or number property <= |
| lessThan | string or number property < |

## Gates
| Syntax | Description | Total Clauses |
| ----------- | ----------- | ----------- |
| AND | The result is true if all clauses are true. | any |
| OR | The Result is true if any clause is true. | any |
| XOR | Acts as an "either/or".  The result true if either clause is true but not both. | 2 |
| NOT | Acts as an inverter.  The result of an individual clause is reversed. | 1 |
| NAND | Acts as an AND followed by a NOT.  The result is false if both clauses are true otherwise it is true. | 2 |
| NOR | Acts as an OR with an inverter.  The result is true if both clauses are false otherwise it is false. | 2 |
| XNOR | Acts as a XOR with an inverter.  The result is true if all clauses are the same otherwise it is false. | any |


## Usage
```
import { Gambit, Rules } from "Gambit";

const rules: Rules<any, string> = [
    {
        clauses: [
            {
                variable: "environment",
                operator: "equals",
                value: "Production"
            }
        ],
        gate: "NOT",
        assignment: "allNonProdFlagsEnabled"
    },
    {
      clauses: [
        {
          variable: "project",
          operator: "equals",
          values: "CMS",
        },
        {
          variable: "key",
          operator: "equals",
          values: "Cache",
        },
        {
          variable: "environment",
          operator: "contains",
          values: "Prod",
        },
      ],
      gate: "AND",
      assignment: "cacheIsEnabled",
    }
];

const gambit = new Gambit(rules);

const getActiveFlags = async (): Promise<string[]> => {  
  let flags: any[] = [];

  await fetch("/featureApi/v1/toggles")
    .then((response) => response.json())
    .then((data) => {
      flags = data;
    });

  return flags.map((flag) => gambit.evaluate(flag)?.assignment);
};
```

## Alternative Imperitive Example
```
const getActiveFlags = async (): Promise<string[]> => {  
  let flags: any[] = [];

  await fetch("/featureApi/v1/toggles")
    .then((response) => response.json())
    .then((data) => {
      flags = data;
    });

    return flags.map(flag => {
        if(!flag.environment === "Production") return "allNonProdFlagsEnabled";

        if(flag.project === "CMS" && flag.key === "Cache" && flag.environment === "Prod") return "cacheIsEnabled";
    });
}
```

Nested properties can be accessed with . notation.
```
const rules = [
    {
        variable: "someObj.someNestedObj.someProperty",
        operator: "lessThanOrEqualTo",
        value: "someValue"
    },
    {
        variable: "someObj.someNestedObj",
        operator: "equals",
        value: { someProperty: "someValue" }
    }
]
```

## Arrays
When working with values, values can accept any value or an array of values.  When comparing an array against another array this should be created as a multidimentional array.

```
const someRule = [
  {
    clauses: [
      {
        variable: "array",
        operator: "equals",
        values: ["foo", "bar"]// this will compare each value in the array with the variable
      }
    ]
  }
]

const otherRule = [
  {
    clauses: [
      {
        variable: "array",
        operator: "equals",
        values: [["foo", "bar"]]// this will the compare the array with the variable
      }
    ]
  }
]
```

Assignments can accept a function with the fact object or any other as a parameter for more complex assignments.  This concept can be abstracted to implement any number of functions or additional properties and DSL ontop of the basic rules evaluation.  Feel free to examine the tests for some realistic and relatively contrived examples of applicable domains.  If you find yourself having to write a lot of complex if statements give Gambit a TRY!

## Installation
Add a scoped registry in your .npmrc
```
@lenaire:registry=https://npm.pkg.github.com
registry=https://registry.npmjs.org
```

Now the package can be installed
```
npm install @lenaire/gambit@1.0.0
```


