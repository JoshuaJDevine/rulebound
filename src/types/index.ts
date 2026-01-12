/**
 * Core type definitions for Rule Bound application
 */

// Rule represents a single rule from the Riftbound Core Rules
export interface Rule {
  id: string;                    // Unique identifier
  title: string;                 // Rule title
  section: string;               // Major section (e.g., "Combat", "Character Creation")
  subsection?: string;           // Optional subsection
  content: string;               // Rule text content (markdown)
  tags: string[];                // Searchable tags
  references: string[];          // IDs of related rules
  pageNumber?: number;           // PDF page reference
}

// Section groups rules hierarchically
export interface Section {
  id: string;
  title: string;
  description: string;
  icon?: string;                 // Icon identifier for UI
  rules: string[];               // Array of rule IDs
  subsections?: Section[];       // Nested sections
}

// Bookmark represents a user's saved rule
export interface Bookmark {
  ruleId: string;
  timestamp: number;             // When bookmarked
  notes?: string;                // Optional user notes
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reducedMotion: boolean;
  bookmarks: Bookmark[];
  recentlyViewed: string[];      // Rule IDs, most recent first
}

// Search result
export interface SearchResult {
  rule: Rule;
  score: number;                 // Relevance score
  matches: SearchMatch[];        // Where the search term matched
}

export interface SearchMatch {
  field: 'title' | 'content' | 'tags';
  snippet: string;               // Text snippet with match
  position: number;              // Character position
}

// Zustand store state interface
export interface RulesStore {
  // Rules data
  rules: Rule[];
  sections: Section[];
  isLoading: boolean;
  error: Error | null;
  
  // User data
  bookmarks: Bookmark[];
  preferences: UserPreferences;
  
  // Actions
  loadRules: () => Promise<void>;
  addBookmark: (ruleId: string, notes?: string) => void;
  removeBookmark: (ruleId: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addToRecentlyViewed: (ruleId: string) => void;
  searchRules: (query: string) => SearchResult[];
}
