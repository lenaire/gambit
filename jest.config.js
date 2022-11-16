module.exports = {
    preset: "ts-jest",
    verbose: true,    
    collectCoverageFrom: ["src/**/*.ts"],
    coverageReporters: ["lcov", "json", "text", "json-summary"],
    coverageThreshold: {
      global: {
        lines: 80,
        functions: 70,
      },
    },
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "src/index.ts",
    ],
    globals: {
      "ts-jest": {
        compiler: "ttypescript",
      },
    } 
  };
  