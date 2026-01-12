/**
 * Tests for ErrorMessage component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ErrorMessage } from "./ErrorMessage";

describe("ErrorMessage", () => {
  describe("Rendering", () => {
    it("should render title and message", () => {
      render(
        <ErrorMessage
          title="Error Title"
          message="Error message description"
        />,
      );
      expect(screen.getByText("Error Title")).toBeInTheDocument();
      expect(screen.getByText("Error message description")).toBeInTheDocument();
    });

    it("should render error icon", () => {
      const { container } = render(
        <ErrorMessage title="Error" message="Message" />,
      );
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should not render retry button by default", () => {
      render(<ErrorMessage title="Error" message="Message" />);
      expect(
        screen.queryByRole("button", { name: /try again/i }),
      ).not.toBeInTheDocument();
    });

    it("should render retry button when retry function is provided", () => {
      render(<ErrorMessage title="Error" message="Message" retry={() => {}} />);
      expect(
        screen.getByRole("button", { name: /try again/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call retry function when button is clicked", async () => {
      const user = userEvent.setup();
      const handleRetry = vi.fn();

      render(
        <ErrorMessage title="Error" message="Message" retry={handleRetry} />,
      );

      await user.click(screen.getByRole("button", { name: /try again/i }));
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleRetry = vi.fn();

      render(
        <ErrorMessage title="Error" message="Message" retry={handleRetry} />,
      );

      const button = screen.getByRole("button", { name: /try again/i });
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it('should have role="alert"', () => {
      render(<ErrorMessage title="Error" message="Message" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it('should have aria-live="assertive"', () => {
      render(<ErrorMessage title="Error" message="Message" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("aria-live", "assertive");
    });

    it("should hide icon from screen readers", () => {
      const { container } = render(
        <ErrorMessage title="Error" message="Message" />,
      );
      const iconWrapper = container.querySelector(".text-error-600");
      expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
    });

    it("should have no accessibility violations (without retry)", async () => {
      const { container } = render(
        <ErrorMessage
          title="Error occurred"
          message="Please try again later"
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations (with retry)", async () => {
      const { container } = render(
        <ErrorMessage
          title="Error occurred"
          message="Please try again later"
          retry={() => {}}
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Visual styling", () => {
    it("should have error color scheme", () => {
      render(<ErrorMessage title="Error" message="Message" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("bg-error-50");
      expect(alert).toHaveClass("border-error-200");
    });

    it("should have proper text hierarchy", () => {
      render(<ErrorMessage title="Error Title" message="Error message" />);
      const title = screen.getByText("Error Title");
      expect(title.tagName).toBe("H3");
      expect(title).toHaveClass("font-semibold");
    });
  });
});
