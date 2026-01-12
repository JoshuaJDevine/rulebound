/**
 * Core type definitions for Rule Bound application
 */

// Rule represents a single rule from the Riftbound Core Rules
export interface Rule {
  id: string; // Unique identifier
  title: string; // Rule title
  section: string; // Major section (e.g., "Combat", "Character Creation")
  subsection?: string; // Optional subsection
  content: string; // Rule text content (markdown)
  tags: string[]; // Searchable tags
  references: string[]; // IDs of related rules
  pageNumber?: number; // PDF page reference
}

// Section groups rules hierarchically
export interface Section {
  id: string;
  title: string;
  description: string;
  icon?: string; // Icon identifier for UI
  rules: string[]; // Array of rule IDs
  subsections?: Section[]; // Nested sections
}

// Bookmark represents a user's saved rule
export interface Bookmark {
  ruleId: string;
  timestamp: number; // When bookmarked
  notes?: string; // Optional user notes
}

// User preferences
export interface UserPreferences {
  theme: "light" | "dark";
  fontSize: "small" | "medium" | "large";
  highContrast: boolean;
  reducedMotion: boolean;
  bookmarks: Bookmark[];
  recentlyViewed: string[]; // Rule IDs, most recent first
}

// Search result
export interface SearchResult {
  rule: Rule;
  score: number; // Relevance score
  matches: SearchMatch[]; // Where the search term matched
}

export interface SearchMatch {
  field: "title" | "content" | "tags";
  snippet: string; // Text snippet with match
  position: number; // Character position
}

// RuleSection represents a parsed rule from the Riftbound Core Rules TXT file
export interface RuleSection {
  id: string; // Unique identifier (e.g., "000", "103.1.b.2")
  number: string; // Original rule number (e.g., "000.", "103.1.b.2.")
  title: string; // Extracted heading text
  content: string; // Full text content
  level: number; // 0=section, 1=rule, 2=detail, 3=sub-detail, etc.
  parentId?: string; // Reference to parent rule ID
  children: string[]; // IDs of child rules
  crossRefs: string[]; // IDs of referenced rules
  version: string; // Version number (e.g., "1.2")
}

// RulesData represents the parsed rules data structure
export interface RulesData {
  version: string;
  lastUpdated: string;
  sections: RuleSection[];
  index: Record<string, RuleSection>; // Fast lookup by ID
}

// VersionDiff represents changes between two rule versions
export interface VersionDiff {
  oldVersion: string;
  newVersion: string;
  changes: {
    added: string[]; // New rule IDs
    modified: string[]; // Changed rule IDs
    removed: string[]; // Deleted rule IDs
  };
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
