/**
 * Zustand store for rules, bookmarks, and user preferences
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RulesStore, Bookmark, UserPreferences, SearchResult } from '@/types';

const defaultPreferences: UserPreferences = {
  theme: 'light',
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  bookmarks: [],
  recentlyViewed: [],
};

export const useRulesStore = create<RulesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      rules: [],
      sections: [],
      isLoading: false,
      error: null,
      bookmarks: [],
      preferences: defaultPreferences,

      // Actions
      loadRules: async () => {
        set({ isLoading: true, error: null });
        try {
          // Load rules from static JSON
          const response = await fetch('/data/rules.json');
          if (!response.ok) {
            throw new Error('Failed to load rules');
          }
          const data = await response.json();
          set({ 
            rules: data.rules || [], 
            sections: data.sections || [],
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error as Error, 
            isLoading: false 
          });
        }
      },

      addBookmark: (ruleId: string, notes?: string) => {
        const { bookmarks } = get();
        if (bookmarks.find(b => b.ruleId === ruleId)) {
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
        set({ bookmarks: bookmarks.filter(b => b.ruleId !== ruleId) });
      },

      updatePreferences: (prefs: Partial<UserPreferences>) => {
        const { preferences } = get();
        set({ preferences: { ...preferences, ...prefs } });
      },

      addToRecentlyViewed: (ruleId: string) => {
        const { preferences } = get();
        const recentlyViewed = preferences.recentlyViewed.filter(id => id !== ruleId);
        recentlyViewed.unshift(ruleId);
        // Keep only last 10
        const trimmed = recentlyViewed.slice(0, 10);
        set({ 
          preferences: { 
            ...preferences, 
            recentlyViewed: trimmed 
          } 
        });
      },

      searchRules: (query: string): SearchResult[] => {
        const { rules } = get();
        const lowerQuery = query.toLowerCase().trim();
        
        if (!lowerQuery) {
          return [];
        }

        const results: SearchResult[] = [];

        for (const rule of rules) {
          const matches: SearchResult['matches'] = [];
          let score = 0;

          // Search in title
          if (rule.title.toLowerCase().includes(lowerQuery)) {
            score += 10;
            const index = rule.title.toLowerCase().indexOf(lowerQuery);
            matches.push({
              field: 'title',
              snippet: rule.title,
              position: index,
            });
          }

          // Search in content
          if (rule.content.toLowerCase().includes(lowerQuery)) {
            score += 5;
            const index = rule.content.toLowerCase().indexOf(lowerQuery);
            const start = Math.max(0, index - 50);
            const end = Math.min(rule.content.length, index + lowerQuery.length + 50);
            const snippet = (start > 0 ? '...' : '') + 
                          rule.content.slice(start, end) + 
                          (end < rule.content.length ? '...' : '');
            matches.push({
              field: 'content',
              snippet,
              position: index,
            });
          }

          // Search in tags
          for (const tag of rule.tags) {
            if (tag.toLowerCase().includes(lowerQuery)) {
              score += 3;
              matches.push({
                field: 'tags',
                snippet: tag,
                position: 0,
              });
            }
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
      name: 'rulebound-storage',
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        preferences: state.preferences,
      }),
    }
  )
);
