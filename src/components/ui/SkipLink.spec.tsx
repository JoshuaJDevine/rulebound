/**
 * Tests for SkipLink component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  describe("Rendering", () => {
    it("should render with default label", () => {
      render(<SkipLink targetId="main-content" />);
      expect(screen.getByText("Skip to main content")).toBeInTheDocument();
    });

    it("should render with custom label", () => {
      render(<SkipLink targetId="main" label="Skip to content" />);
      expect(screen.getByText("Skip to content")).toBeInTheDocument();
    });

    it("should have correct href", () => {
      render(<SkipLink targetId="main-content" />);
      const link = screen.getByText("Skip to main content");
      expect(link).toHaveAttribute("href", "#main-content");
    });

    it("should handle different target IDs", () => {
      render(<SkipLink targetId="custom-target" />);
      const link = screen.getByText("Skip to main content");
      expect(link).toHaveAttribute("href", "#custom-target");
    });
  });

  describe("Visibility", () => {
    it("should be visually hidden by default", () => {
      render(<SkipLink targetId="main" />);
      const link = screen.getByText("Skip to main content");
      expect(link).toHaveClass("sr-only");
    });

    it("should be visible on focus", () => {
      render(<SkipLink targetId="main" />);
      const link = screen.getByText("Skip to main content");
      expect(link).toHaveClass("focus:not-sr-only");
      expect(link).toHaveClass("focus:absolute");
    });

    it("should have positioning styles on focus", () => {
      render(<SkipLink targetId="main" />);
      const link = screen.getByText("Skip to main content");
      expect(link).toHaveClass("focus:top-4");
      expect(link).toHaveClass("focus:left-4");
      expect(link).toHaveClass("focus:z-50");
    });
  });

  describe("Styling", () => {
    it("should have proper focus styles", () => {
      render(<SkipLink targetId="main" />);
      const link = screen.getByText("Skip to main content");
      expect(link).toHaveClass("focus:bg-primary-600");
      expect(link).toHaveClass("focus:text-white");
      expect(link).toHaveClass("focus:rounded-md");
      expect(link).toHaveClass("focus:shadow-lg");
    });

    it("should have focus ring", () => {
      render(<SkipLink targetId="main" />);
      const link = screen.getByText("Skip to main content");
      expect(link).toHaveClass("focus:ring-4");
      expect(link).toHaveClass("focus:ring-primary-500/50");
    });

    it("should have padding on focus", () => {
      render(<SkipLink targetId="main" />);
      const link = screen.getByText("Skip to main content");
      expect(link).toHaveClass("focus:px-4");
      expect(link).toHaveClass("focus:py-2");
    });
  });

  describe("Accessibility", () => {
    it("should be a link element", () => {
      render(<SkipLink targetId="main" />);
      const link = screen.getByRole("link", { name: /skip to main content/i });
      expect(link).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      render(<SkipLink targetId="main" />);
      const link = screen.getByRole("link");
      link.focus();
      expect(link).toHaveFocus();
    });

    it("should have no accessibility violations", async () => {
      const { container } = render(
        <>
          <SkipLink targetId="main-content" />
          <main id="main-content">Main content here</main>
        </>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("WCAG compliance", () => {
    it("should satisfy WCAG 2.4.1 (Bypass Blocks)", () => {
      render(
        <>
          <SkipLink targetId="main" />
          <nav>Navigation...</nav>
          <main id="main">Main content</main>
        </>,
      );
      const link = screen.getByRole("link", { name: /skip to main content/i });
      expect(link).toHaveAttribute("href", "#main");
    });

    it("should be first focusable element (semantic ordering)", () => {
      const { container } = render(
        <>
          <SkipLink targetId="main" />
          <button>Other button</button>
          <main id="main">Content</main>
        </>,
      );

      const skipLink = screen.getByRole("link", {
        name: /skip to main content/i,
      });
      const firstElement = container.querySelector("a");
      expect(firstElement).toBe(skipLink);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty target ID gracefully", () => {
      render(<SkipLink targetId="" />);
      const link = screen.getByText("Skip to main content");
      expect(link).toHaveAttribute("href", "#");
    });

    it("should handle special characters in target ID", () => {
      render(<SkipLink targetId="main-content-123" />);
      const link = screen.getByText("Skip to main content");
      expect(link).toHaveAttribute("href", "#main-content-123");
    });
  });
});
