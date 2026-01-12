/**
 * Tests for ViewModeToggle component
 * Segmented control for switching between navigation and reading modes
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ViewModeToggle } from "./ViewModeToggle";

describe("ViewModeToggle", () => {
  describe("Rendering", () => {
    it("should render both mode buttons", () => {
      const handleChange = vi.fn();
      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);
      expect(screen.getByText("List")).toBeInTheDocument();
      expect(screen.getByText("Read")).toBeInTheDocument();
    });

    it("should show navigation mode as active", () => {
      const handleChange = vi.fn();
      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);
      const listButton = screen.getByText("List").closest("button");
      expect(listButton).toHaveClass("bg-accent-500");
    });

    it("should show reading mode as active", () => {
      const handleChange = vi.fn();
      render(<ViewModeToggle mode="reading" onChange={handleChange} />);
      const readButton = screen.getByText("Read").closest("button");
      expect(readButton).toHaveClass("bg-accent-500");
    });

    it("should render icons", () => {
      const handleChange = vi.fn();
      const { container } = render(
        <ViewModeToggle mode="navigation" onChange={handleChange} />,
      );
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThanOrEqual(2);
    });

    it("should have proper ARIA role", () => {
      const handleChange = vi.fn();
      const { container } = render(
        <ViewModeToggle mode="navigation" onChange={handleChange} />,
      );
      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
    });

    it("should have ARIA label", () => {
      const handleChange = vi.fn();
      const { container } = render(
        <ViewModeToggle mode="navigation" onChange={handleChange} />,
      );
      const group = container.querySelector('[aria-label="View mode"]');
      expect(group).toBeInTheDocument();
    });
  });

  describe("Visual Styling", () => {
    it("should have rounded-full container", () => {
      const handleChange = vi.fn();
      const { container } = render(
        <ViewModeToggle mode="navigation" onChange={handleChange} />,
      );
      const group = container.querySelector('[role="group"]');
      expect(group).toHaveClass("rounded-full");
    });

    it("should have neutral background for container", () => {
      const handleChange = vi.fn();
      const { container } = render(
        <ViewModeToggle mode="navigation" onChange={handleChange} />,
      );
      const group = container.querySelector('[role="group"]');
      expect(group).toHaveClass("bg-neutral-100");
    });

    it("should have gold active state", () => {
      const handleChange = vi.fn();
      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);
      const listButton = screen.getByText("List").closest("button");
      expect(listButton).toHaveClass("bg-accent-500");
      expect(listButton).toHaveClass("text-primary-900");
    });

    it("should have shadow on active button", () => {
      const handleChange = vi.fn();
      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);
      const listButton = screen.getByText("List").closest("button");
      expect(listButton).toHaveClass("shadow-sm");
    });

    it("should have transition effects", () => {
      const handleChange = vi.fn();
      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);
      const listButton = screen.getByText("List").closest("button");
      expect(listButton).toHaveClass("transition-all");
    });

    it("should have focus ring", () => {
      const handleChange = vi.fn();
      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);
      const listButton = screen.getByText("List").closest("button");
      expect(listButton).toHaveClass("focus:ring-2");
      expect(listButton).toHaveClass("focus:ring-accent-500");
    });
  });

  describe("Interactions", () => {
    it("should call onChange with 'navigation' when List button is clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ViewModeToggle mode="reading" onChange={handleChange} />);

      const listButton = screen.getByText("List").closest("button");
      await user.click(listButton!);

      expect(handleChange).toHaveBeenCalledWith("navigation");
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should call onChange with 'reading' when Read button is clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);

      const readButton = screen.getByText("Read").closest("button");
      await user.click(readButton!);

      expect(handleChange).toHaveBeenCalledWith("reading");
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);

      const listButton = screen.getByText("List").closest("button");
      listButton!.focus();
      expect(listButton).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleChange).toHaveBeenCalledWith("navigation");
    });

    it("should disable buttons when disabled prop is true", () => {
      const handleChange = vi.fn();
      render(
        <ViewModeToggle
          mode="navigation"
          onChange={handleChange}
          disabled={true}
        />,
      );

      const listButton = screen.getByText("List").closest("button");
      const readButton = screen.getByText("Read").closest("button");

      expect(listButton).toBeDisabled();
      expect(readButton).toBeDisabled();
    });

    it("should not call onChange when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <ViewModeToggle
          mode="navigation"
          onChange={handleChange}
          disabled={true}
        />,
      );

      const listButton = screen.getByText("List").closest("button");
      await user.click(listButton!);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it("should have disabled styling when disabled", () => {
      const handleChange = vi.fn();
      render(
        <ViewModeToggle
          mode="navigation"
          onChange={handleChange}
          disabled={true}
        />,
      );

      const listButton = screen.getByText("List").closest("button");
      expect(listButton).toHaveClass("opacity-50");
      expect(listButton).toHaveClass("cursor-not-allowed");
    });
  });

  describe("Accessibility", () => {
    it("should have aria-pressed on active button", () => {
      const handleChange = vi.fn();
      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);

      const listButton = screen.getByText("List").closest("button");
      expect(listButton).toHaveAttribute("aria-pressed", "true");
    });

    it("should have aria-pressed false on inactive button", () => {
      const handleChange = vi.fn();
      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);

      const readButton = screen.getByText("Read").closest("button");
      expect(readButton).toHaveAttribute("aria-pressed", "false");
    });

    it("should have focus ring styles", () => {
      const handleChange = vi.fn();
      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);

      const listButton = screen.getByText("List").closest("button");
      expect(listButton).toHaveClass("focus:outline-none");
      expect(listButton).toHaveClass("focus:ring-2");
    });

    it("should have no accessibility violations", async () => {
      const handleChange = vi.fn();
      const { container } = render(
        <ViewModeToggle mode="navigation" onChange={handleChange} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should be keyboard navigable", async () => {
      const handleChange = vi.fn();

      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);

      const listButton = screen.getByText("List").closest("button");
      listButton!.focus();
      expect(listButton).toHaveFocus();
    });
  });

  describe("Edge Cases", () => {
    it("should accept custom className", () => {
      const handleChange = vi.fn();
      const { container } = render(
        <ViewModeToggle
          mode="navigation"
          onChange={handleChange}
          className="custom-class"
        />,
      );
      const group = container.querySelector('[role="group"]');
      expect(group).toHaveClass("custom-class");
    });

    it("should maintain base styles with custom className", () => {
      const handleChange = vi.fn();
      const { container } = render(
        <ViewModeToggle
          mode="navigation"
          onChange={handleChange}
          className="custom-class"
        />,
      );
      const group = container.querySelector('[role="group"]');
      expect(group).toHaveClass("rounded-full");
      expect(group).toHaveClass("custom-class");
    });

    it("should handle rapid mode changes", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ViewModeToggle mode="navigation" onChange={handleChange} />);

      const listButton = screen.getByText("List").closest("button");
      const readButton = screen.getByText("Read").closest("button");

      await user.click(listButton!);
      await user.click(readButton!);
      await user.click(listButton!);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });
  });
});
