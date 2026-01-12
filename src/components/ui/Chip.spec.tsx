/**
 * Tests for Chip component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Chip } from "./Chip";

describe("Chip", () => {
  describe("Rendering", () => {
    it("should render label text", () => {
      render(<Chip label="Test Tag" />);
      expect(screen.getByText("Test Tag")).toBeInTheDocument();
    });

    it("should render as span by default", () => {
      const { container } = render(<Chip label="Tag" />);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("should render as button when onClick is provided", () => {
      render(<Chip label="Clickable" onClick={() => {}} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render with icon", () => {
      render(<Chip label="Tag" icon={<span data-testid="icon">🏷️</span>} />);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("should render remove button when onRemove is provided", () => {
      render(<Chip label="Removable" onRemove={() => {}} />);
      expect(
        screen.getByRole("button", { name: "Remove Removable" }),
      ).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should render default variant", () => {
      const { container } = render(<Chip label="Default" variant="default" />);
      const chip = container.firstChild as HTMLElement;
      expect(chip).toHaveClass("bg-neutral-100");
    });

    it("should render interactive variant", () => {
      const { container } = render(
        <Chip label="Interactive" variant="interactive" onClick={() => {}} />,
      );
      const chip = container.firstChild as HTMLElement;
      expect(chip).toHaveClass("bg-white");
      expect(chip).toHaveClass("cursor-pointer");
    });

    it("should render selected variant", () => {
      const { container } = render(
        <Chip label="Selected" variant="selected" />,
      );
      const chip = container.firstChild as HTMLElement;
      expect(chip).toHaveClass("bg-primary-600");
      expect(chip).toHaveClass("text-white");
    });
  });

  describe("Interactions", () => {
    it("should call onClick when chip is clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Chip label="Clickable" onClick={handleClick} />);

      await user.click(screen.getByRole("button", { name: "Clickable" }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should call onRemove when remove button is clicked", async () => {
      const user = userEvent.setup();
      const handleRemove = vi.fn();

      render(<Chip label="Removable" onRemove={handleRemove} />);

      await user.click(
        screen.getByRole("button", { name: "Remove Removable" }),
      );
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it("should not propagate remove click to chip onClick", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const handleRemove = vi.fn();

      render(
        <Chip label="Both" onClick={handleClick} onRemove={handleRemove} />,
      );

      await user.click(screen.getByRole("button", { name: "Remove Both" }));
      expect(handleRemove).toHaveBeenCalledTimes(1);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Chip label="Keyboard" onClick={handleClick} />);

      const button = screen.getByRole("button", { name: "Keyboard" });
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label matching the label", () => {
      render(<Chip label="Test Label" />);
      expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });

    it("should have proper remove button label", () => {
      render(<Chip label="Tag Name" onRemove={() => {}} />);
      expect(
        screen.getByRole("button", { name: "Remove Tag Name" }),
      ).toBeInTheDocument();
    });

    it("should hide icon from screen readers", () => {
      render(<Chip label="Tag" icon={<span data-testid="icon">🏷️</span>} />);
      const iconWrapper = screen.getByTestId("icon").parentElement;
      expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
    });

    it("should have button type when clickable", () => {
      render(<Chip label="Clickable" onClick={() => {}} />);
      const button = screen.getByRole("button", { name: "Clickable" });
      expect(button).toHaveAttribute("type", "button");
    });

    it("should have focus ring styles", () => {
      const { container } = render(<Chip label="Focus" onClick={() => {}} />);
      const chip = container.firstChild as HTMLElement;
      expect(chip).toHaveClass("focus:ring-2");
      expect(chip).toHaveClass("focus:outline-none");
    });

    it("should have no accessibility violations (non-interactive)", async () => {
      const { container } = render(<Chip label="Non-interactive tag" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations (clickable)", async () => {
      const { container } = render(
        <Chip label="Clickable tag" onClick={() => {}} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations (removable)", async () => {
      const { container } = render(
        <Chip label="Removable tag" onRemove={() => {}} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Custom props", () => {
    it("should accept custom className", () => {
      const { container } = render(
        <Chip label="Custom" className="custom-class" />,
      );
      const chip = container.firstChild as HTMLElement;
      expect(chip).toHaveClass("custom-class");
    });

    it("should maintain base styles with custom className", () => {
      const { container } = render(
        <Chip label="Custom" className="custom-class" />,
      );
      const chip = container.firstChild as HTMLElement;
      expect(chip).toHaveClass("inline-flex");
      expect(chip).toHaveClass("rounded-full");
      expect(chip).toHaveClass("custom-class");
    });
  });
});
