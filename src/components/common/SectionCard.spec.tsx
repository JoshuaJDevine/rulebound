/**
 * Tests for SectionCard component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SectionCard } from "./SectionCard";
import type { Section } from "@/types";

describe("SectionCard", () => {
  const mockSection: Section = {
    id: "combat",
    title: "Combat",
    description: "Rules for combat encounters",
    icon: "⚔️",
    rules: ["rule-1", "rule-2", "rule-3"],
  };

  describe("Rendering", () => {
    it("should render section title", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      expect(screen.getByText("Combat")).toBeInTheDocument();
    });

    it("should render rule count (plural)", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      expect(screen.getByText("3 rules")).toBeInTheDocument();
    });

    it("should render rule count (singular)", () => {
      const handleClick = vi.fn();
      const singleRuleSection = { ...mockSection, rules: ["rule-1"] };
      render(<SectionCard section={singleRuleSection} onClick={handleClick} />);
      expect(screen.getByText("1 rule")).toBeInTheDocument();
    });

    it("should render icon when provided", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      expect(screen.getByText("⚔️")).toBeInTheDocument();
    });

    it("should not render icon wrapper when icon is not provided", () => {
      const handleClick = vi.fn();
      const sectionWithoutIcon = { ...mockSection, icon: undefined };
      render(
        <SectionCard section={sectionWithoutIcon} onClick={handleClick} />,
      );
      expect(screen.queryByText("⚔️")).not.toBeInTheDocument();
    });

    it("should render as button", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should handle zero rules", () => {
      const handleClick = vi.fn();
      const emptySection = { ...mockSection, rules: [] };
      render(<SectionCard section={emptySection} onClick={handleClick} />);
      expect(screen.getByText("0 rules")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onClick with section ID when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<SectionCard section={mockSection} onClick={handleClick} />);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledWith("combat");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<SectionCard section={mockSection} onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledWith("combat");
    });
  });

  describe("Styling", () => {
    it("should have gradient background", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("bg-gradient-to-br");
      expect(button).toHaveClass("from-primary-50");
    });

    it("should have rounded corners", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("rounded-xl");
    });

    it("should have hover styles", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("hover:shadow-lg");
      expect(button).toHaveClass("hover:border-primary-300");
    });

    it("should be centered", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("text-center");
      expect(button).toHaveClass("items-center");
      expect(button).toHaveClass("justify-center");
    });

    it("should have minimum height", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("min-h-[120px]");
    });
  });

  describe("Accessibility", () => {
    it("should have descriptive aria-label", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      expect(
        screen.getByRole("button", { name: "Browse Combat (3 rules)" }),
      ).toBeInTheDocument();
    });

    it("should hide icon from screen readers", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const iconWrapper = container.querySelector('[aria-hidden="true"]');
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveTextContent("⚔️");
    });

    it("should have proper heading hierarchy", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      const heading = screen.getByText("Combat");
      expect(heading.tagName).toBe("H3");
    });

    it("should have button type", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("should have focus ring styles", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("focus:ring-4");
      expect(button).toHaveClass("focus:outline-none");
    });

    it("should have no accessibility violations", async () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Custom props", () => {
    it("should accept custom className", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard
          section={mockSection}
          onClick={handleClick}
          className="custom-class"
        />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("custom-class");
    });

    it("should maintain base styles with custom className", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard
          section={mockSection}
          onClick={handleClick}
          className="custom-class"
        />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("rounded-xl");
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Edge cases", () => {
    it("should handle very long section titles", () => {
      const handleClick = vi.fn();
      const longTitleSection = {
        ...mockSection,
        title: "Very Long Section Title That Might Need Wrapping",
      };
      render(<SectionCard section={longTitleSection} onClick={handleClick} />);
      expect(
        screen.getByText("Very Long Section Title That Might Need Wrapping"),
      ).toBeInTheDocument();
    });

    it("should handle large rule counts", () => {
      const handleClick = vi.fn();
      const manyRulesSection = {
        ...mockSection,
        rules: Array.from({ length: 100 }, (_, i) => `rule-${i}`),
      };
      render(<SectionCard section={manyRulesSection} onClick={handleClick} />);
      expect(screen.getByText("100 rules")).toBeInTheDocument();
    });

    it("should handle sections with subsections", () => {
      const handleClick = vi.fn();
      const sectionWithSubsections: Section = {
        ...mockSection,
        subsections: [
          {
            id: "melee",
            title: "Melee",
            description: "Melee combat",
            rules: ["rule-4"],
          },
        ],
      };
      render(
        <SectionCard section={sectionWithSubsections} onClick={handleClick} />,
      );
      expect(screen.getByText("Combat")).toBeInTheDocument();
    });
  });
});
