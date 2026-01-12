/**
 * Test setup for Vitest
 */

import "@testing-library/jest-dom/vitest";
import { afterEach, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "vitest-axe/matchers";
import type { AxeMatchers } from "vitest-axe/matchers";

// Extend Vitest expect with axe matchers
expect.extend(matchers);

// Type augmentation for vitest-axe matchers
declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion extends AxeMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

afterEach(() => {
  cleanup();
});
