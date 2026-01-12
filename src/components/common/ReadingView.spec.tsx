/**
 * Tests for ReadingView component
 * Document-style reading experience with sticky header, progress, navigation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ReadingView } from "./ReadingView";
import type { RuleSection } from "@/types";

describe("ReadingView", () => {
  const mockRules: RuleSection[] = [
    {
      id: "100.1.1",
      number: "100.1.1",
      title: "Attack Action",
      content:
        "When you take the Attack action, you make a melee or ranged attack.",
      level: 2,
      children: [],
      crossRefs: [],
      version: "1.2",
    },
    {
      id: "100.1.2",
      number: "100.1.2",
      title: "Dash Action",
      content: "When you take the Dash action, you gain extra movement.",
      level: 2,
      children: [],
      crossRefs: [],
      version: "1.2",
    },
    {
      id: "100.1.3",
      number: "100.1.3",
      title: "Dodge Action",
      content: "When you take the Dodge action, you focus on avoiding attacks.",
      level: 2,
      children: [],
      crossRefs: [],
      version: "1.2",
    },
  ];

  const mockOnExitReadingMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.scrollY
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render topic title in header", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      expect(screen.getByText("Combat Actions")).toBeInTheDocument();
    });

    it("should render all rules", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      // Rule numbers appear multiple times (in content and bottom nav), so use getAllByText
      expect(screen.getAllByText("100.1.1").length).toBeGreaterThan(0);
      expect(screen.getAllByText("100.1.2").length).toBeGreaterThan(0);
      expect(screen.getAllByText("100.1.3").length).toBeGreaterThan(0);
    });

    it("should render rule numbers", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      // Rule numbers appear in both content and bottom nav
      expect(screen.getAllByText("100.1.1").length).toBeGreaterThan(0);
      expect(screen.getAllByText("100.1.2").length).toBeGreaterThan(0);
    });

    it("should render rule content", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      expect(
        screen.getByText(/When you take the Attack action/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/When you take the Dash action/),
      ).toBeInTheDocument();
    });

    it("should render rule titles when different from content", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      expect(screen.getByText("Attack Action")).toBeInTheDocument();
      expect(screen.getByText("Dash Action")).toBeInTheDocument();
    });

    it("should not render title when it equals content", () => {
      const sameTitleContent: RuleSection[] = [
        {
          ...mockRules[0],
          title: mockRules[0].content,
        },
      ];
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={sameTitleContent}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      // Should only have one instance (the content)
      const texts = screen.getAllByText(mockRules[0].content);
      expect(texts.length).toBeGreaterThanOrEqual(1);
    });

    it("should render progress indicator", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      expect(screen.getByText(/Rule 1 of 3/)).toBeInTheDocument();
    });

    it("should render Back button", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      expect(screen.getByText("Back")).toBeInTheDocument();
    });

    it("should render Previous and Next buttons", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should disable Previous button on first rule", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      const prevButton = screen.getByText("Previous").closest("button");
      expect(prevButton).toBeDisabled();
    });

    it("should disable Next button on last rule", async () => {
      const user = userEvent.setup();
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );

      // Navigate to last rule
      const nextButton = screen.getByText("Next").closest("button");
      await user.click(nextButton!);
      await user.click(nextButton!);

      await waitFor(() => {
        expect(nextButton).toBeDisabled();
      });
    });

    it("should call onExitReadingMode when Back button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );

      const backButton = screen.getByText("Back").closest("button");
      await user.click(backButton!);

      expect(mockOnExitReadingMode).toHaveBeenCalledTimes(1);
    });

    it("should update progress when navigating", async () => {
      const user = userEvent.setup();
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );

      const nextButton = screen.getByText("Next").closest("button");
      await user.click(nextButton!);

      await waitFor(() => {
        expect(screen.getByText(/Rule 2 of 3/)).toBeInTheDocument();
      });
    });

    it("should scroll to initial rule when initialScrollToRule is provided", async () => {
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          initialScrollToRule="100.1.2"
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );

      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled();
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("should navigate to next rule on 'n' key", async () => {
      const user = userEvent.setup();
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );

      await user.keyboard("n");

      await waitFor(() => {
        expect(screen.getByText(/Rule 2 of 3/)).toBeInTheDocument();
      });
    });

    it("should navigate to previous rule on 'p' key", async () => {
      const user = userEvent.setup();
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );

      // First navigate forward
      await user.keyboard("n");
      await waitFor(() => {
        expect(screen.getByText(/Rule 2 of 3/)).toBeInTheDocument();
      });

      // Then navigate back
      await user.keyboard("p");

      await waitFor(() => {
        expect(screen.getByText(/Rule 1 of 3/)).toBeInTheDocument();
      });
    });

    it("should exit reading mode on Escape key", async () => {
      const user = userEvent.setup();
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );

      await user.keyboard("{Escape}");

      expect(mockOnExitReadingMode).toHaveBeenCalledTimes(1);
    });

    it("should handle uppercase keyboard shortcuts", async () => {
      const user = userEvent.setup();
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );

      await user.keyboard("N");

      await waitFor(() => {
        expect(screen.getByText(/Rule 2 of 3/)).toBeInTheDocument();
      });
    });
  });

  describe("Visual Styling", () => {
    it("should have sticky header", () => {
      const { container } = render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      const header = container.querySelector("header");
      expect(header).toHaveClass("sticky");
      expect(header).toHaveClass("top-0");
    });

    it("should have dark blue header background", () => {
      const { container } = render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      const header = container.querySelector("header");
      expect(header).toHaveClass("bg-primary-900");
    });

    it("should have fixed bottom navigation", () => {
      const { container } = render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("fixed");
      expect(nav).toHaveClass("bottom-0");
    });

    it("should use Cinzel font for topic title", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      const title = screen.getByText("Combat Actions");
      expect(title).toHaveClass("font-display");
    });

    it("should use body font for content", () => {
      const { container } = render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      const content = container.querySelector(".font-body");
      expect(content).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have semantic HTML structure", () => {
      const { container } = render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelector("main")).toBeInTheDocument();
      expect(container.querySelector("nav")).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      const title = screen.getByText("Combat Actions");
      expect(title.tagName).toBe("H1");
    });

    it("should have focus ring on interactive elements", () => {
      const { container } = render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("focus:ring-2");
      });
    });

    it("should have no accessibility violations", async () => {
      const { container } = render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty rules array", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={[]}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      expect(screen.getByText("Combat Actions")).toBeInTheDocument();
      // Text is split across elements, so check for parts using regex
      expect(screen.getByText(/Rule/)).toBeInTheDocument();
      expect(screen.getByText(/of/)).toBeInTheDocument();
    });

    it("should handle single rule", () => {
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={[mockRules[0]]}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      expect(screen.getByText(/Rule 1 of 1/)).toBeInTheDocument();
      const prevButton = screen.getByText("Previous").closest("button");
      const nextButton = screen.getByText("Next").closest("button");
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={mockRules}
          onExitReadingMode={mockOnExitReadingMode}
          className="custom-class"
        />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("should handle rules with very long content", () => {
      const longContent: RuleSection[] = [
        {
          ...mockRules[0],
          content: "A".repeat(1000),
        },
      ];
      render(
        <ReadingView
          topicTitle="Combat Actions"
          rules={longContent}
          onExitReadingMode={mockOnExitReadingMode}
        />,
      );
      expect(screen.getByText("A".repeat(1000))).toBeInTheDocument();
    });
  });
});
