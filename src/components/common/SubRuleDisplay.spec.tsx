/**
 * Tests for SubRuleDisplay component
 * Inline sub-rule display (level 3+) with continuation lines
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { SubRuleDisplay } from "./SubRuleDisplay";
import type { RuleSection } from "@/types";

describe("SubRuleDisplay", () => {
  const mockSubRule: RuleSection = {
    id: "100.1.1.a",
    number: "100.1.1.a",
    title: "Melee Attack",
    content:
      "A melee attack uses a melee weapon to attack a target within 5 feet.",
    level: 3,
    children: [],
    crossRefs: [],
    version: "1.2",
  };

  describe("Rendering", () => {
    it("should render sub-rule number", () => {
      render(<SubRuleDisplay rule={mockSubRule} />);
      expect(screen.getByText("100.1.1.a")).toBeInTheDocument();
    });

    it("should render sub-rule content when available", () => {
      render(<SubRuleDisplay rule={mockSubRule} />);
      expect(
        screen.getByText(/A melee attack uses a melee weapon/),
      ).toBeInTheDocument();
    });

    it("should render sub-rule title when content is not available", () => {
      const noContent: RuleSection = { ...mockSubRule, content: "" };
      render(<SubRuleDisplay rule={noContent} />);
      expect(screen.getByText("Melee Attack")).toBeInTheDocument();
    });

    it("should use monospace font for rule number", () => {
      const { container } = render(<SubRuleDisplay rule={mockSubRule} />);
      const number = container.querySelector(".font-mono");
      expect(number).toBeInTheDocument();
    });

    it("should use body font for content", () => {
      const { container } = render(<SubRuleDisplay rule={mockSubRule} />);
      const content = container.querySelector(".font-body");
      expect(content).toBeInTheDocument();
    });
  });

  describe("Visual Styling", () => {
    it("should have left border", () => {
      const { container } = render(<SubRuleDisplay rule={mockSubRule} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("border-l");
    });

    it("should have neutral border color", () => {
      const { container } = render(<SubRuleDisplay rule={mockSubRule} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("border-neutral-300");
    });

    it("should have left margin", () => {
      const { container } = render(<SubRuleDisplay rule={mockSubRule} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("ml-4");
    });

    it("should have padding based on depth", () => {
      const { container } = render(
        <SubRuleDisplay rule={mockSubRule} depth={2} />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ paddingLeft: "calc(1.5rem * 2)" });
    });

    it("should have default depth of 1", () => {
      const { container } = render(<SubRuleDisplay rule={mockSubRule} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ paddingLeft: "calc(1.5rem * 1)" });
    });

    it("should have gap between number and content", () => {
      const { container } = render(<SubRuleDisplay rule={mockSubRule} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("gap-2");
    });

    it("should have vertical padding", () => {
      const { container } = render(<SubRuleDisplay rule={mockSubRule} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("py-2");
    });
  });

  describe("Depth Handling", () => {
    it("should apply correct padding for depth 1", () => {
      const { container } = render(
        <SubRuleDisplay rule={mockSubRule} depth={1} />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ paddingLeft: "calc(1.5rem * 1)" });
    });

    it("should apply correct padding for depth 2", () => {
      const { container } = render(
        <SubRuleDisplay rule={mockSubRule} depth={2} />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ paddingLeft: "calc(1.5rem * 2)" });
    });

    it("should apply correct padding for depth 3", () => {
      const { container } = render(
        <SubRuleDisplay rule={mockSubRule} depth={3} />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ paddingLeft: "calc(1.5rem * 3)" });
    });

    it("should handle depth 0", () => {
      const { container } = render(
        <SubRuleDisplay rule={mockSubRule} depth={0} />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ paddingLeft: "calc(1.5rem * 0)" });
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<SubRuleDisplay rule={mockSubRule} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should use semantic HTML", () => {
      const { container } = render(<SubRuleDisplay rule={mockSubRule} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper?.tagName).toBe("DIV");
    });
  });

  describe("Edge Cases", () => {
    it("should handle sub-rule with empty content and title", () => {
      const empty: RuleSection = { ...mockSubRule, content: "", title: "" };
      render(<SubRuleDisplay rule={empty} />);
      expect(screen.getByText("100.1.1.a")).toBeInTheDocument();
    });

    it("should handle very long content", () => {
      const longContent: RuleSection = {
        ...mockSubRule,
        content: "A".repeat(500),
      };
      render(<SubRuleDisplay rule={longContent} />);
      expect(screen.getByText("A".repeat(500))).toBeInTheDocument();
    });

    it("should handle very long number", () => {
      const longNumber: RuleSection = {
        ...mockSubRule,
        number: "100.1.1.a.b.c.d.e",
      };
      render(<SubRuleDisplay rule={longNumber} />);
      expect(screen.getByText("100.1.1.a.b.c.d.e")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SubRuleDisplay rule={mockSubRule} className="custom-class" />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("should maintain base styles with custom className", () => {
      const { container } = render(
        <SubRuleDisplay rule={mockSubRule} className="custom-class" />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("border-l");
      expect(wrapper).toHaveClass("custom-class");
    });
  });
});
