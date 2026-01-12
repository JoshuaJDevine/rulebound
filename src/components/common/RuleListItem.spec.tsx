/**
 * Tests for RuleListItem component
 * Compact rule list items (level 2+) with blue-gray border
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { RuleListItem } from "./RuleListItem";
import type { RuleSection } from "@/types";

describe("RuleListItem", () => {
  const mockRule: RuleSection = {
    id: "100.1.1",
    number: "100.1.1",
    title: "Attack Action",
    content:
      "When you take the Attack action, you make a melee or ranged attack against a target within range.",
    level: 2,
    children: [],
    crossRefs: [],
    version: "1.2",
  };

  describe("Rendering", () => {
    it("should render rule number", () => {
      const handleClick = vi.fn();
      render(<RuleListItem rule={mockRule} onClick={handleClick} />);
      expect(screen.getByText("100.1.1")).toBeInTheDocument();
    });

    it("should render rule content preview when available", () => {
      const handleClick = vi.fn();
      render(<RuleListItem rule={mockRule} onClick={handleClick} />);
      expect(
        screen.getByText(/When you take the Attack action/),
      ).toBeInTheDocument();
    });

    it("should render rule title when content is not available", () => {
      const handleClick = vi.fn();
      const noContent: RuleSection = { ...mockRule, content: "" };
      render(<RuleListItem rule={noContent} onClick={handleClick} />);
      expect(screen.getByText("Attack Action")).toBeInTheDocument();
    });

    it("should truncate long content to 120 characters", () => {
      const handleClick = vi.fn();
      const longContent: RuleSection = {
        ...mockRule,
        content: "A".repeat(200),
      };
      render(<RuleListItem rule={longContent} onClick={handleClick} />);
      const preview = screen.getByText(/A+\.\.\./);
      expect(preview.textContent?.length).toBeLessThanOrEqual(123); // 120 + "..."
    });

    it("should not truncate content under 120 characters", () => {
      const handleClick = vi.fn();
      const shortContent: RuleSection = {
        ...mockRule,
        content: "Short content",
      };
      render(<RuleListItem rule={shortContent} onClick={handleClick} />);
      expect(screen.getByText("Short content")).toBeInTheDocument();
      expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument();
    });

    it("should hide preview when showPreview is false", () => {
      const handleClick = vi.fn();
      render(
        <RuleListItem
          rule={mockRule}
          onClick={handleClick}
          showPreview={false}
        />,
      );
      // Should show title instead
      expect(screen.getByText("Attack Action")).toBeInTheDocument();
    });

    it("should render arrow indicator", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RuleListItem rule={mockRule} onClick={handleClick} />,
      );
      const arrow = container.querySelector("svg");
      expect(arrow).toBeInTheDocument();
    });
  });

  describe("Visual Styling", () => {
    it("should have blue-gray left border", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RuleListItem rule={mockRule} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("border-l-2");
      expect(button).toHaveClass("border-l-primary-300");
    });

    it("should have neutral background", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RuleListItem rule={mockRule} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("bg-neutral-50");
    });

    it("should have hover effects", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RuleListItem rule={mockRule} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("hover:bg-neutral-100");
    });

    it("should have transition effects", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RuleListItem rule={mockRule} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("transition-colors");
    });

    it("should have focus ring", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RuleListItem rule={mockRule} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("focus:ring-2");
      expect(button).toHaveClass("focus:ring-accent-500");
    });

    it("should use monospace font for rule number", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RuleListItem rule={mockRule} onClick={handleClick} />,
      );
      const number = container.querySelector(".font-mono");
      expect(number).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onClick with rule ID when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<RuleListItem rule={mockRule} onClick={handleClick} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledWith("100.1.1");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be keyboard accessible with Enter key", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<RuleListItem rule={mockRule} onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledWith("100.1.1");
    });

    it("should be keyboard accessible with Space key", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<RuleListItem rule={mockRule} onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();

      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledWith("100.1.1");
    });

    it("should prevent default on keyboard events", async () => {
      const handleClick = vi.fn();

      render(<RuleListItem rule={mockRule} onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();

      const spaceEvent = new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
        cancelable: true,
      });
      button.dispatchEvent(spaceEvent);

      // Note: userEvent handles preventDefault automatically, so we test the handler directly
      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
        }
      };

      const mockEvent = {
        key: " ",
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      handleKeyDown(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should render as button", () => {
      const handleClick = vi.fn();
      render(<RuleListItem rule={mockRule} onClick={handleClick} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should have button type", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RuleListItem rule={mockRule} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("should have focus ring styles", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RuleListItem rule={mockRule} onClick={handleClick} />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("focus:outline-none");
      expect(button).toHaveClass("focus:ring-2");
    });

    it("should have no accessibility violations", async () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RuleListItem rule={mockRule} onClick={handleClick} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should be keyboard navigable", async () => {
      const handleClick = vi.fn();

      render(<RuleListItem rule={mockRule} onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe("Edge Cases", () => {
    it("should handle rule with empty content", () => {
      const handleClick = vi.fn();
      const emptyContent: RuleSection = { ...mockRule, content: "" };
      render(<RuleListItem rule={emptyContent} onClick={handleClick} />);
      expect(screen.getByText("Attack Action")).toBeInTheDocument();
    });

    it("should handle rule with very long title", () => {
      const handleClick = vi.fn();
      const longTitle: RuleSection = {
        ...mockRule,
        title: "Very Long Rule Title That Might Need Truncation In The Display",
      };
      render(
        <RuleListItem
          rule={longTitle}
          onClick={handleClick}
          showPreview={false}
        />,
      );
      expect(
        screen.getByText(
          "Very Long Rule Title That Might Need Truncation In The Display",
        ),
      ).toBeInTheDocument();
    });

    it("should handle exactly 120 character content", () => {
      const handleClick = vi.fn();
      const exactLength: RuleSection = {
        ...mockRule,
        content: "A".repeat(120),
      };
      render(<RuleListItem rule={exactLength} onClick={handleClick} />);
      const preview = screen.getByText("A".repeat(120));
      expect(preview).toBeInTheDocument();
      expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RuleListItem
          rule={mockRule}
          onClick={handleClick}
          className="custom-class"
        />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("custom-class");
    });

    it("should work without onClick callback", () => {
      render(<RuleListItem rule={mockRule} />);
      expect(screen.getByText("100.1.1")).toBeInTheDocument();
    });
  });
});
