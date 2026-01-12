/**
 * Tests for cn utility function
 */

import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn utility", () => {
  it("should join multiple class names", () => {
    expect(cn("class1", "class2", "class3")).toBe("class1 class2 class3");
  });

  it("should filter out falsy values", () => {
    expect(cn("class1", false, "class2", null, undefined, "class3")).toBe(
      "class1 class2 class3",
    );
  });

  it("should handle empty input", () => {
    expect(cn()).toBe("");
  });

  it("should handle all falsy values", () => {
    expect(cn(false, null, undefined, "")).toBe("");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn("base", isActive && "active", isDisabled && "disabled")).toBe(
      "base active",
    );
  });

  it("should handle single class name", () => {
    expect(cn("single")).toBe("single");
  });

  it("should preserve duplicate class names", () => {
    // Note: This utility does not deduplicate - that's intentional
    // for performance reasons
    expect(cn("class1", "class1")).toBe("class1 class1");
  });

  it("should handle empty strings", () => {
    expect(cn("class1", "", "class2")).toBe("class1 class2");
  });
});
