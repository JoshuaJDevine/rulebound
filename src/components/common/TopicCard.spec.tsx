/**
 * Tests for TopicCard component
 * Level 1 topic cards with gold left border, expandable, reading mode
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { TopicCard } from "./TopicCard";
import type { RuleSection } from "@/types";

describe("TopicCard", () => {
  const mockTopic: RuleSection = {
    id: "100.1",
    number: "100.1",
    title: "Combat Basics",
    content: "Basic rules for combat encounters.",
    level: 1,
    children: ["100.1.1", "100.1.2"],
    crossRefs: [],
    version: "1.2",
  };

  describe("Rendering", () => {
    it("should render topic number", () => {
      const handleNavigate = vi.fn();
      render(<TopicCard rule={mockTopic} onNavigate={handleNavigate} />);
      expect(screen.getByText("100.1")).toBeInTheDocument();
    });

    it("should render topic title", () => {
      const handleNavigate = vi.fn();
      render(<TopicCard rule={mockTopic} onNavigate={handleNavigate} />);
      expect(screen.getByText("Combat Basics")).toBeInTheDocument();
    });

    it("should render child count (plural)", () => {
      const handleNavigate = vi.fn();
      render(<TopicCard rule={mockTopic} onNavigate={handleNavigate} />);
      expect(screen.getByText("2 rules")).toBeInTheDocument();
    });

    it("should render child count (singular)", () => {
      const handleNavigate = vi.fn();
      const singleChild: RuleSection = { ...mockTopic, children: ["100.1.1"] };
      render(<TopicCard rule={singleChild} onNavigate={handleNavigate} />);
      expect(screen.getByText("1 rule")).toBeInTheDocument();
    });

    it("should render Topic badge", () => {
      const handleNavigate = vi.fn();
      render(<TopicCard rule={mockTopic} onNavigate={handleNavigate} />);
      expect(screen.getByText("Topic")).toBeInTheDocument();
    });

    it("should not show action buttons when no children", () => {
      const handleNavigate = vi.fn();
      const noChildren: RuleSection = { ...mockTopic, children: [] };
      render(<TopicCard rule={noChildren} onNavigate={handleNavigate} />);
      expect(screen.queryByText("Expand")).not.toBeInTheDocument();
      expect(screen.queryByText("Read")).not.toBeInTheDocument();
    });

    it("should display Cinzel font for title", () => {
      const handleNavigate = vi.fn();
      render(<TopicCard rule={mockTopic} onNavigate={handleNavigate} />);
      const title = screen.getByText("Combat Basics");
      expect(title).toHaveClass("font-display");
    });
  });

  describe("Visual Styling", () => {
    it("should have gold left border", () => {
      const handleNavigate = vi.fn();
      const { container } = render(
        <TopicCard rule={mockTopic} onNavigate={handleNavigate} />,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("border-l-4");
      expect(card).toHaveClass("border-l-accent-500");
    });

    it("should have white background in light mode", () => {
      const handleNavigate = vi.fn();
      const { container } = render(
        <TopicCard rule={mockTopic} onNavigate={handleNavigate} />,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("bg-white");
    });

    it("should have hover effects", () => {
      const handleNavigate = vi.fn();
      const { container } = render(
        <TopicCard rule={mockTopic} onNavigate={handleNavigate} />,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("hover:border-l-accent-400");
      expect(card).toHaveClass("hover:shadow-md");
    });

    it("should have transition effects", () => {
      const handleNavigate = vi.fn();
      const { container } = render(
        <TopicCard rule={mockTopic} onNavigate={handleNavigate} />,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("transition-all");
    });
  });

  describe("Interactions", () => {
    it("should call onNavigate when title button is clicked", async () => {
      const user = userEvent.setup();
      const handleNavigate = vi.fn();

      render(<TopicCard rule={mockTopic} onNavigate={handleNavigate} />);

      const titleButton = screen.getByText("Combat Basics").closest("button");
      await user.click(titleButton!);

      expect(handleNavigate).toHaveBeenCalledWith("100.1");
      expect(handleNavigate).toHaveBeenCalledTimes(1);
    });

    it("should call onToggle when expand button is clicked", async () => {
      const user = userEvent.setup();
      const handleNavigate = vi.fn();
      const handleToggle = vi.fn();

      render(
        <TopicCard
          rule={mockTopic}
          onNavigate={handleNavigate}
          onToggle={handleToggle}
        />,
      );

      const expandButton = screen.getByText("Expand");
      await user.click(expandButton);

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleNavigate).not.toHaveBeenCalled();
    });

    it("should call onEnterReadingMode when Read button is clicked", async () => {
      const user = userEvent.setup();
      const handleNavigate = vi.fn();
      const handleReadingMode = vi.fn();

      render(
        <TopicCard
          rule={mockTopic}
          onNavigate={handleNavigate}
          onEnterReadingMode={handleReadingMode}
        />,
      );

      const readButton = screen.getByText("Read");
      await user.click(readButton);

      expect(handleReadingMode).toHaveBeenCalledTimes(1);
      expect(handleNavigate).not.toHaveBeenCalled();
    });

    it("should show Collapse when expanded", () => {
      const handleNavigate = vi.fn();
      const handleToggle = vi.fn();

      render(
        <TopicCard
          rule={mockTopic}
          onNavigate={handleNavigate}
          onToggle={handleToggle}
          expanded={true}
        />,
      );

      expect(screen.getByText("Collapse")).toBeInTheDocument();
      expect(screen.queryByText("Expand")).not.toBeInTheDocument();
    });

    it("should rotate expand icon when expanded", () => {
      const handleNavigate = vi.fn();
      const handleToggle = vi.fn();
      const { container } = render(
        <TopicCard
          rule={mockTopic}
          onNavigate={handleNavigate}
          onToggle={handleToggle}
          expanded={true}
        />,
      );

      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("rotate-180");
    });

    it("should stop event propagation on expand button click", async () => {
      const user = userEvent.setup();
      const handleNavigate = vi.fn();
      const handleToggle = vi.fn();

      render(
        <TopicCard
          rule={mockTopic}
          onNavigate={handleNavigate}
          onToggle={handleToggle}
        />,
      );

      const expandButton = screen.getByText("Expand");
      await user.click(expandButton);

      // Navigate should not be called because event propagation was stopped
      expect(handleNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have focus ring on title button", () => {
      const handleNavigate = vi.fn();
      render(<TopicCard rule={mockTopic} onNavigate={handleNavigate} />);
      const titleButton = screen.getByText("Combat Basics").closest("button");
      expect(titleButton).toHaveClass("focus:ring-2");
      expect(titleButton).toHaveClass("focus:ring-accent-500");
    });

    it("should have focus ring on action buttons", () => {
      const handleNavigate = vi.fn();
      const handleToggle = vi.fn();

      render(
        <TopicCard
          rule={mockTopic}
          onNavigate={handleNavigate}
          onToggle={handleToggle}
        />,
      );

      const expandButton = screen.getByText("Expand");
      expect(expandButton).toHaveClass("focus:ring-2");
      expect(expandButton).toHaveClass("focus:ring-accent-500");
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleNavigate = vi.fn();

      render(<TopicCard rule={mockTopic} onNavigate={handleNavigate} />);

      const titleButton = screen.getByText("Combat Basics").closest("button");
      titleButton!.focus();
      expect(titleButton).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleNavigate).toHaveBeenCalledWith("100.1");
    });

    it("should have no accessibility violations", async () => {
      const handleNavigate = vi.fn();
      const { container } = render(
        <TopicCard rule={mockTopic} onNavigate={handleNavigate} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have proper heading hierarchy", () => {
      const handleNavigate = vi.fn();
      render(<TopicCard rule={mockTopic} onNavigate={handleNavigate} />);
      const heading = screen.getByText("Combat Basics");
      expect(heading.tagName).toBe("H3");
    });
  });

  describe("Edge Cases", () => {
    it("should handle topic with no children gracefully", () => {
      const handleNavigate = vi.fn();
      const noChildren: RuleSection = { ...mockTopic, children: [] };
      render(<TopicCard rule={noChildren} onNavigate={handleNavigate} />);
      expect(screen.getByText("Combat Basics")).toBeInTheDocument();
      expect(screen.queryByText("rules")).not.toBeInTheDocument();
    });

    it("should handle very long titles", () => {
      const handleNavigate = vi.fn();
      const longTitle: RuleSection = {
        ...mockTopic,
        title: "Very Long Topic Title That Might Need Wrapping In The Display",
      };
      render(<TopicCard rule={longTitle} onNavigate={handleNavigate} />);
      expect(
        screen.getByText(
          "Very Long Topic Title That Might Need Wrapping In The Display",
        ),
      ).toBeInTheDocument();
    });

    it("should handle large child counts", () => {
      const handleNavigate = vi.fn();
      const manyChildren: RuleSection = {
        ...mockTopic,
        children: Array.from({ length: 50 }, (_, i) => `100.1.${i}`),
      };
      render(<TopicCard rule={manyChildren} onNavigate={handleNavigate} />);
      expect(screen.getByText("50 rules")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const handleNavigate = vi.fn();
      const { container } = render(
        <TopicCard
          rule={mockTopic}
          onNavigate={handleNavigate}
          className="custom-class"
        />,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("custom-class");
    });

    it("should work without optional callbacks", () => {
      render(<TopicCard rule={mockTopic} />);
      expect(screen.getByText("Combat Basics")).toBeInTheDocument();
    });
  });
});
