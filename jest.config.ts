import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverageFrom: ["src/**/*.ts"],
  preset: "ts-jest",
  testTimeout: 30000,
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testMatch: ["**/*.test.ts"],
};

export default config;
