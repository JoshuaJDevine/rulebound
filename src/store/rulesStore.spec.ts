/**
 * Tests for rulesStore (Zustand store)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useRulesStore } from "./rulesStore";
import type { Rule, Section } from "@/types";

// Mock fetch
global.fetch = vi.fn();

describe("rulesStore", () => {
  const mockRules: Rule[] = [
    {
      id: "rule-1",
      title: "Combat Rule",
      section: "Combat",
      content: "Rules for combat encounters and actions",
      tags: ["combat", "actions"],
      references: ["rule-2"],
      pageNumber: 10,
    },
    {
      id: "rule-2",
      title: "Movement Rule",
      section: "Movement",
      content: "Rules for character movement and positioning",
      tags: ["movement", "positioning"],
      references: ["rule-1"],
      pageNumber: 15,
    },
    {
      id: "rule-3",
      title: "Damage Rule",
      section: "Combat",
      content: "Rules for calculating damage in combat",
      tags: ["combat", "damage"],
      references: [],
      pageNumber: 12,
    },
  ];

  const mockSections: Section[] = [
    {
      id: "combat",
      title: "Combat",
      description: "Combat rules",
      rules: ["rule-1", "rule-3"],
    },
    {
      id: "movement",
      title: "Movement",
      description: "Movement rules",
      rules: ["rule-2"],
    },
  ];

  beforeEach(() => {
    // Reset store before each test
    useRulesStore.setState({
      rules: [],
      sections: [],
      isLoading: false,
      error: null,
      bookmarks: [],
      preferences: {
        theme: "light",
        fontSize: "medium",
        highContrast: false,
        reducedMotion: false,
        bookmarks: [],
        recentlyViewed: [],
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial state", () => {
    it("should have empty rules array", () => {
      const state = useRulesStore.getState();
      expect(state.rules).toEqual([]);
    });

    it("should have empty sections array", () => {
      const state = useRulesStore.getState();
      expect(state.sections).toEqual([]);
    });

    it("should not be loading", () => {
      const state = useRulesStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it("should have no error", () => {
      const state = useRulesStore.getState();
      expect(state.error).toBeNull();
    });

    it("should have empty bookmarks", () => {
      const state = useRulesStore.getState();
      expect(state.bookmarks).toEqual([]);
    });

    it("should have default preferences", () => {
      const state = useRulesStore.getState();
      expect(state.preferences).toEqual({
        theme: "light",
        fontSize: "medium",
        highContrast: false,
        reducedMotion: false,
        bookmarks: [],
        recentlyViewed: [],
      });
    });
  });

  describe("loadRules", () => {
    it("should load rules successfully", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ rules: mockRules, sections: mockSections }),
      } as Response);

      const { loadRules } = useRulesStore.getState();
      await loadRules();

      const state = useRulesStore.getState();
      expect(state.rules).toEqual(mockRules);
      expect(state.sections).toEqual(mockSections);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should set loading state during fetch", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let resolvePromise: (value: any) => void;
      const fetchPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(global.fetch).mockReturnValueOnce(fetchPromise as any);

      const { loadRules } = useRulesStore.getState();
      const loadPromise = loadRules();

      // Check loading state
      expect(useRulesStore.getState().isLoading).toBe(true);

      // Resolve the fetch
      resolvePromise!({
        ok: true,
        json: async () => ({ rules: mockRules, sections: mockSections }),
      });
      await loadPromise;

      expect(useRulesStore.getState().isLoading).toBe(false);
    });

    it("should handle fetch error", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      const { loadRules } = useRulesStore.getState();
      await loadRules();

      const state = useRulesStore.getState();
      expect(state.error).toBeInstanceOf(Error);
      expect(state.isLoading).toBe(false);
    });

    it("should handle network error", async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

      const { loadRules } = useRulesStore.getState();
      await loadRules();

      const state = useRulesStore.getState();
      expect(state.error).toBeInstanceOf(Error);
      expect(state.isLoading).toBe(false);
    });

    it("should handle empty response", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      const { loadRules } = useRulesStore.getState();
      await loadRules();

      const state = useRulesStore.getState();
      expect(state.rules).toEqual([]);
      expect(state.sections).toEqual([]);
    });
  });

  describe("addBookmark", () => {
    it("should add a bookmark", () => {
      const { addBookmark } = useRulesStore.getState();
      addBookmark("rule-1");

      const state = useRulesStore.getState();
      expect(state.bookmarks).toHaveLength(1);
      expect(state.bookmarks[0].ruleId).toBe("rule-1");
      expect(state.bookmarks[0].timestamp).toBeDefined();
    });

    it("should add bookmark with notes", () => {
      const { addBookmark } = useRulesStore.getState();
      addBookmark("rule-1", "Important rule");

      const state = useRulesStore.getState();
      expect(state.bookmarks[0].notes).toBe("Important rule");
    });

    it("should not add duplicate bookmarks", () => {
      const { addBookmark } = useRulesStore.getState();
      addBookmark("rule-1");
      addBookmark("rule-1");

      const state = useRulesStore.getState();
      expect(state.bookmarks).toHaveLength(1);
    });

    it("should add multiple bookmarks", () => {
      const { addBookmark } = useRulesStore.getState();
      addBookmark("rule-1");
      addBookmark("rule-2");
      addBookmark("rule-3");

      const state = useRulesStore.getState();
      expect(state.bookmarks).toHaveLength(3);
    });

    it("should set timestamp when adding bookmark", () => {
      const now = Date.now();
      const { addBookmark } = useRulesStore.getState();
      addBookmark("rule-1");

      const state = useRulesStore.getState();
      expect(state.bookmarks[0].timestamp).toBeGreaterThanOrEqual(now);
    });
  });

  describe("removeBookmark", () => {
    it("should remove a bookmark", () => {
      const { addBookmark, removeBookmark } = useRulesStore.getState();
      addBookmark("rule-1");
      removeBookmark("rule-1");

      const state = useRulesStore.getState();
      expect(state.bookmarks).toHaveLength(0);
    });

    it("should remove only specified bookmark", () => {
      const { addBookmark, removeBookmark } = useRulesStore.getState();
      addBookmark("rule-1");
      addBookmark("rule-2");
      addBookmark("rule-3");
      removeBookmark("rule-2");

      const state = useRulesStore.getState();
      expect(state.bookmarks).toHaveLength(2);
      expect(state.bookmarks.find((b) => b.ruleId === "rule-1")).toBeDefined();
      expect(state.bookmarks.find((b) => b.ruleId === "rule-3")).toBeDefined();
      expect(
        state.bookmarks.find((b) => b.ruleId === "rule-2"),
      ).toBeUndefined();
    });

    it("should handle removing non-existent bookmark", () => {
      const { addBookmark, removeBookmark } = useRulesStore.getState();
      addBookmark("rule-1");
      removeBookmark("rule-999");

      const state = useRulesStore.getState();
      expect(state.bookmarks).toHaveLength(1);
    });
  });

  describe("updatePreferences", () => {
    it("should update single preference", () => {
      const { updatePreferences } = useRulesStore.getState();
      updatePreferences({ theme: "dark" });

      const state = useRulesStore.getState();
      expect(state.preferences.theme).toBe("dark");
    });

    it("should update multiple preferences", () => {
      const { updatePreferences } = useRulesStore.getState();
      updatePreferences({
        theme: "dark",
        fontSize: "large",
        highContrast: true,
      });

      const state = useRulesStore.getState();
      expect(state.preferences.theme).toBe("dark");
      expect(state.preferences.fontSize).toBe("large");
      expect(state.preferences.highContrast).toBe(true);
    });

    it("should preserve other preferences", () => {
      const { updatePreferences } = useRulesStore.getState();
      updatePreferences({ theme: "dark" });

      const state = useRulesStore.getState();
      expect(state.preferences.fontSize).toBe("medium");
      expect(state.preferences.highContrast).toBe(false);
    });
  });

  describe("addToRecentlyViewed", () => {
    it("should add rule to recently viewed", () => {
      const { addToRecentlyViewed } = useRulesStore.getState();
      addToRecentlyViewed("rule-1");

      const state = useRulesStore.getState();
      expect(state.preferences.recentlyViewed).toEqual(["rule-1"]);
    });

    it("should add multiple rules to recently viewed", () => {
      const { addToRecentlyViewed } = useRulesStore.getState();
      addToRecentlyViewed("rule-1");
      addToRecentlyViewed("rule-2");
      addToRecentlyViewed("rule-3");

      const state = useRulesStore.getState();
      expect(state.preferences.recentlyViewed).toEqual([
        "rule-3",
        "rule-2",
        "rule-1",
      ]);
    });

    it("should move existing rule to front", () => {
      const { addToRecentlyViewed } = useRulesStore.getState();
      addToRecentlyViewed("rule-1");
      addToRecentlyViewed("rule-2");
      addToRecentlyViewed("rule-1");

      const state = useRulesStore.getState();
      expect(state.preferences.recentlyViewed).toEqual(["rule-1", "rule-2"]);
    });

    it("should keep only last 10 items", () => {
      const { addToRecentlyViewed } = useRulesStore.getState();
      for (let i = 1; i <= 15; i++) {
        addToRecentlyViewed(`rule-${i}`);
      }

      const state = useRulesStore.getState();
      expect(state.preferences.recentlyViewed).toHaveLength(10);
      expect(state.preferences.recentlyViewed[0]).toBe("rule-15");
      expect(state.preferences.recentlyViewed[9]).toBe("rule-6");
    });
  });

  describe("searchRules", () => {
    beforeEach(() => {
      useRulesStore.setState({ rules: mockRules });
    });

    it("should return empty array for empty query", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("");
      expect(results).toEqual([]);
    });

    it("should search in title", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("Combat");
      expect(results).toHaveLength(2);
      expect(results.some((r) => r.rule.id === "rule-1")).toBe(true);
      expect(results.some((r) => r.rule.id === "rule-3")).toBe(true);
    });

    it("should search in content", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("movement");
      expect(results).toHaveLength(1);
      expect(results[0].rule.id).toBe("rule-2");
    });

    it("should search in tags", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("damage");
      expect(results).toHaveLength(1);
      expect(results[0].rule.id).toBe("rule-3");
    });

    it("should be case insensitive", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("COMBAT");
      expect(results).toHaveLength(2);
    });

    it("should return results sorted by score", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("combat");

      // Title matches score higher than content/tag matches
      expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
    });

    it("should include match information", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("Combat");

      expect(results[0].matches).toBeDefined();
      expect(results[0].matches.length).toBeGreaterThan(0);
      expect(results[0].matches[0].field).toBeDefined();
      expect(results[0].matches[0].snippet).toBeDefined();
    });

    it("should handle special characters in query", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("combat-rule");
      // Should not crash, just return no results
      expect(results).toBeDefined();
    });

    it("should trim whitespace from query", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("  Combat  ");
      expect(results).toHaveLength(2);
    });

    it("should create snippet for content matches", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("encounters");

      expect(results.length).toBeGreaterThan(0);
      const contentMatch = results[0].matches.find(
        (m) => m.field === "content",
      );
      expect(contentMatch?.snippet).toContain("encounters");
    });

    it("should score title matches higher than content matches", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("combat");

      // Rule with "Combat" in title should score higher
      const titleMatch = results.find((r) => r.rule.title.includes("Combat"));
      expect(titleMatch?.score).toBeGreaterThan(5);
    });

    it("should handle query with no matches", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("nonexistent");
      expect(results).toEqual([]);
    });
  });

  describe("Persistence", () => {
    it("should persist bookmarks", () => {
      const { addBookmark } = useRulesStore.getState();
      addBookmark("rule-1");

      // The persist middleware should handle this
      // We can't easily test localStorage in Vitest without additional setup
      // but we can verify the bookmark is in the state
      const state = useRulesStore.getState();
      expect(state.bookmarks).toHaveLength(1);
    });

    it("should persist preferences", () => {
      const { updatePreferences } = useRulesStore.getState();
      updatePreferences({ theme: "dark" });

      const state = useRulesStore.getState();
      expect(state.preferences.theme).toBe("dark");
    });
  });
});
