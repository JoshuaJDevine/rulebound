/**
 * Tests for SectionCard component
 * Updated for hierarchical RuleSection data model
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SectionCard } from "./SectionCard";
import type { RuleSection } from "@/types";

describe("SectionCard", () => {
  const mockSection: RuleSection = {
    id: "100",
    number: "100.",
    title: "Combat",
    content: "Rules for combat encounters and battle mechanics.",
    level: 0,
    children: ["100.1", "100.2", "100.3"],
    crossRefs: [],
    version: "1.2",
  };

  describe("Rendering", () => {
    it("should render section number", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      expect(screen.getByText("100.")).toBeInTheDocument();
    });

    it("should render section title", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      expect(screen.getByText("Combat")).toBeInTheDocument();
    });

    it("should render child count (plural)", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      expect(screen.getByText("3 rules")).toBeInTheDocument();
    });

    it("should render child count (singular)", () => {
      const handleClick = vi.fn();
      const singleChild: RuleSection = { ...mockSection, children: ["100.1"] };
      render(<SectionCard section={singleChild} onClick={handleClick} />);
      expect(screen.getByText("1 rule")).toBeInTheDocument();
    });

    it("should handle zero children", () => {
      const handleClick = vi.fn();
      const emptySection: RuleSection = { ...mockSection, children: [] };
      render(<SectionCard section={emptySection} onClick={handleClick} />);
      expect(screen.getByText("0 rules")).toBeInTheDocument();
    });

    it("should not render content description (content field not displayed in new design)", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      // Content is not rendered in the new branded design
      expect(
        screen.queryByText(/Rules for combat encounters/),
      ).not.toBeInTheDocument();
    });

    it("should render as button", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Branding", () => {
    it("should render with gradient background", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("bg-gradient-primary");
    });

    it("should render with icon container", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const iconContainer = container.querySelector(".rounded-full");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should accept custom icon prop", () => {
      const handleClick = vi.fn();
      const customIcon = "⭐";
      render(
        <SectionCard
          section={mockSection}
          onClick={handleClick}
          icon={customIcon}
        />,
      );
      expect(screen.getByText(customIcon)).toBeInTheDocument();
    });

    it("should display Cinzel font for title", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      const title = screen.getByText("Combat");
      expect(title).toHaveClass("font-display");
    });
  });

  describe("Interactions", () => {
    it("should call onClick with section ID when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<SectionCard section={mockSection} onClick={handleClick} />);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledWith("100");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be keyboard accessible with Enter key", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<SectionCard section={mockSection} onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledWith("100");
    });
  });

  describe("Styling", () => {
    it("should have rounded corners", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("rounded-lg");
    });

    it("should have hover styles", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("hover:shadow-xl");
    });

    it("should be centered", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("text-left");
    });

    it("should have transition effects", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("transition-all");
    });
  });

  describe("Accessibility", () => {
    it("should have descriptive aria-label", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      expect(
        screen.getByRole("button", {
          name: "Section 100. Combat, contains 3 rules",
        }),
      ).toBeInTheDocument();
    });

    it("should have aria-label with singular rule count", () => {
      const handleClick = vi.fn();
      const singleChild: RuleSection = { ...mockSection, children: ["100.1"] };
      render(<SectionCard section={singleChild} onClick={handleClick} />);
      expect(
        screen.getByRole("button", {
          name: "Section 100. Combat, contains 1 rule",
        }),
      ).toBeInTheDocument();
    });

    it("should render emoji icons (not SVG)", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SectionCard section={mockSection} onClick={handleClick} />,
      );
      // Section 100 should have 🎮 icon
      const iconContainer = container.querySelector(".text-2xl");
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer?.textContent).toContain("🎮");
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
      expect(button).toHaveClass("rounded-lg");
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Edge cases", () => {
    it("should handle very long section titles", () => {
      const handleClick = vi.fn();
      const longTitle: RuleSection = {
        ...mockSection,
        title:
          "Very Long Section Title That Might Need Wrapping In The Display",
      };
      render(<SectionCard section={longTitle} onClick={handleClick} />);
      expect(
        screen.getByText(
          "Very Long Section Title That Might Need Wrapping In The Display",
        ),
      ).toBeInTheDocument();
    });

    it("should handle large child counts", () => {
      const handleClick = vi.fn();
      const manyChildren: RuleSection = {
        ...mockSection,
        children: Array.from({ length: 100 }, (_, i) => `100.${i}`),
      };
      render(<SectionCard section={manyChildren} onClick={handleClick} />);
      expect(screen.getByText("100 rules")).toBeInTheDocument();
    });

    it("should handle section with empty content", () => {
      const handleClick = vi.fn();
      const noContent: RuleSection = {
        ...mockSection,
        content: "",
      };
      render(<SectionCard section={noContent} onClick={handleClick} />);
      expect(screen.getByText("Combat")).toBeInTheDocument();
    });

    it("should apply correct styles for level 0 sections", () => {
      const handleClick = vi.fn();
      render(<SectionCard section={mockSection} onClick={handleClick} />);
      const number = screen.getByText("100.");
      expect(number).toHaveClass("font-semibold");
      expect(number).toHaveClass("text-xl");
    });
  });
});
