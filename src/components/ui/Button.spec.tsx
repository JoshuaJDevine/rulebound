/**
 * Tests for Button component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Button } from "./Button";

describe("Button", () => {
  describe("Rendering", () => {
    it("should render with children text", () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole("button", { name: /click me/i }),
      ).toBeInTheDocument();
    });

    it("should render with default variant and size", () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary-600");
      expect(button).toHaveClass("h-11");
    });

    it("should render with icon", () => {
      render(<Button icon={<span data-testid="icon">🔍</span>}>Search</Button>);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("Search")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should render primary variant", () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary-600");
    });

    it("should render secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-neutral-200");
    });

    it("should render ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-transparent");
    });

    it("should render danger variant", () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-error-600");
    });
  });

  describe("Sizes", () => {
    it("should render small size", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-9");
    });

    it("should render medium size", () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-11");
    });

    it("should render large size", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-12");
    });
  });

  describe("States", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-disabled", "true");
    });

    it("should show loading state", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(screen.getByText("Loading")).toBeInTheDocument();
    });

    it("should hide children when loading", () => {
      render(<Button loading>Click me</Button>);
      expect(screen.queryByText("Click me")).not.toBeInTheDocument();
    });

    it("should render full width", () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full");
    });
  });

  describe("Interactions", () => {
    it("should call onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>,
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should not call onClick when loading", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button loading onClick={handleClick}>
          Loading
        </Button>,
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Keyboard</Button>);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should use ariaLabel when provided", () => {
      render(<Button ariaLabel="Custom label">Button</Button>);
      expect(
        screen.getByRole("button", { name: "Custom label" }),
      ).toBeInTheDocument();
    });

    it("should have focus ring styles", () => {
      render(<Button>Focus</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus:ring-4");
      expect(button).toHaveClass("focus:ring-offset-2");
    });

    it("should hide icon from screen readers", () => {
      render(<Button icon={<span data-testid="icon">🔍</span>}>Search</Button>);
      const iconWrapper = screen.getByTestId("icon").parentElement;
      expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
    });

    it("should have no accessibility violations", async () => {
      const { container } = render(<Button>Accessible</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Custom Props", () => {
    it("should accept custom className", () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("should forward HTML button attributes", () => {
      render(
        <Button type="submit" name="submit-btn" data-testid="submit">
          Submit
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("name", "submit-btn");
      expect(button).toHaveAttribute("data-testid", "submit");
    });
  });
});
