/**
 * Tests for EmptyState component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  const defaultProps = {
    icon: "📭",
    title: "No items found",
    description: "There are no items to display at this time.",
  };

  describe("Rendering", () => {
    it("should render icon", () => {
      render(<EmptyState {...defaultProps} />);
      expect(screen.getByText("📭")).toBeInTheDocument();
    });

    it("should render title", () => {
      render(<EmptyState {...defaultProps} />);
      expect(screen.getByText("No items found")).toBeInTheDocument();
    });

    it("should render description", () => {
      render(<EmptyState {...defaultProps} />);
      expect(
        screen.getByText("There are no items to display at this time."),
      ).toBeInTheDocument();
    });

    it("should not render action button by default", () => {
      render(<EmptyState {...defaultProps} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should render action button when provided", () => {
      const action = {
        label: "Add Item",
        onClick: vi.fn(),
      };
      render(<EmptyState {...defaultProps} action={action} />);
      expect(
        screen.getByRole("button", { name: "Add Item" }),
      ).toBeInTheDocument();
    });

    it("should render custom icon component", () => {
      const customIcon = <div data-testid="custom-icon">Custom</div>;
      render(<EmptyState {...defaultProps} icon={customIcon} />);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call action onClick when button is clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const action = {
        label: "Take Action",
        onClick: handleClick,
      };

      render(<EmptyState {...defaultProps} action={action} />);

      await user.click(screen.getByRole("button", { name: "Take Action" }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const action = {
        label: "Keyboard Action",
        onClick: handleClick,
      };

      render(<EmptyState {...defaultProps} action={action} />);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Styling", () => {
    it("should be centered", () => {
      const { container } = render(<EmptyState {...defaultProps} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("flex");
      expect(wrapper).toHaveClass("flex-col");
      expect(wrapper).toHaveClass("items-center");
      expect(wrapper).toHaveClass("justify-center");
      expect(wrapper).toHaveClass("text-center");
    });

    it("should have proper spacing", () => {
      const { container } = render(<EmptyState {...defaultProps} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("py-12");
      expect(wrapper).toHaveClass("px-4");
    });

    it("should style icon appropriately", () => {
      const { container } = render(<EmptyState {...defaultProps} />);
      const iconWrapper = container.querySelector(".text-6xl");
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass("mb-4");
    });

    it("should have proper heading styles", () => {
      render(<EmptyState {...defaultProps} />);
      const heading = screen.getByText("No items found");
      expect(heading).toHaveClass("text-xl");
      expect(heading).toHaveClass("font-semibold");
    });

    it("should constrain description width", () => {
      render(<EmptyState {...defaultProps} />);
      const description = screen.getByText(
        "There are no items to display at this time.",
      );
      expect(description).toHaveClass("max-w-sm");
    });
  });

  describe("Accessibility", () => {
    it("should use proper heading tag", () => {
      render(<EmptyState {...defaultProps} />);
      const heading = screen.getByText("No items found");
      expect(heading.tagName).toBe("H2");
    });

    it("should hide icon from screen readers", () => {
      const { container } = render(<EmptyState {...defaultProps} />);
      const iconWrapper = container.querySelector(".text-6xl");
      expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
    });

    it("should have no accessibility violations (without action)", async () => {
      const { container } = render(<EmptyState {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations (with action)", async () => {
      const action = {
        label: "Add Item",
        onClick: vi.fn(),
      };
      const { container } = render(
        <EmptyState {...defaultProps} action={action} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Different scenarios", () => {
    it("should render bookmarks empty state", () => {
      render(
        <EmptyState
          icon="🔖"
          title="No bookmarks yet"
          description="Start bookmarking rules to find them easily later."
          action={{
            label: "Browse Rules",
            onClick: vi.fn(),
          }}
        />,
      );
      expect(screen.getByText("No bookmarks yet")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Browse Rules" }),
      ).toBeInTheDocument();
    });

    it("should render search empty state", () => {
      render(
        <EmptyState
          icon="🔍"
          title="No results found"
          description="Try adjusting your search terms."
        />,
      );
      expect(screen.getByText("No results found")).toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should render error empty state", () => {
      render(
        <EmptyState
          icon="⚠️"
          title="Something went wrong"
          description="We couldn't load the content. Please try again."
          action={{
            label: "Retry",
            onClick: vi.fn(),
          }}
        />,
      );
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle very long titles", () => {
      const longTitle =
        "This is a very long title that might wrap to multiple lines";
      render(<EmptyState {...defaultProps} title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle very long descriptions", () => {
      const longDescription =
        "This is a very long description that provides detailed information about why there is no content available and what the user might want to do about it.";
      render(<EmptyState {...defaultProps} description={longDescription} />);
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it("should handle empty strings", () => {
      render(<EmptyState icon="" title="" description="" />);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveTextContent("");
    });
  });
});
