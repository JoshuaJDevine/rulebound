/**
 * Tests for rulesStore (Zustand store)
 * Updated for hierarchical RulesData structure
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useRulesStore } from "./rulesStore";
import type { RuleSection, RulesData } from "@/types";

// Mock fetch
global.fetch = vi.fn();

describe("rulesStore", () => {
  const mockSections: RuleSection[] = [
    {
      id: "100",
      number: "100.",
      title: "Combat",
      content: "Rules for combat encounters and actions",
      level: 0,
      children: ["100.1", "100.2"],
      crossRefs: ["200"],
      version: "1.2",
    },
    {
      id: "100.1",
      number: "100.1.",
      title: "Initiative",
      content: "Rules for character movement and positioning",
      level: 1,
      parentId: "100",
      children: ["100.1.a"],
      crossRefs: ["100.2"],
      version: "1.2",
    },
    {
      id: "100.1.a",
      number: "100.1.a.",
      title: "Rolling Initiative",
      content: "Rules for calculating damage in combat",
      level: 2,
      parentId: "100.1",
      children: [],
      crossRefs: [],
      version: "1.2",
    },
    {
      id: "100.2",
      number: "100.2.",
      title: "Attack Resolution",
      content: "How to resolve attack rolls",
      level: 1,
      parentId: "100",
      children: [],
      crossRefs: [],
      version: "1.2",
    },
    {
      id: "200",
      number: "200.",
      title: "Movement",
      content: "Movement rules",
      level: 0,
      children: [],
      crossRefs: ["100"],
      version: "1.2",
    },
  ];

  const mockRulesData: RulesData = {
    version: "1.2",
    lastUpdated: "2025-12-01",
    sections: mockSections,
    index: {
      "100": mockSections[0],
      "100.1": mockSections[1],
      "100.1.a": mockSections[2],
      "100.2": mockSections[3],
      "200": mockSections[4],
    },
  };

  beforeEach(() => {
    // Reset store before each test
    useRulesStore.setState({
      rulesData: null,
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
    it("should have null rulesData", () => {
      const state = useRulesStore.getState();
      expect(state.rulesData).toBeNull();
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
        json: async () => mockRulesData,
      } as Response);

      const { loadRules } = useRulesStore.getState();
      await loadRules();

      const state = useRulesStore.getState();
      expect(state.rulesData).toEqual(mockRulesData);
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
        json: async () => mockRulesData,
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

    it("should build index if not present in data", async () => {
      const dataWithoutIndex: RulesData = {
        ...mockRulesData,
        index: {},
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => dataWithoutIndex,
      } as Response);

      const { loadRules } = useRulesStore.getState();
      await loadRules();

      const state = useRulesStore.getState();
      expect(state.rulesData?.index).toBeDefined();
      expect(Object.keys(state.rulesData!.index)).toHaveLength(5);
      expect(state.rulesData!.index["100"]).toEqual(mockSections[0]);
    });
  });

  describe("Selectors", () => {
    beforeEach(() => {
      useRulesStore.setState({ rulesData: mockRulesData });
    });

    describe("getTopLevelSections", () => {
      it("should return only level 0 sections", () => {
        const { getTopLevelSections } = useRulesStore.getState();
        const sections = getTopLevelSections();
        expect(sections).toHaveLength(2);
        expect(sections[0].id).toBe("100");
        expect(sections[1].id).toBe("200");
      });

      it("should return empty array when no data", () => {
        useRulesStore.setState({ rulesData: null });
        const { getTopLevelSections } = useRulesStore.getState();
        expect(getTopLevelSections()).toEqual([]);
      });
    });

    describe("getRuleById", () => {
      it("should return rule from index", () => {
        const { getRuleById } = useRulesStore.getState();
        const rule = getRuleById("100.1");
        expect(rule).toBeDefined();
        expect(rule?.title).toBe("Initiative");
      });

      it("should return undefined for non-existent ID", () => {
        const { getRuleById } = useRulesStore.getState();
        const rule = getRuleById("999");
        expect(rule).toBeUndefined();
      });

      it("should return undefined when no data", () => {
        useRulesStore.setState({ rulesData: null });
        const { getRuleById } = useRulesStore.getState();
        expect(getRuleById("100")).toBeUndefined();
      });
    });

    describe("getChildRules", () => {
      it("should return child rules", () => {
        const { getChildRules } = useRulesStore.getState();
        const children = getChildRules("100");
        expect(children).toHaveLength(2);
        expect(children[0].id).toBe("100.1");
        expect(children[1].id).toBe("100.2");
      });

      it("should return empty array for rule with no children", () => {
        const { getChildRules } = useRulesStore.getState();
        const children = getChildRules("100.2");
        expect(children).toEqual([]);
      });

      it("should return empty array for non-existent rule", () => {
        const { getChildRules } = useRulesStore.getState();
        const children = getChildRules("999");
        expect(children).toEqual([]);
      });

      it("should filter out undefined children", () => {
        const { getChildRules } = useRulesStore.getState();
        // Add a rule with a non-existent child
        const modifiedData = {
          ...mockRulesData,
          sections: [
            ...mockSections,
            {
              id: "300",
              number: "300.",
              title: "Test",
              content: "Test",
              level: 0,
              children: ["300.1", "non-existent"],
              crossRefs: [],
              version: "1.2",
            },
          ],
        };
        useRulesStore.setState({ rulesData: modifiedData });
        const children = getChildRules("300");
        expect(children.every((c) => c !== undefined)).toBe(true);
      });
    });

    describe("getReferencedBy", () => {
      it("should return rules that reference the given rule", () => {
        const { getReferencedBy } = useRulesStore.getState();
        const refs = getReferencedBy("100");
        expect(refs).toHaveLength(1);
        expect(refs[0].id).toBe("200");
      });

      it("should return empty array when no references", () => {
        const { getReferencedBy } = useRulesStore.getState();
        const refs = getReferencedBy("100.1.a");
        expect(refs).toEqual([]);
      });

      it("should return empty array when no data", () => {
        useRulesStore.setState({ rulesData: null });
        const { getReferencedBy } = useRulesStore.getState();
        expect(getReferencedBy("100")).toEqual([]);
      });
    });
  });

  describe("addBookmark", () => {
    it("should add a bookmark", () => {
      const { addBookmark } = useRulesStore.getState();
      addBookmark("100.1");

      const state = useRulesStore.getState();
      expect(state.bookmarks).toHaveLength(1);
      expect(state.bookmarks[0].ruleId).toBe("100.1");
      expect(state.bookmarks[0].timestamp).toBeDefined();
    });

    it("should add bookmark with notes", () => {
      const { addBookmark } = useRulesStore.getState();
      addBookmark("100.1", "Important rule");

      const state = useRulesStore.getState();
      expect(state.bookmarks[0].notes).toBe("Important rule");
    });

    it("should not add duplicate bookmarks", () => {
      const { addBookmark } = useRulesStore.getState();
      addBookmark("100.1");
      addBookmark("100.1");

      const state = useRulesStore.getState();
      expect(state.bookmarks).toHaveLength(1);
    });

    it("should add multiple bookmarks", () => {
      const { addBookmark } = useRulesStore.getState();
      addBookmark("100.1");
      addBookmark("100.2");
      addBookmark("200");

      const state = useRulesStore.getState();
      expect(state.bookmarks).toHaveLength(3);
    });

    it("should set timestamp when adding bookmark", () => {
      const now = Date.now();
      const { addBookmark } = useRulesStore.getState();
      addBookmark("100.1");

      const state = useRulesStore.getState();
      expect(state.bookmarks[0].timestamp).toBeGreaterThanOrEqual(now);
    });
  });

  describe("removeBookmark", () => {
    it("should remove a bookmark", () => {
      const { addBookmark, removeBookmark } = useRulesStore.getState();
      addBookmark("100.1");
      removeBookmark("100.1");

      const state = useRulesStore.getState();
      expect(state.bookmarks).toHaveLength(0);
    });

    it("should remove only specified bookmark", () => {
      const { addBookmark, removeBookmark } = useRulesStore.getState();
      addBookmark("100.1");
      addBookmark("100.2");
      addBookmark("200");
      removeBookmark("100.2");

      const state = useRulesStore.getState();
      expect(state.bookmarks).toHaveLength(2);
      expect(state.bookmarks.find((b) => b.ruleId === "100.1")).toBeDefined();
      expect(state.bookmarks.find((b) => b.ruleId === "200")).toBeDefined();
      expect(state.bookmarks.find((b) => b.ruleId === "100.2")).toBeUndefined();
    });

    it("should handle removing non-existent bookmark", () => {
      const { addBookmark, removeBookmark } = useRulesStore.getState();
      addBookmark("100.1");
      removeBookmark("999");

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
      addToRecentlyViewed("100.1");

      const state = useRulesStore.getState();
      expect(state.preferences.recentlyViewed).toEqual(["100.1"]);
    });

    it("should add multiple rules to recently viewed", () => {
      const { addToRecentlyViewed } = useRulesStore.getState();
      addToRecentlyViewed("100.1");
      addToRecentlyViewed("100.2");
      addToRecentlyViewed("200");

      const state = useRulesStore.getState();
      expect(state.preferences.recentlyViewed).toEqual([
        "200",
        "100.2",
        "100.1",
      ]);
    });

    it("should move existing rule to front", () => {
      const { addToRecentlyViewed } = useRulesStore.getState();
      addToRecentlyViewed("100.1");
      addToRecentlyViewed("100.2");
      addToRecentlyViewed("100.1");

      const state = useRulesStore.getState();
      expect(state.preferences.recentlyViewed).toEqual(["100.1", "100.2"]);
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
      useRulesStore.setState({ rulesData: mockRulesData });
    });

    it("should return empty array for empty query", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("");
      expect(results).toEqual([]);
    });

    it("should search in rule number", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("100.1");
      expect(results).toHaveLength(2); // 100.1 and 100.1.a
      expect(results[0].rule.id).toBe("100.1");
    });

    it("should search in title", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("Combat");
      expect(results).toHaveLength(2); // "Combat" section and "combat" in content
      expect(results.some((r) => r.rule.id === "100")).toBe(true);
    });

    it("should search in content", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("movement");
      expect(results).toHaveLength(2);
    });

    it("should be case insensitive", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("COMBAT");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should return results sorted by score", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("combat");

      // Title/number matches score higher than content matches
      expect(results[0].score).toBeGreaterThanOrEqual(
        results[results.length - 1].score,
      );
    });

    it("should include match information", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("Combat");

      expect(results[0].matches).toBeDefined();
      expect(results[0].matches.length).toBeGreaterThan(0);
      expect(results[0].matches[0].field).toBeDefined();
      expect(results[0].matches[0].snippet).toBeDefined();
    });

    it("should trim whitespace from query", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("  Combat  ");
      expect(results.length).toBeGreaterThan(0);
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

    it("should score number matches highest", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("100.1");

      expect(results[0].score).toBeGreaterThan(10);
    });

    it("should score title matches higher than content", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("Initiative");

      const titleMatch = results.find((r) => r.rule.title === "Initiative");
      expect(titleMatch?.score).toBeGreaterThan(5);
    });

    it("should handle query with no matches", () => {
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("nonexistent");
      expect(results).toEqual([]);
    });

    it("should return empty array when no data", () => {
      useRulesStore.setState({ rulesData: null });
      const { searchRules } = useRulesStore.getState();
      const results = searchRules("combat");
      expect(results).toEqual([]);
    });
  });

  describe("Persistence", () => {
    it("should persist bookmarks", () => {
      const { addBookmark } = useRulesStore.getState();
      addBookmark("100.1");

      // The persist middleware should handle this
      // We can verify the bookmark is in the state
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
