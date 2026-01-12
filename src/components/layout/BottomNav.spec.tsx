/**
 * Tests for BottomNav component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { axe } from "vitest-axe";
import { BottomNav } from "./BottomNav";

function renderWithRouter(initialRoute = "/") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <BottomNav />
    </MemoryRouter>,
  );
}

describe("BottomNav", () => {
  describe("Rendering", () => {
    it("should render all navigation items", () => {
      renderWithRouter();
      expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /browse/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /saved/i })).toBeInTheDocument();
    });

    it("should render icons for each nav item", () => {
      const { container } = renderWithRouter();
      const svgElements = container.querySelectorAll("svg");
      expect(svgElements.length).toBe(3); // One for each nav item
    });

    it("should render text labels", () => {
      renderWithRouter();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Browse")).toBeInTheDocument();
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });

    it("should have correct navigation paths", () => {
      renderWithRouter();
      expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
        "href",
        "/",
      );
      expect(screen.getByRole("link", { name: /browse/i })).toHaveAttribute(
        "href",
        "/rules",
      );
      expect(screen.getByRole("link", { name: /saved/i })).toHaveAttribute(
        "href",
        "/bookmarks",
      );
    });
  });

  describe("Active state", () => {
    it("should highlight active route (home)", () => {
      renderWithRouter("/");
      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toHaveClass("text-primary-600");
      expect(homeLink).toHaveClass("font-semibold");
      expect(homeLink).toHaveAttribute("aria-current", "page");
    });

    it("should highlight active route (browse)", () => {
      renderWithRouter("/rules");
      const browseLink = screen.getByRole("link", { name: /browse/i });
      expect(browseLink).toHaveClass("text-primary-600");
      expect(browseLink).toHaveClass("font-semibold");
      expect(browseLink).toHaveAttribute("aria-current", "page");
    });

    it("should highlight active route (saved)", () => {
      renderWithRouter("/bookmarks");
      const savedLink = screen.getByRole("link", { name: /saved/i });
      expect(savedLink).toHaveClass("text-primary-600");
      expect(savedLink).toHaveClass("font-semibold");
      expect(savedLink).toHaveAttribute("aria-current", "page");
    });

    it("should not highlight inactive routes", () => {
      renderWithRouter("/rules");
      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toHaveClass("text-neutral-500");
      expect(homeLink).not.toHaveAttribute("aria-current");
    });

    it("should handle nested routes (not highlight parent)", () => {
      renderWithRouter("/rules/rule-1");
      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).not.toHaveAttribute("aria-current", "page");
    });
  });

  describe("Styling", () => {
    it("should be fixed at bottom", () => {
      const { container } = renderWithRouter();
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("fixed");
      expect(nav).toHaveClass("bottom-0");
      expect(nav).toHaveClass("left-0");
      expect(nav).toHaveClass("right-0");
    });

    it("should be hidden on desktop", () => {
      const { container } = renderWithRouter();
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("md:hidden");
    });

    it("should have proper z-index", () => {
      const { container } = renderWithRouter();
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("z-40");
    });

    it("should have border top", () => {
      const { container } = renderWithRouter();
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("border-t");
    });

    it("should use grid layout", () => {
      const { container } = renderWithRouter();
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("grid-cols-3");
    });

    it("should have proper height", () => {
      const { container } = renderWithRouter();
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("h-16");
    });
  });

  describe("Visual feedback", () => {
    it("should have hover styles on inactive items", () => {
      renderWithRouter("/");
      const browseLink = screen.getByRole("link", { name: /browse/i });
      expect(browseLink).toHaveClass("hover:text-neutral-700");
    });

    it("should have transition effects", () => {
      renderWithRouter();
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveClass("transition-colors");
      });
    });

    it("should center content in each nav item", () => {
      renderWithRouter();
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveClass("flex");
        expect(link).toHaveClass("flex-col");
        expect(link).toHaveClass("items-center");
        expect(link).toHaveClass("justify-center");
      });
    });
  });

  describe("Accessibility", () => {
    it("should have navigation landmark", () => {
      renderWithRouter();
      expect(
        screen.getByRole("navigation", { name: /primary navigation/i }),
      ).toBeInTheDocument();
    });

    it("should hide icons from screen readers", () => {
      const { container } = renderWithRouter();
      const iconWrappers = container.querySelectorAll('[aria-hidden="true"]');
      expect(iconWrappers.length).toBe(3);
    });

    it("should have visible text labels", () => {
      renderWithRouter();
      const labels = ["Home", "Browse", "Saved"];
      labels.forEach((label) => {
        const textElement = screen.getByText(label);
        expect(textElement).toBeInTheDocument();
        expect(textElement).not.toHaveClass("sr-only");
      });
    });

    it("should have focus styles", () => {
      renderWithRouter();
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveClass("focus:ring-4");
        expect(link).toHaveClass("focus:outline-none");
      });
    });

    it("should use aria-current for active page", () => {
      renderWithRouter("/rules");
      const browseLink = screen.getByRole("link", { name: /browse/i });
      expect(browseLink).toHaveAttribute("aria-current", "page");
    });

    it("should not use aria-current on inactive pages", () => {
      renderWithRouter("/rules");
      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).not.toHaveAttribute("aria-current");
    });

    it("should have no accessibility violations", async () => {
      const { container } = renderWithRouter();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Touch targets", () => {
    it("should have adequate touch target size", () => {
      const { container } = renderWithRouter();
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("h-16"); // 64px height, adequate for touch
    });

    it("should fill entire column width", () => {
      renderWithRouter();
      const links = screen.getAllByRole("link");
      // Links should fill their grid columns (implicitly through flex)
      links.forEach((link) => {
        expect(link).toHaveClass("flex");
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle unknown routes", () => {
      renderWithRouter("/unknown-route");
      const links = screen.getAllByRole("link");
      // No nav item should be active for unknown route
      links.forEach((link) => {
        expect(link).not.toHaveAttribute("aria-current", "page");
      });
    });

    it("should handle root path explicitly", () => {
      renderWithRouter("/");
      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toHaveAttribute("aria-current", "page");
    });
  });

  describe("Mobile-specific behavior", () => {
    it("should only show on mobile screens", () => {
      const { container } = renderWithRouter();
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("md:hidden");
    });

    it("should have white background", () => {
      const { container } = renderWithRouter();
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("bg-white");
    });

    it("should be positioned above page content", () => {
      const { container } = renderWithRouter();
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("z-40");
    });
  });
});
