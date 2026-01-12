/**
 * Tests for BookmarkButton component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { BookmarkButton } from "./BookmarkButton";
import { useRulesStore } from "@/store/rulesStore";

// Mock the store
vi.mock("@/store/rulesStore", () => ({
  useRulesStore: vi.fn(),
}));

describe("BookmarkButton", () => {
  const mockAddBookmark = vi.fn();
  const mockRemoveBookmark = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Default: not bookmarked
    vi.mocked(useRulesStore).mockReturnValue({
      bookmarks: [],
      addBookmark: mockAddBookmark,
      removeBookmark: mockRemoveBookmark,
      rules: [],
      sections: [],
      isLoading: false,
      error: null,
      preferences: {
        theme: "light",
        fontSize: "medium",
        highContrast: false,
        reducedMotion: false,
        bookmarks: [],
        recentlyViewed: [],
      },
      loadRules: vi.fn(),
      updatePreferences: vi.fn(),
      addToRecentlyViewed: vi.fn(),
      searchRules: vi.fn(),
    });
  });

  describe("Rendering", () => {
    it("should render bookmark button", () => {
      render(<BookmarkButton ruleId="rule-1" />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should show unbookmarked state by default", () => {
      render(<BookmarkButton ruleId="rule-1" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Bookmark this rule");
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it("should show bookmarked state when rule is bookmarked", () => {
      vi.mocked(useRulesStore).mockReturnValue({
        bookmarks: [{ ruleId: "rule-1", timestamp: Date.now() }],
        addBookmark: mockAddBookmark,
        removeBookmark: mockRemoveBookmark,
        rules: [],
        sections: [],
        isLoading: false,
        error: null,
        preferences: {
          theme: "light",
          fontSize: "medium",
          highContrast: false,
          reducedMotion: false,
          bookmarks: [],
          recentlyViewed: [],
        },
        loadRules: vi.fn(),
        updatePreferences: vi.fn(),
        addToRecentlyViewed: vi.fn(),
        searchRules: vi.fn(),
      });

      render(<BookmarkButton ruleId="rule-1" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Remove bookmark");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("should render without label by default", () => {
      render(<BookmarkButton ruleId="rule-1" />);
      expect(screen.queryByText("Bookmark")).not.toBeInTheDocument();
    });

    it("should render with label when showLabel is true", () => {
      render(<BookmarkButton ruleId="rule-1" showLabel />);
      expect(screen.getByText("Bookmark")).toBeInTheDocument();
    });

    it('should show "Bookmarked" label when bookmarked', () => {
      vi.mocked(useRulesStore).mockReturnValue({
        bookmarks: [{ ruleId: "rule-1", timestamp: Date.now() }],
        addBookmark: mockAddBookmark,
        removeBookmark: mockRemoveBookmark,
        rules: [],
        sections: [],
        isLoading: false,
        error: null,
        preferences: {
          theme: "light",
          fontSize: "medium",
          highContrast: false,
          reducedMotion: false,
          bookmarks: [],
          recentlyViewed: [],
        },
        loadRules: vi.fn(),
        updatePreferences: vi.fn(),
        addToRecentlyViewed: vi.fn(),
        searchRules: vi.fn(),
      });

      render(<BookmarkButton ruleId="rule-1" showLabel />);
      expect(screen.getByText("Bookmarked")).toBeInTheDocument();
    });
  });

  describe("Sizes", () => {
    it("should render small size", () => {
      render(<BookmarkButton ruleId="rule-1" size="sm" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-11");
      expect(button).toHaveClass("w-11");
    });

    it("should render medium size by default", () => {
      render(<BookmarkButton ruleId="rule-1" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-12");
      expect(button).toHaveClass("w-12");
    });

    it("should render large size", () => {
      render(<BookmarkButton ruleId="rule-1" size="lg" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-14");
      expect(button).toHaveClass("w-14");
    });
  });

  describe("Interactions", () => {
    it("should call addBookmark when clicking unbookmarked button", async () => {
      const user = userEvent.setup();
      render(<BookmarkButton ruleId="rule-1" />);

      await user.click(screen.getByRole("button"));
      expect(mockAddBookmark).toHaveBeenCalledWith("rule-1");
      expect(mockRemoveBookmark).not.toHaveBeenCalled();
    });

    it("should call removeBookmark when clicking bookmarked button", async () => {
      const user = userEvent.setup();
      vi.mocked(useRulesStore).mockReturnValue({
        bookmarks: [{ ruleId: "rule-1", timestamp: Date.now() }],
        addBookmark: mockAddBookmark,
        removeBookmark: mockRemoveBookmark,
        rules: [],
        sections: [],
        isLoading: false,
        error: null,
        preferences: {
          theme: "light",
          fontSize: "medium",
          highContrast: false,
          reducedMotion: false,
          bookmarks: [],
          recentlyViewed: [],
        },
        loadRules: vi.fn(),
        updatePreferences: vi.fn(),
        addToRecentlyViewed: vi.fn(),
        searchRules: vi.fn(),
      });

      render(<BookmarkButton ruleId="rule-1" />);

      await user.click(screen.getByRole("button"));
      expect(mockRemoveBookmark).toHaveBeenCalledWith("rule-1");
      expect(mockAddBookmark).not.toHaveBeenCalled();
    });

    it("should stop event propagation on click", async () => {
      const user = userEvent.setup();
      const handleParentClick = vi.fn();

      render(
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div onClick={handleParentClick}>
          <BookmarkButton ruleId="rule-1" />
        </div>,
      );

      await user.click(screen.getByRole("button"));
      expect(mockAddBookmark).toHaveBeenCalled();
      expect(handleParentClick).not.toHaveBeenCalled();
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      render(<BookmarkButton ruleId="rule-1" />);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(mockAddBookmark).toHaveBeenCalledWith("rule-1");
    });
  });

  describe("Visual states", () => {
    it("should have different color when bookmarked", () => {
      vi.mocked(useRulesStore).mockReturnValue({
        bookmarks: [{ ruleId: "rule-1", timestamp: Date.now() }],
        addBookmark: mockAddBookmark,
        removeBookmark: mockRemoveBookmark,
        rules: [],
        sections: [],
        isLoading: false,
        error: null,
        preferences: {
          theme: "light",
          fontSize: "medium",
          highContrast: false,
          reducedMotion: false,
          bookmarks: [],
          recentlyViewed: [],
        },
        loadRules: vi.fn(),
        updatePreferences: vi.fn(),
        addToRecentlyViewed: vi.fn(),
        searchRules: vi.fn(),
      });

      render(<BookmarkButton ruleId="rule-1" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-primary-600");
    });

    it("should have neutral color when not bookmarked", () => {
      render(<BookmarkButton ruleId="rule-1" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-neutral-400");
    });

    it("should have hover scale effect", () => {
      render(<BookmarkButton ruleId="rule-1" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:scale-110");
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label that describes action", () => {
      render(<BookmarkButton ruleId="rule-1" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Bookmark this rule");
    });

    it("should have aria-pressed attribute", () => {
      render(<BookmarkButton ruleId="rule-1" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed");
    });

    it("should have focus ring styles", () => {
      render(<BookmarkButton ruleId="rule-1" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus:ring-4");
      expect(button).toHaveClass("focus:outline-none");
    });

    it("should have button type", () => {
      render(<BookmarkButton ruleId="rule-1" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("should have no accessibility violations", async () => {
      const { container } = render(<BookmarkButton ruleId="rule-1" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Custom props", () => {
    it("should accept custom className", () => {
      render(<BookmarkButton ruleId="rule-1" className="custom-class" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });
  });
});
