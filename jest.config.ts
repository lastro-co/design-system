import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  setupFiles: ["<rootDir>/jest.polyfills.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  globals: {
    "process.env.NODE_ENV": "test",
  },
  moduleNameMapper: {
    "^@/tests/(.*)$": "<rootDir>/src/tests/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^maplibre-gl$": "<rootDir>/__mocks__/maplibre-gl.ts",
    "^maplibre-gl/dist/maplibre-gl\\.css$": "<rootDir>/__mocks__/styleMock.ts",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.ts",
  },
  transform: {
    "^.+\\.[jt]sx?$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!(jose|openid-client)/)"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "json", "json-summary"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/__mocks__/**",
    "!src/**/*.stories.{ts,tsx}",
    "!src/tests/**",
  ],
  verbose: true,
};

export default config;
