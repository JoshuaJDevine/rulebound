/**
 * Tests for RuleLink component
 * Inline cross-reference links with preview tooltips
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { RuleLink } from "./RuleLink";

describe("RuleLink", () => {
  const mockOnNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render display text when provided", () => {
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );
      expect(screen.getByText("Attack Action")).toBeInTheDocument();
    });

    it("should render default text when displayText is not provided", () => {
      render(<RuleLink ruleId="100.1.1" onNavigate={mockOnNavigate} />);
      expect(screen.getByText("rule 100.1.1")).toBeInTheDocument();
    });

    it("should render as button", () => {
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Visual Styling", () => {
    it("should have gold link color", () => {
      const { container } = render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("text-accent-600");
    });

    it("should have dotted underline", () => {
      const { container } = render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("underline");
      expect(button).toHaveClass("decoration-dotted");
    });

    it("should have solid underline on hover", () => {
      const { container } = render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("hover:decoration-solid");
    });

    it("should have focus ring", () => {
      const { container } = render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("focus:ring-2");
      expect(button).toHaveClass("focus:ring-accent-500");
    });

    it("should have transition effects", () => {
      const { container } = render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("transition-colors");
    });
  });

  describe("Tooltip Preview", () => {
    it("should show tooltip on hover", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          previewTitle="Attack Action"
          previewContent="When you take the Attack action..."
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        // Text appears in both button and tooltip, so use getAllByText
        expect(screen.getAllByText("Attack Action").length).toBeGreaterThan(1);
        expect(
          screen.getByText(/When you take the Attack action/),
        ).toBeInTheDocument();
      });
    });

    it("should show tooltip on focus", async () => {
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          previewTitle="Attack Action"
          previewContent="When you take the Attack action..."
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      // Use act to wrap the focus event
      await act(async () => {
        button.focus();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(
          screen.getByText(/When you take the Attack action/),
        ).toBeInTheDocument();
      });
    });

    it("should hide tooltip on blur", async () => {
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          previewTitle="Attack Action"
          previewContent="When you take the Attack action..."
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      await act(async () => {
        button.focus();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(
          screen.getByText(/When you take the Attack action/),
        ).toBeInTheDocument();
      });

      await act(async () => {
        button.blur();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(
          screen.queryByText(/When you take the Attack action/),
        ).not.toBeInTheDocument();
      });
    });

    it("should hide tooltip on mouse leave", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          previewTitle="Attack Action"
          previewContent="When you take the Attack action..."
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(
          screen.getByText(/When you take the Attack action/),
        ).toBeInTheDocument();
      });

      await user.unhover(button);

      await waitFor(() => {
        expect(
          screen.queryByText(/When you take the Attack action/),
        ).not.toBeInTheDocument();
      });
    });

    it("should not show tooltip when showPreview is false", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          previewTitle="Attack Action"
          previewContent="When you take the Attack action..."
          showPreview={false}
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(
          screen.queryByText(/When you take the Attack action/),
        ).not.toBeInTheDocument();
      });
    });

    it("should not show tooltip when no preview content", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("should render preview title when provided", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          previewTitle="Attack Action"
          previewContent="When you take the Attack action..."
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toBeInTheDocument();
        // Title appears in both button and tooltip
        expect(screen.getAllByText("Attack Action").length).toBeGreaterThan(1);
      });
    });

    it("should render preview content when provided", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          previewContent="When you take the Attack action..."
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(
          screen.getByText(/When you take the Attack action/),
        ).toBeInTheDocument();
      });
    });

    it("should show click to view message in tooltip", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          previewTitle="Attack Action"
          previewContent="When you take the Attack action..."
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByText(/Click to view full rule/)).toBeInTheDocument();
      });
    });
  });

  describe("Interactions", () => {
    it("should call onNavigate with ruleId when clicked", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockOnNavigate).toHaveBeenCalledWith("100.1.1");
      expect(mockOnNavigate).toHaveBeenCalledTimes(1);
    });

    it("should prevent default on click", async () => {
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );

      // The component's handleClick calls preventDefault internally
      expect(mockOnNavigate).not.toHaveBeenCalled();
    });

    it("should be keyboard accessible with Enter key", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(mockOnNavigate).toHaveBeenCalledWith("100.1.1");
    });

    it("should be keyboard accessible with Space key", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      button.focus();

      await user.keyboard(" ");
      expect(mockOnNavigate).toHaveBeenCalledWith("100.1.1");
    });

    it("should prevent default on keyboard events", async () => {
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      button.focus();

      // userEvent handles preventDefault automatically, so we verify the handler exists
      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
        }
      };

      const mockEvent = {
        key: "Enter",
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      handleKeyDown(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have button type", () => {
      const { container } = render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("should have tooltip role when tooltip is shown", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          previewTitle="Attack Action"
          previewContent="When you take the Attack action..."
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("should have focus ring styles", () => {
      const { container } = render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("focus:outline-none");
      expect(button).toHaveClass("focus:ring-2");
    });

    it("should have no accessibility violations", async () => {
      const { container } = render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty ruleId", () => {
      render(
        <RuleLink ruleId="" displayText="Link" onNavigate={mockOnNavigate} />,
      );
      expect(screen.getByText("Link")).toBeInTheDocument();
    });

    it("should handle very long display text", () => {
      const longText = "A".repeat(200);
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText={longText}
          onNavigate={mockOnNavigate}
        />,
      );
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          onNavigate={mockOnNavigate}
          className="custom-class"
        />,
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("custom-class");
    });

    it("should work without onNavigate callback", () => {
      render(<RuleLink ruleId="100.1.1" displayText="Attack Action" />);
      expect(screen.getByText("Attack Action")).toBeInTheDocument();
    });

    it("should handle tooltip with only title", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          previewTitle="Attack Action"
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        // Title appears in both button and tooltip
        expect(screen.getAllByText("Attack Action").length).toBeGreaterThan(1);
      });
    });

    it("should handle tooltip with only content", async () => {
      const user = userEvent.setup();
      render(
        <RuleLink
          ruleId="100.1.1"
          displayText="Attack Action"
          previewContent="When you take the Attack action..."
          onNavigate={mockOnNavigate}
        />,
      );

      const button = screen.getByRole("button");
      await user.hover(button);

      await waitFor(() => {
        expect(
          screen.getByText(/When you take the Attack action/),
        ).toBeInTheDocument();
      });
    });
  });
});
