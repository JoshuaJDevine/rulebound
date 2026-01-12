/**
 * Tests for Card component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Card } from "./Card";

describe("Card", () => {
  describe("Rendering", () => {
    it("should render children content", () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("should render as div by default", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should render as button when onClick is provided", () => {
      render(<Card onClick={() => {}}>Clickable</Card>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should render default variant", () => {
      const { container } = render(<Card variant="default">Default</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("border-neutral-200");
    });

    it("should render interactive variant", () => {
      const { container } = render(
        <Card variant="interactive" onClick={() => {}}>
          Interactive
        </Card>,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("hover:shadow-md");
      expect(card).toHaveClass("cursor-pointer");
    });

    it("should render elevated variant", () => {
      const { container } = render(<Card variant="elevated">Elevated</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("shadow-lg");
    });
  });

  describe("Padding", () => {
    it("should render small padding", () => {
      const { container } = render(<Card padding="sm">Small</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("p-3");
    });

    it("should render medium padding by default", () => {
      const { container } = render(<Card>Medium</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("p-4");
    });

    it("should render large padding", () => {
      const { container } = render(<Card padding="lg">Large</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("p-6");
    });
  });

  describe("Interactions", () => {
    it("should call onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Card onClick={handleClick}>Click me</Card>);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be keyboard accessible when interactive", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Card onClick={handleClick}>Press Enter</Card>);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should have button type when clickable", () => {
      render(<Card onClick={() => {}}>Clickable</Card>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("Accessibility", () => {
    it("should use ariaLabel when provided", () => {
      render(
        <Card onClick={() => {}} ariaLabel="Custom card label">
          Content
        </Card>,
      );
      expect(
        screen.getByRole("button", { name: "Custom card label" }),
      ).toBeInTheDocument();
    });

    it("should have focus styles when interactive", () => {
      const { container } = render(
        <Card variant="interactive" onClick={() => {}}>
          Interactive
        </Card>,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("focus:ring-4");
      expect(card).toHaveClass("focus:outline-none");
    });

    it("should have text-left alignment when clickable", () => {
      const { container } = render(<Card onClick={() => {}}>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("text-left");
    });

    it("should have no accessibility violations (non-interactive)", async () => {
      const { container } = render(<Card>Non-interactive content</Card>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations (interactive)", async () => {
      const { container } = render(
        <Card onClick={() => {}} ariaLabel="Interactive card">
          Interactive content
        </Card>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Custom Props", () => {
    it("should accept custom className", () => {
      const { container } = render(
        <Card className="custom-class">Custom</Card>,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("custom-class");
    });

    it("should preserve base styles with custom className", () => {
      const { container } = render(
        <Card className="custom-class">Custom</Card>,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("bg-white");
      expect(card).toHaveClass("rounded-lg");
      expect(card).toHaveClass("custom-class");
    });
  });
});
