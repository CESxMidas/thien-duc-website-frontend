// Cấu hình Jest cho frontend (task →8) — dùng transformer `next/jest` để tự
// nạp next.config.ts + tsconfig paths (@/*), không cần cấu hình babel/ts-jest.
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  // jsdom cho test component; test thuần logic vẫn chạy được trong jsdom.
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // SWC transformer chỉ resolve `@/*` trong import; jest.mock("@/...") cần
  // mapper tường minh (khớp paths trong tsconfig.json).
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Chỉ nhận *.test.* trong src/ và *.spec.ts ở gốc (next.config.spec.ts).
  testMatch: [
    "<rootDir>/src/**/*.test.{ts,tsx}",
    "<rootDir>/*.spec.ts",
  ],
};

export default createJestConfig(config);
