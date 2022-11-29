[![test runner](https://github.com/lenaire/gambit/actions/workflows/test.yml/badge.svg)](https://github.com/lenaire/gambit/actions/workflows/test.yml) [![coverage report](https://github.com/lenaire/gambit/blob/gh-pages/badges.svg)](https://github.com/lenaire/gambit/actions/workflows/create-coverage-badges.yml)

# About Gambit
Gambit is a simple class that implements [Declarative Programming](https://en.wikipedia.org/wiki/Declarative_programming).  Declarative programming allows abstracting away control flow for stating what outcomes are desired.  The proofs contract attempts to follow a more general purpose language to offload learning additional terms (DSL) for development and better conceptualize outcomes.  Gambit utilizes standard programming operators along with [logic gates](https://www.techtarget.com/whatis/definition/logic-gate-AND-OR-XOR-NOT-NAND-NOR-and-XNOR?vgnextfmt=print#xor) for more complex operations.  Preconfigured definitions allows for evaluating operations without long blocks of complex control flow.  This can limit tightly coupled business logic in an application.  If/Else and Case Statements become instructions, focus on resolutions rather than complex business rules.

## Example Use Cases
*  [CaC](https://octopus.com/blog/config-as-code-what-is-it-how-is-it-beneficial#:~:text=Config%20as%20Code%20(CaC)%20separates,version%20control%20for%20your%20configuration.) requiring complex control flow logic
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
| Syntax | Description | Total Statements |
| ----------- | ----------- | ----------- |
| AND | The result is true if all statements are true. | any |
| OR | The Result is true if any statement is true. | any |
| XOR | Acts as an "either/or".  The result true if either statement is true but not both. | 2 |
| NOT | Acts as an inverter.  The result of an individual statement is reversed. | 1 |
| NAND | Acts as an AND followed by a NOT.  The result is false if both statements are true otherwise it is true. | 2 |
| NOR | Acts as an OR with an inverter.  The result is true if both statements are false otherwise it is false.  |2 |
| XNOR | Acts as a XOR with an inverter.  The result is true if all statements are the same otherwise it is false. | any |


## Usage
```
import { Gambit, Proofs } from "Gambit";

const proofs: Proofs<any, string> = [
    {
        statements: [
            {
                variable: "environment",
                operator: "equals",
                value: "Production"
            }
        ],
        logicGate: "NOT",
        outcome: "allNonProdFlagsEnabled"
    },
    {
      statements: [
        {
          variable: "project",
          operator: "equals",
          value: "CMS",
        },
        {
          variable: "key",
          operator: "equals",
          value: "Cache",
        },
        {
          variable: "environment",
          operator: "contains",
          value: "Prod",
        },
      ],
      logicGate: "AND",
      outcome: "cacheIsEnabled",
    }
];

const gambit = new Gambit(proofs);

const getActiveFlags = async (): Promise<string[]> => {  
  let flags: any[] = [];

  await fetch("/featureApi/v1/toggles")
    .then((response) => response.json())
    .then((data) => {
      flags = data;
    });

  return flags.map((flag) => gambit.evaluate(flag)?.outcome);
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
const proofs = [
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
Array propertes can also be accessed with the standard format.
```
const proofs = [
    {
        variable: "someObj.someProperty.someArray[0]",
        operator: "lessThanOrEqualTo",
        value: "someValue"
    },
    {
        variable: "someOtherObject.someProperty.someArray[1].someProperty",
        operator: "equals",
        value: { someProperty: "someValue" }
    }
]
```

When working with value, value can accept any value or an array of values.  When comparing an array against another array this should be created as a multidimentional array.

```
const someProof = [
  {
    statements: [
      {
        variable: "array",
        operator: "equals",
        value: ["foo", "bar"]// this will compare each value in the array with the variable
      }
    ]
  }
]

const otherProof = [
  {
    statements: [
      {
        variable: "array",
        operator: "equals",
        value: [["foo", "bar"]]// this will the compare the array with the variable
      }
    ]
  }
]
```

Outcomes can accept a function with the fact object or any other as a parameter for more complex outcomes.  This concept can be abstracted to implement any number of functions or additional properties and DSL ontop of the basic proofs evaluation.  Feel free to examine the tests for some realistic and relatively contrived examples of applicable domains.  If you find yourself having to write a lot of complex if statements give Gambit a TRY!

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


