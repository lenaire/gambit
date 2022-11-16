import Gambit from "../rules/gambit";
import { Rules } from "../rules/types";

describe("Test Gambit", () => {
  const rules: Rules<any, string | number> = [
    {
      clauses: [
        {
          variable: "title",
          operator: "equals",
          values: "Person",
        },
      ],
      assignment: () => "PersonForm",
    },
    {
      clauses: [
        {
          variable: "properties.productId.description",
          operator: "startsWith",
          values: "The unique",
        },
      ],
      assignment: () => "ProductControl",
    },
    {
      clauses: [
        {
          variable: "$id",
          operator: "contains",
          values: "geographical-location",
        },
      ],
      assignment: () => "GeographicalForm",
    },
    {
      clauses: [
        {
          variable: "properties.age.minimum",
          operator: "greaterThan",
          values: 21,
        },
      ],
      assignment: () => "AgeVerificationElement",
    },
    {
      clauses: [
        {
          variable: "properties.dimensions.properties.length.minimum",
          operator: "greaterThanOrEqualTo",
          values: 100,
        },
      ],
      assignment: (fact: any) => `${fact.$id}-Form`,
    },
    {
      clauses: [
        {
          variable: "properties.dimensions.properties.length.maximum",
          operator: "lessThanOrEqualTo",
          values: 200,
        },
      ],
      assignment: () => "AcmeForm",
    },
    {
      clauses: [
        {
          variable: "properties.lastName.minimum",
          operator: "lessThan",
          values: 40,
        },
      ],
      assignment: () => "NameValidationElement",
    },
  ];

  const gambit = new Gambit(rules);

  const gatedRules: Rules<any, string | number> = [
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
          values: "PROD",
        },
      ],
      gate: "AND",
      assignment: "cacheIsEnabled",
    },
    {
      clauses: [
        {
          variable: "key",
          operator: "contains",
          values: "widget",
        },
        {
          variable: "key",
          operator: "startsWith",
          values: "new",
        },
      ],
      gate: "OR",
      assignment: "newWidgetIsEnabled",
    },
    {
      clauses: [
        {
          variable: "description",
          operator: "equals",
          values:
            "Recommendations link for launching the new product application.",
        },
        {
          variable: "description",
          operator: "equals",
          values: "Products link for launching the new product application.",
        },
      ],
      gate: "XOR",
      assignment: "productLinkIsEnabled",
    },
    {
      clauses: [
        {
          variable: "ttl",
          operator: "lessThanOrEqualTo",
          values: 1668455494814,
        },
        {
          variable: "key",
          operator: "equals",
          values: "recommendations",
        },
      ],
      gate: "NAND",
      assignment: "recommendationsIsDisabled",
    },
  ];

  const gambitGated = new Gambit(gatedRules);

  const randomRules: Rules<any, any> = [
    {
      clauses: [
        {
          variable: "firstName",
          operator: "endsWith",
          values: "Bruce",
        },
      ],
      assignment: "Batman",
    },
    {
      clauses: [
        {
          variable: "identity",
          operator: "strictEquals",
          values: {
            isSuperman: true,
          },
        },
      ],
      assignment: "Cryptonian",
    },
    {
      clauses: [
        {
          variable: "anime.characters",
          operator: "equals",
          values: [["Levi", "Hange", "Eren", "Mikasa", "Armin"]],
        },
      ],
      assignment: "AOT",
    },
    {
      clauses: [
        {
          variable: "count",
          operator: "strictEquals",
          values: 9,
        },
      ],
      assignment: "limit9",
    },
  ];

  const randomGambit = new Gambit(randomRules);

  const otherRules: Rules<any, string | boolean> = [
    {
      clauses: [
        {
          variable: "code",
          operator: "equals",
          values: "Gold",
        },
        {
          variable: "coverageType",
          operator: "equals",
          values: "Vehicle",
        },
      ],
      gate: "XNOR",
      assignment: "discountGoldVehicleEligible",
    },
    {
      clauses: [
        {
          variable: "code",
          operator: "equals",
          values: "Basic",
        },
        {
          variable: "isSafeDriver",
          operator: "equals",
          values: false,
        },
      ],
      gate: "NOR",
      assignment: "safeDriverDiscountEligible",
    },
    {
      clauses: [
        {
          variable: "code",
          operator: "equals",
          values: "Gold",
        },
      ],
      gate: "NOT",
      assignment: "discountDisabled",
    },
  ];

  const otherGatedRules = new Gambit(otherRules);

  it("should return the rule using the equals operator", () => {
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

    expect(result?.assignment?.()).toEqual("PersonForm");
  });

  it("should return the rule using the startsWith operator", () => {
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

    expect(result?.assignment?.()).toEqual("ProductControl");
  });

  it("should return the rule using the contains operator", () => {
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

    expect(result?.assignment?.()).toEqual("GeographicalForm");
  });

  it("should return the rule using the greaterThan operator", () => {
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

    expect(result?.assignment?.()).toEqual("AgeVerificationElement");
  });

  it("should return the rule using the greaterThanOrEqualTo operator", () => {
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

    expect(result?.assignment?.(productSchema)).toEqual(
      "https://example.com/product.schema.json-Form"
    );
  });

  it("should return the rule using the lessThanOrEqualTo operator", () => {
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

    expect(result?.assignment?.()).toEqual("AcmeForm");
  });

  it("should return the rule using the lessThan operator", () => {
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

    expect(result?.assignment?.()).toEqual("NameValidationElement");
  });

  it("should return the rule using the endsWith Operator", () => {
    const customer = {
      firstName: "Mr Bruce",
      lastName: "Wayne",
    };

    const result = randomGambit.evaluate(customer);

    expect(result?.assignment).toEqual("Batman");
  });

  it("should return the rule using strictEquals for an object comparison", () => {
    const customer = {
      firstName: "Clark",
      lastName: "Kent",
      identity: {
        isSuperman: true,
      },
    };

    const result = randomGambit.evaluate(customer);

    expect(result?.assignment).toEqual("Cryptonian");
  });

  it("should return the rule using equals for an array comparison", () => {
    const show = {
      anime: {
        season: 4,
        characters: ["Levi", "Hange", "Eren", "Mikasa", "Armin"],
      },
    };

    const result = randomGambit.evaluate(show);

    expect(result?.assignment).toEqual("AOT");
  });

  it("should return the rule using strictEquals for a number", () => {
    const limits = {
      count: 9,
    };

    const result = randomGambit.evaluate(limits);

    expect(result?.assignment).toEqual("limit9");
  });

  it("should return the rule using the AND gate", () => {
    const environmentToggle = {
      project: "CMS",
      key: "Cache",
      description: "Enable Caching for production",
      environment: "PRODUCTION",
    };

    const result = gambitGated.evaluate(environmentToggle);

    expect(result?.assignment).toEqual("cacheIsEnabled");
  });

  it("should return the rule using the OR gate", () => {
    const environmentToggle = {
      project: "CRM",
      key: "newWidget",
      description:
        "New Widget component.  IT should only be enabled in Local and Dev environments.",
      environment: "Development",
    };

    const result = gambitGated.evaluate(environmentToggle);

    expect(result?.assignment).toEqual("newWidgetIsEnabled");
  });

  it("should return the rule using the XOR gate", () => {
    const environmentToggle = {
      project: "Navigation",
      key: "productFeature",
      description: "Products link for launching the new product application.",
      environment: ["Local", "Development", "Staging", "Preprod"],
    };

    const result = gambitGated.evaluate(environmentToggle);

    expect(result?.assignment).toEqual("productLinkIsEnabled");
  });

  it("should return the rule using the NAND gate", () => {
    const environmentToggle = {
      project: "Product Application",
      key: "recommendations",
      description: "Recommendations Widget",
      environment: ["Development", "Staging", "Preprod"],
      ttl: 1668628440000,
    };

    const result = gambitGated.evaluate(environmentToggle);

    expect(result?.assignment).toEqual("recommendationsIsDisabled");
  });

  it("should return the rule using the NOT gate", () => {
    const coverageType = {
      code: "Basic",
      coverageType: "Vehicle",
    };

    const result = otherGatedRules.evaluate(coverageType);

    expect(result?.assignment).toEqual("discountDisabled");
  });

  it("should return the rule using the NOR gate", () => {
    const coverageType = {
      code: "Silver",
      coverageType: "Vehicle",
      isSafeDriver: true,
    };

    const result = otherGatedRules.evaluate(coverageType);

    expect(result?.assignment).toEqual("safeDriverDiscountEligible");
  });

  it("should return the rule using the XNOR gate", () => {
    const coverageType = {
      code: "Gold",
      coverageType: "Vehicle",
    };

    const result = otherGatedRules.evaluate(coverageType);

    expect(result?.assignment).toEqual("discountGoldVehicleEligible");
  });

  it("should return undefined when no rule is matched", () => {
    const emptyResponse = {};
    const result = gambit.evaluate(emptyResponse);

    expect(result).toBeUndefined();
  });
});
