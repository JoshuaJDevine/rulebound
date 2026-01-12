/**
 * Tests for RuleCard component
 * Updated for hierarchical RuleSection data model
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { RuleCard } from "./RuleCard";
import type { RuleSection } from "@/types";

describe("RuleCard", () => {
  // Mock RuleSection with hierarchical structure
  const mockSection: RuleSection = {
    id: "100",
    number: "100.",
    title: "Combat System",
    content:
      "This section covers all combat rules and mechanics for resolving conflicts between characters.",
    level: 0,
    children: ["100.1", "100.2", "100.3"],
    crossRefs: ["200", "300"],
    version: "1.2",
  };

  const mockRule: RuleSection = {
    id: "100.1",
    number: "100.1.",
    title: "Initiative Order",
    content: "Determine who acts first in combat by rolling initiative.",
    level: 1,
    parentId: "100",
    children: ["100.1.a", "100.1.b"],
    crossRefs: ["100.2"],
    version: "1.2",
  };

  const mockSubRule: RuleSection = {
    id: "100.1.a",
    number: "100.1.a.",
    title: "Rolling Initiative",
    content: "Each character rolls 1d20 plus their dexterity modifier.",
    level: 2,
    parentId: "100.1",
    children: [],
    crossRefs: [],
    version: "1.2",
  };

  describe("Rendering", () => {
    it("should render rule number", () => {
      render(<RuleCard rule={mockRule} />);
      expect(screen.getByText("100.1.")).toBeInTheDocument();
    });

    it("should render rule title", () => {
      render(<RuleCard rule={mockRule} />);
      expect(screen.getByText("Initiative Order")).toBeInTheDocument();
    });

    it("should render content preview by default", () => {
      render(<RuleCard rule={mockRule} />);
      expect(screen.getByText(/Determine who acts first/)).toBeInTheDocument();
    });

    it("should render level badge by default", () => {
      render(<RuleCard rule={mockRule} />);
      expect(screen.getByText("Rule")).toBeInTheDocument();
    });

    it("should show Section badge for level 0", () => {
      render(<RuleCard rule={mockSection} />);
      expect(screen.getByText("Section")).toBeInTheDocument();
    });

    it("should show Sub-rule badge for level 2", () => {
      render(<RuleCard rule={mockSubRule} />);
      expect(screen.getByText("Sub-rule")).toBeInTheDocument();
    });

    it("should show Detail badge for level 3+", () => {
      const detailRule: RuleSection = { ...mockSubRule, level: 3 };
      render(<RuleCard rule={detailRule} />);
      expect(screen.getByText("Detail")).toBeInTheDocument();
    });

    it("should hide level badge when showLevel is false", () => {
      render(<RuleCard rule={mockRule} showLevel={false} />);
      expect(screen.queryByText("Rule")).not.toBeInTheDocument();
    });

    it("should show children count when rule has children", () => {
      render(<RuleCard rule={mockRule} />);
      expect(screen.getByText("2 details")).toBeInTheDocument();
    });

    it("should show singular 'detail' for single child", () => {
      const singleChild: RuleSection = { ...mockRule, children: ["100.1.a"] };
      render(<RuleCard rule={singleChild} />);
      expect(screen.getByText("1 detail")).toBeInTheDocument();
    });

    it("should show cross-refs count", () => {
      render(<RuleCard rule={mockRule} />);
      expect(screen.getByText("1 cross-ref")).toBeInTheDocument();
    });

    it("should show plural cross-refs", () => {
      render(<RuleCard rule={mockSection} />);
      expect(screen.getByText("2 cross-refs")).toBeInTheDocument();
    });

    it("should hide children count when showChildren is false", () => {
      render(<RuleCard rule={mockRule} showChildren={false} />);
      expect(screen.queryByText(/details/)).not.toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should render default variant", () => {
      const { container } = render(<RuleCard rule={mockRule} />);
      const card = container.firstChild;
      expect(card).toHaveClass("p-4");
    });

    it("should render compact variant with reduced padding", () => {
      const { container } = render(
        <RuleCard rule={mockRule} variant="compact" />,
      );
      const card = container.firstChild;
      expect(card).toHaveClass("p-3");
    });

    it("should render inline variant without border", () => {
      const { container } = render(
        <RuleCard rule={mockRule} variant="inline" />,
      );
      const card = container.firstChild;
      expect(card).toHaveClass("border-0");
      expect(card).toHaveClass("p-2");
    });

    it("should not show content preview in inline variant", () => {
      render(<RuleCard rule={mockRule} variant="inline" />);
      expect(
        screen.queryByText(/Determine who acts first/),
      ).not.toBeInTheDocument();
    });

    it("should not show content preview in compact variant", () => {
      render(<RuleCard rule={mockRule} variant="compact" />);
      expect(
        screen.queryByText(/Determine who acts first/),
      ).not.toBeInTheDocument();
    });
  });

  describe("Hierarchy Styling", () => {
    it("should apply level 0 styles to sections", () => {
      render(<RuleCard rule={mockSection} />);
      const number = screen.getByText("100.");
      expect(number).toHaveClass("text-2xl");
      expect(number).toHaveClass("font-extrabold");
      expect(number).toHaveClass("text-primary-800");
    });

    it("should apply level 1 styles to rules", () => {
      render(<RuleCard rule={mockRule} />);
      const number = screen.getByText("100.1.");
      expect(number).toHaveClass("text-xl");
      expect(number).toHaveClass("font-bold");
      expect(number).toHaveClass("text-primary-700");
    });

    it("should apply level 2 styles to sub-rules", () => {
      render(<RuleCard rule={mockSubRule} />);
      const number = screen.getByText("100.1.a.");
      expect(number).toHaveClass("text-lg");
      expect(number).toHaveClass("font-semibold");
      expect(number).toHaveClass("text-primary-700");
    });

    it("should apply level 3+ styles to details", () => {
      const detail: RuleSection = { ...mockSubRule, level: 3 };
      render(<RuleCard rule={detail} />);
      const number = screen.getByText("100.1.a.");
      expect(number).toHaveClass("text-lg");
      expect(number).toHaveClass("font-medium");
      expect(number).toHaveClass("text-neutral-800");
    });

    it("should apply correct border colors by level", () => {
      const { container: container0 } = render(<RuleCard rule={mockSection} />);
      expect(container0.firstChild).toHaveClass("border-l-primary-700");

      const { container: container1 } = render(<RuleCard rule={mockRule} />);
      expect(container1.firstChild).toHaveClass("border-l-primary-600");

      const { container: container2 } = render(<RuleCard rule={mockSubRule} />);
      expect(container2.firstChild).toHaveClass("border-l-primary-500");
    });
  });

  describe("Interactions", () => {
    it("should call onClick with rule ID when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<RuleCard rule={mockRule} onClick={handleClick} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledWith("100.1");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be keyboard accessible with Enter key", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<RuleCard rule={mockRule} onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledWith("100.1");
    });

    it("should not call onClick when no handler provided", async () => {
      const user = userEvent.setup();
      render(<RuleCard rule={mockRule} />);

      const button = screen.getByRole("button");
      await user.click(button);

      // Should not throw error
      expect(button).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<RuleCard rule={mockRule} />);
      const heading = screen.getByText("Initiative Order");
      expect(heading.tagName).toBe("H3");
    });

    it("should have descriptive aria-label", () => {
      render(<RuleCard rule={mockRule} />);
      expect(
        screen.getByRole("button", {
          name: /Rule 100\.1\. Initiative Order, Level 1, 2 sub-rules/,
        }),
      ).toBeInTheDocument();
    });

    it("should include child count in aria-label", () => {
      render(<RuleCard rule={mockSection} />);
      expect(
        screen.getByRole("button", {
          name: /3 sub-rules/,
        }),
      ).toBeInTheDocument();
    });

    it("should have button type", () => {
      render(<RuleCard rule={mockRule} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("should have focus ring styles", () => {
      const { container } = render(<RuleCard rule={mockRule} />);
      const card = container.firstChild;
      expect(card).toHaveClass("focus-within:ring-4");
      expect(card).toHaveClass("focus-within:ring-primary-500");
    });

    it("should hide SVG icons from screen readers", () => {
      const { container } = render(<RuleCard rule={mockRule} />);
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should have no accessibility violations", async () => {
      const { container } = render(
        <RuleCard rule={mockRule} onClick={() => {}} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Custom props", () => {
    it("should accept custom className", () => {
      const { container } = render(
        <RuleCard rule={mockRule} className="custom-class" />,
      );
      const card = container.firstChild;
      expect(card).toHaveClass("custom-class");
    });

    it("should maintain base styles with custom className", () => {
      const { container } = render(
        <RuleCard rule={mockRule} className="custom-class" />,
      );
      const card = container.firstChild;
      expect(card).toHaveClass("bg-white");
      expect(card).toHaveClass("custom-class");
    });
  });

  describe("Edge cases", () => {
    it("should handle rule with no children", () => {
      const leafRule: RuleSection = { ...mockSubRule, children: [] };
      render(<RuleCard rule={leafRule} />);
      expect(screen.getByText("Rolling Initiative")).toBeInTheDocument();
      expect(screen.queryByText(/details/)).not.toBeInTheDocument();
    });

    it("should handle rule with no cross-refs", () => {
      const noRefs: RuleSection = { ...mockSubRule, crossRefs: [] };
      render(<RuleCard rule={noRefs} />);
      expect(screen.queryByText(/cross-ref/)).not.toBeInTheDocument();
    });

    it("should handle rule with empty content", () => {
      const emptyContent: RuleSection = { ...mockRule, content: "" };
      render(<RuleCard rule={emptyContent} />);
      expect(screen.getByText("Initiative Order")).toBeInTheDocument();
    });

    it("should handle very long titles", () => {
      const longTitle: RuleSection = {
        ...mockRule,
        title:
          "Very Long Rule Title That Contains Many Words And Might Need Wrapping",
      };
      render(<RuleCard rule={longTitle} />);
      expect(
        screen.getByText(/Very Long Rule Title That Contains Many Words/),
      ).toBeInTheDocument();
    });

    it("should truncate long content preview", () => {
      const longContent: RuleSection = {
        ...mockRule,
        content: "A".repeat(200),
      };
      render(<RuleCard rule={longContent} />);
      const preview = screen.getByText(/A+\.\.\./);
      expect(preview.textContent?.length).toBeLessThan(200);
    });

    it("should handle rule without parent (top-level)", () => {
      const topLevel: RuleSection = { ...mockSection, parentId: undefined };
      render(<RuleCard rule={topLevel} />);
      expect(screen.getByText("Combat System")).toBeInTheDocument();
    });

    it("should handle deep nesting (level 4+)", () => {
      const deepRule: RuleSection = { ...mockSubRule, level: 5 };
      render(<RuleCard rule={deepRule} />);
      expect(screen.getByText("Detail")).toBeInTheDocument();
    });
  });

  describe("Content Preview", () => {
    it("should show preview in default variant", () => {
      render(<RuleCard rule={mockRule} variant="default" />);
      expect(screen.getByText(/Determine who acts first/)).toBeInTheDocument();
    });

    it("should have line-clamp-2 class on preview", () => {
      render(<RuleCard rule={mockRule} />);
      const preview = screen.getByText(/Determine who acts first/);
      expect(preview).toHaveClass("line-clamp-2");
    });

    it("should not show preview content in compact mode", () => {
      render(<RuleCard rule={mockRule} variant="compact" />);
      expect(
        screen.queryByText(/Determine who acts first/),
      ).not.toBeInTheDocument();
    });
  });
});
