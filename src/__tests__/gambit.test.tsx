import Gambit from "../proofs/gambit";
import { Proofs } from "../proofs/types";

describe("Test Gambit", () => {
  const proofs: Proofs<any, string | number> = [
    {
      statements: [
        {
          variable: "title",
          operator: "equals",
          value: "Person",
        },
      ],
      outcome: () => "PersonForm",
    },
    {
      statements: [
        {
          variable: "properties.productId.description",
          operator: "startsWith",
          value: "The unique",
        },
      ],
      outcome: () => "ProductControl",
    },
    {
      statements: [
        {
          variable: "$id",
          operator: "contains",
          value: "geographical-location",
        },
      ],
      outcome: () => "GeographicalForm",
    },
    {
      statements: [
        {
          variable: "properties.age.minimum",
          operator: "greaterThan",
          value: 21,
        },
      ],
      outcome: () => "AgeVerificationElement",
    },
    {
      statements: [
        {
          variable: "properties.dimensions.properties.length.minimum",
          operator: "greaterThanOrEqualTo",
          value: 100,
        },
      ],
      outcome: (fact: any) => `${fact.$id}-Form`,
    },
    {
      statements: [
        {
          variable: "properties.dimensions.properties.length.maximum",
          operator: "lessThanOrEqualTo",
          value: 200,
        },
      ],
      outcome: () => "AcmeForm",
    },
    {
      statements: [
        {
          variable: "properties.lastName.minimum",
          operator: "lessThan",
          value: 40,
        },
      ],
      outcome: () => "NameValidationElement",
    },
  ];

  const gambit = new Gambit(proofs);

  const gatedProofs: Proofs<any, string | number> = [
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
          value: "PROD",
        },
      ],
      logicGate: "AND",
      outcome: "cacheIsEnabled",
    },
    {
      statements: [
        {
          variable: "key",
          operator: "contains",
          value: "widget",
        },
        {
          variable: "key",
          operator: "startsWith",
          value: "new",
        },
      ],
      logicGate: "OR",
      outcome: "newWidgetIsEnabled",
    },
    {
      statements: [
        {
          variable: "description",
          operator: "equals",
          value:
            "Recommendations link for launching the new product application.",
        },
        {
          variable: "description",
          operator: "equals",
          value: "Products link for launching the new product application.",
        },
      ],
      logicGate: "XOR",
      outcome: "productLinkIsEnabled",
    },
    {
      statements: [
        {
          variable: "ttl",
          operator: "lessThanOrEqualTo",
          value: 1668455494814,
        },
        {
          variable: "key",
          operator: "equals",
          value: "recommendations",
        },
      ],
      logicGate: "NAND",
      outcome: "recommendationsIsDisabled",
    },
  ];

  const gambitGated = new Gambit(gatedProofs);

  const randomProofs: Proofs<any, any> = [
    {
      statements: [
        {
          variable: "firstName",
          operator: "endsWith",
          value: "Bruce",
        },
      ],
      outcome: "Batman",
    },
    {
      statements: [
        {
          variable: "identity",
          operator: "strictEquals",
          value: {
            isSuperman: true,
          },
        },
      ],
      outcome: "Cryptonian",
    },
    {
      statements: [
        {
          variable: "anime.characters",
          operator: "equals",
          value: [["Levi", "Hange", "Eren", "Mikasa", "Armin"]],
        },
      ],
      outcome: "AOT",
    },
    {
      statements: [
        {
          variable: "count",
          operator: "strictEquals",
          value: 9,
        },
      ],
      outcome: "limit9",
    },
  ];

  const randomGambit = new Gambit(randomProofs);

  const otherProofs: Proofs<any, string | boolean> = [
    {
      statements: [
        {
          variable: "code",
          operator: "equals",
          value: "Gold",
        },
        {
          variable: "coverageType",
          operator: "equals",
          value: "Vehicle",
        },
      ],
      logicGate: "XNOR",
      outcome: "discountGoldVehicleEligible",
    },
    {
      statements: [
        {
          variable: "code",
          operator: "equals",
          value: "Basic",
        },
        {
          variable: "isSafeDriver",
          operator: "equals",
          value: false,
        },
      ],
      logicGate: "NOR",
      outcome: "safeDriverDiscountEligible",
    },
    {
      statements: [
        {
          variable: "code",
          operator: "equals",
          value: "Gold",
        },
      ],
      logicGate: "NOT",
      outcome: "discountDisabled",
    },
  ];

  const otherGatedProofs = new Gambit(otherProofs);

  const arrayProofs: Proofs<any, string> = [
    {
      statements: [
        {
          variable: "foo.array[0]",
          operator: "equals",
          value: "1",
        },
      ],
      outcome: "array element located",
    },
    {
      statements: [
        {
          variable: "foo.bar.array[0].property",
          operator: "equals",
          value: "bar",
        },
      ],
      outcome: "array element located",
    },
    {
      statements: [
        {
          variable: "foo.bar.array[1].property",
          operator: "equals",
          value: "foo",
        },
      ],
      outcome: "array element located",
    },
  ];

  const arrayGambit = new Gambit(arrayProofs);

  it("should return the proof using the equals operator", () => {
    const customerSchema = {
      $id: "https://example.com/person.schema.json",
      $schema: "https://json-schema.org/draft/2020-12/schema",
      title: "Person",
      type: "object",
      properties: {
        firstName: {
          type: "string",
          description: "The person's first name.",
        },
        lastName: {
          type: "string",
          description: "The person's last name.",
        },
        age: {
          description:
            "Age in years which must be equal to or greater than zero.",
          type: "integer",
          minimum: 0,
        },
      },
    };

    const result = gambit.evaluate(customerSchema);

    expect(result?.outcome?.()).toEqual("PersonForm");
  });

  it("should return the proof using the startsWith operator", () => {
    const paymentSchema = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://example.com/product.schema.json",
      title: "Product",
      description: "A product from Acme's catalog",
      type: "object",
      properties: {
        productId: {
          description: "The unique identifier for a product",
          type: "integer",
        },
      },
      required: ["productId"],
    };

    const result = gambit.evaluate(paymentSchema);

    expect(result?.outcome?.()).toEqual("ProductControl");
  });

  it("should return the proof using the contains operator", () => {
    const geographicalSchema = {
      $id: "https://example.com/geographical-location.schema.json",
      $schema: "https://json-schema.org/draft/2020-12/schema",
      title: "Longitude and Latitude",
      description:
        "A geographical coordinate on a planet (most commonly Earth).",
      required: ["latitude", "longitude"],
      type: "object",
      properties: {
        latitude: {
          type: "number",
          minimum: -90,
          maximum: 90,
        },
        longitude: {
          type: "number",
          minimum: -180,
          maximum: 180,
        },
      },
    };

    const result = gambit.evaluate(geographicalSchema);

    expect(result?.outcome?.()).toEqual("GeographicalForm");
  });

  it("should return the proof using the greaterThan operator", () => {
    const customerSchema = {
      $id: "https://example.com/person.schema.json",
      $schema: "https://json-schema.org/draft/2020-12/schema",
      title: "Age",
      type: "object",
      properties: {
        age: {
          description:
            "Age in years which must be equal to or greater than zero.",
          type: "integer",
          minimum: 22,
        },
      },
    };

    const result = gambit.evaluate(customerSchema);

    expect(result?.outcome?.()).toEqual("AgeVerificationElement");
  });

  it("should return the proof using the greaterThanOrEqualTo operator", () => {
    const productSchema = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://example.com/product.schema.json",
      title: "Acme Product",
      description: "A product from Acme's catalog",
      type: "object",
      properties: {
        dimensions: {
          type: "object",
          properties: {
            length: {
              type: "number",
              minimum: 100,
            },
          },
        },
      },
    };

    const result = gambit.evaluate(productSchema);

    expect(result?.outcome?.(productSchema)).toEqual(
      "https://example.com/product.schema.json-Form"
    );
  });

  it("should return the proof using the lessThanOrEqualTo operator", () => {
    const productSchema = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://example.com/product.schema.json",
      title: "Dimension",
      description: "A product from Acme's catalog",
      type: "object",
      properties: {
        dimensions: {
          type: "object",
          properties: {
            length: {
              type: "number",
              maximum: 200,
            },
          },
        },
      },
    };

    const result = gambit.evaluate(productSchema);

    expect(result?.outcome?.()).toEqual("AcmeForm");
  });

  it("should return the proof using the lessThan operator", () => {
    const customerSchema = {
      $id: "https://example.com/person.schema.json",
      $schema: "https://json-schema.org/draft/2020-12/schema",
      title: "Lastname",
      type: "object",
      properties: {
        lastName: {
          type: "string",
          description: "The person's last name.",
          minimum: 30,
        },
      },
    };

    const result = gambit.evaluate(customerSchema);

    expect(result?.outcome?.()).toEqual("NameValidationElement");
  });

  it("should return the proof using the endsWith Operator", () => {
    const customer = {
      firstName: "Mr Bruce",
      lastName: "Wayne",
    };

    const result = randomGambit.evaluate(customer);

    expect(result?.outcome).toEqual("Batman");
  });

  it("should return the proof using strictEquals for an object comparison", () => {
    const customer = {
      firstName: "Clark",
      lastName: "Kent",
      identity: {
        isSuperman: true,
      },
    };

    const result = randomGambit.evaluate(customer);

    expect(result?.outcome).toEqual("Cryptonian");
  });

  it("should return the proof using equals for an array comparison", () => {
    const show = {
      anime: {
        season: 4,
        characters: ["Levi", "Hange", "Eren", "Mikasa", "Armin"],
      },
    };

    const result = randomGambit.evaluate(show);

    expect(result?.outcome).toEqual("AOT");
  });

  it("should return the proof using strictEquals for a number", () => {
    const limits = {
      count: 9,
    };

    const result = randomGambit.evaluate(limits);

    expect(result?.outcome).toEqual("limit9");
  });

  it("should return the proof using the AND gate", () => {
    const environmentToggle = {
      project: "CMS",
      key: "Cache",
      description: "Enable Caching for production",
      environment: "PRODUCTION",
    };

    const result = gambitGated.evaluate(environmentToggle);

    expect(result?.outcome).toEqual("cacheIsEnabled");
  });

  it("should return the proof using the OR gate", () => {
    const environmentToggle = {
      project: "CRM",
      key: "newWidget",
      description:
        "New Widget component.  IT should only be enabled in Local and Dev environments.",
      environment: "Development",
    };

    const result = gambitGated.evaluate(environmentToggle);

    expect(result?.outcome).toEqual("newWidgetIsEnabled");
  });

  it("should return the proof using the XOR gate", () => {
    const environmentToggle = {
      project: "Navigation",
      key: "productFeature",
      description: "Products link for launching the new product application.",
      environment: ["Local", "Development", "Staging", "Preprod"],
    };

    const result = gambitGated.evaluate(environmentToggle);

    expect(result?.outcome).toEqual("productLinkIsEnabled");
  });

  it("should return the proof using the NAND gate", () => {
    const environmentToggle = {
      project: "Product Application",
      key: "recommendations",
      description: "Recommendations Widget",
      environment: ["Development", "Staging", "Preprod"],
      ttl: 1668628440000,
    };

    const result = gambitGated.evaluate(environmentToggle);

    expect(result?.outcome).toEqual("recommendationsIsDisabled");
  });

  it("should return the proof using the NOT gate", () => {
    const coverageType = {
      code: "Basic",
      coverageType: "Vehicle",
    };

    const result = otherGatedProofs.evaluate(coverageType);

    expect(result?.outcome).toEqual("discountDisabled");
  });

  it("should return the proof using the NOR gate", () => {
    const coverageType = {
      code: "Silver",
      coverageType: "Vehicle",
      isSafeDriver: true,
    };

    const result = otherGatedProofs.evaluate(coverageType);

    expect(result?.outcome).toEqual("safeDriverDiscountEligible");
  });

  it("should return the proof using the XNOR gate", () => {
    const coverageType = {
      code: "Gold",
      coverageType: "Vehicle",
    };

    const result = otherGatedProofs.evaluate(coverageType);

    expect(result?.outcome).toEqual("discountGoldVehicleEligible");
  });

  it("should return undefined when no proof is matched", () => {
    const emptyResponse = {};
    const result = gambit.evaluate(emptyResponse);

    expect(result).toBeUndefined();
  });

  it("should test searching array indexes", () => {
    const arrayTest = {
      foo: {
        array: [1],
      },
    };
    const result = arrayGambit.evaluate(arrayTest);

    expect(result?.outcome).toEqual("array element located");
  });

  it("should test searching array indexes returning an object value", () => {
    const arrayTest = {
      foo: {
        bar: {
          array: [{ property: "bar" }],
        },
      },
    };
    const result = arrayGambit.evaluate(arrayTest);

    expect(result?.outcome).toEqual("array element located");
  });

  it("should test searching multiple array indexes returning an object value", () => {
    const arrayTest = {
      foo: {
        bar: {
          array: [{ property: "bar" }, { property: "foo" }],
        },
      },
    };
    const result = arrayGambit.evaluate(arrayTest);

    expect(result?.outcome).toEqual("array element located");
  });

  it("should return null if the array element doesn't exist for the given index", () => {
    const arrayTest = {
      foo: {
        bar: {
          array: [{ bar: 1 }],
        },
      },
    };
    const result = arrayGambit.evaluate(arrayTest);

    expect(result).toBeUndefined();
  });
});
