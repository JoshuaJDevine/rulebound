/**
 * Tests for LoadingSpinner component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { LoadingSpinner } from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  describe("Rendering", () => {
    it("should render with default props", () => {
      render(<LoadingSpinner />);
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("Loading")).toBeInTheDocument();
    });

    it("should render with custom label", () => {
      render(<LoadingSpinner label="Please wait..." />);
      expect(screen.getByText("Please wait...")).toBeInTheDocument();
    });

    it("should have spinner element", () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Sizes", () => {
    it("should render small size", () => {
      const { container } = render(<LoadingSpinner size="sm" />);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toHaveClass("h-6");
      expect(spinner).toHaveClass("w-6");
    });

    it("should render medium size by default", () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toHaveClass("h-10");
      expect(spinner).toHaveClass("w-10");
    });

    it("should render large size", () => {
      const { container } = render(<LoadingSpinner size="lg" />);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toHaveClass("h-16");
      expect(spinner).toHaveClass("w-16");
    });
  });

  describe("Variants", () => {
    it("should render inline variant by default", () => {
      const { container } = render(<LoadingSpinner />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveClass("min-h-screen");
    });

    it("should render page variant", () => {
      const { container } = render(<LoadingSpinner variant="page" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("min-h-screen");
    });
  });

  describe("Accessibility", () => {
    it('should have role="status"', () => {
      render(<LoadingSpinner />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it('should have aria-live="polite"', () => {
      render(<LoadingSpinner />);
      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("aria-live", "polite");
    });

    it("should have aria-label", () => {
      render(<LoadingSpinner label="Loading content" />);
      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("aria-label", "Loading content");
    });

    it("should have visually hidden text for screen readers", () => {
      render(<LoadingSpinner label="Loading data" />);
      const srText = screen.getByText("Loading data");
      expect(srText).toHaveClass("sr-only");
    });

    it("should have no accessibility violations (inline)", async () => {
      const { container } = render(<LoadingSpinner variant="inline" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations (page)", async () => {
      const { container } = render(<LoadingSpinner variant="page" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Visual styling", () => {
    it("should have correct spinner colors", () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toHaveClass("border-neutral-200");
      expect(spinner).toHaveClass("border-t-primary-600");
    });

    it("should be centered", () => {
      const { container } = render(<LoadingSpinner />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("flex");
      expect(wrapper).toHaveClass("items-center");
      expect(wrapper).toHaveClass("justify-center");
    });
  });
});
