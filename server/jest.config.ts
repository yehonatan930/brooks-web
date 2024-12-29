import type { Config } from "jest";
// import dotenv from "dotenv";
// dotenv.config();

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
  testMatch: ["**/*.test.ts"],
};

export default config;
