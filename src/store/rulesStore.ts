/**
 * Zustand store for rules, bookmarks, and user preferences
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  RulesStore,
  Bookmark,
  UserPreferences,
  SearchResult,
  RuleSection,
  RulesData,
} from "@/types";

const defaultPreferences: UserPreferences = {
  theme: "light",
  fontSize: "medium",
  highContrast: false,
  reducedMotion: false,
  bookmarks: [],
  recentlyViewed: [],
};

export const useRulesStore = create<RulesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      rulesData: null,
      isLoading: false,
      error: null,
      bookmarks: [],
      preferences: defaultPreferences,

      // Computed selectors
      getTopLevelSections: (): RuleSection[] => {
        const { rulesData } = get();
        if (!rulesData) return [];
        return rulesData.sections.filter((rule) => rule.level === 0);
      },

      getRuleById: (id: string): RuleSection | undefined => {
        const { rulesData } = get();
        if (!rulesData) return undefined;
        return rulesData.index[id];
      },

      getChildRules: (id: string): RuleSection[] => {
        const { rulesData, getRuleById } = get();
        if (!rulesData) return [];
        const rule = getRuleById(id);
        if (!rule) return [];
        return rule.children
          .map((childId) => getRuleById(childId))
          .filter((r): r is RuleSection => r !== undefined);
      },

      getReferencedBy: (id: string): RuleSection[] => {
        const { rulesData } = get();
        if (!rulesData) return [];
        return rulesData.sections.filter((rule) => rule.crossRefs.includes(id));
      },

      // Actions
      loadRules: async () => {
        set({ isLoading: true, error: null });
        try {
          // Load rules from static JSON
          const response = await fetch("/data/rules.json");
          if (!response.ok) {
            throw new Error("Failed to load rules");
          }
          const data: RulesData = await response.json();

          // Ensure index is populated if not present
          if (!data.index || Object.keys(data.index).length === 0) {
            data.index = {};
            for (const section of data.sections) {
              data.index[section.id] = section;
            }
          }

          set({
            rulesData: data,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error as Error,
            isLoading: false,
          });
        }
      },

      addBookmark: (ruleId: string, notes?: string) => {
        const { bookmarks } = get();
        if (bookmarks.find((b) => b.ruleId === ruleId)) {
          return; // Already bookmarked
        }
        const newBookmark: Bookmark = {
          ruleId,
          timestamp: Date.now(),
          notes,
        };
        set({ bookmarks: [...bookmarks, newBookmark] });
      },

      removeBookmark: (ruleId: string) => {
        const { bookmarks } = get();
        set({ bookmarks: bookmarks.filter((b) => b.ruleId !== ruleId) });
      },

      updatePreferences: (prefs: Partial<UserPreferences>) => {
        const { preferences } = get();
        set({ preferences: { ...preferences, ...prefs } });
      },

      addToRecentlyViewed: (ruleId: string) => {
        const { preferences } = get();
        const recentlyViewed = preferences.recentlyViewed.filter(
          (id) => id !== ruleId,
        );
        recentlyViewed.unshift(ruleId);
        // Keep only last 10
        const trimmed = recentlyViewed.slice(0, 10);
        set({
          preferences: {
            ...preferences,
            recentlyViewed: trimmed,
          },
        });
      },

      searchRules: (query: string): SearchResult[] => {
        const { rulesData } = get();
        if (!rulesData) return [];

        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) {
          return [];
        }

        const results: SearchResult[] = [];

        for (const rule of rulesData.sections) {
          const matches: SearchResult["matches"] = [];
          let score = 0;

          // Search in rule number (high priority)
          if (rule.number.toLowerCase().includes(lowerQuery)) {
            score += 15;
            const index = rule.number.toLowerCase().indexOf(lowerQuery);
            matches.push({
              field: "number",
              snippet: rule.number,
              position: index,
            });
          }

          // Search in title
          if (rule.title.toLowerCase().includes(lowerQuery)) {
            score += 10;
            const index = rule.title.toLowerCase().indexOf(lowerQuery);
            matches.push({
              field: "title",
              snippet: rule.title,
              position: index,
            });
          }

          // Search in content
          if (rule.content.toLowerCase().includes(lowerQuery)) {
            score += 5;
            const index = rule.content.toLowerCase().indexOf(lowerQuery);
            const start = Math.max(0, index - 50);
            const end = Math.min(
              rule.content.length,
              index + lowerQuery.length + 50,
            );
            const snippet =
              (start > 0 ? "..." : "") +
              rule.content.slice(start, end) +
              (end < rule.content.length ? "..." : "");
            matches.push({
              field: "content",
              snippet,
              position: index,
            });
          }

          if (matches.length > 0) {
            results.push({ rule, score, matches });
          }
        }

        // Sort by score (highest first)
        return results.sort((a, b) => b.score - a.score);
      },
    }),
    {
      name: "rulebound-storage",
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        preferences: state.preferences,
      }),
    },
  ),
);
