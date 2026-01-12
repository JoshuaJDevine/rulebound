/**
 * Tests for Breadcrumb component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";

describe("Breadcrumb", () => {
  const items: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Section", href: "/section" },
    { label: "Current Page" },
  ];

  describe("Rendering", () => {
    it("should render all breadcrumb items", () => {
      render(<Breadcrumb items={items} />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Section")).toBeInTheDocument();
      expect(screen.getByText("Current Page")).toBeInTheDocument();
    });

    it("should render links for items with href", () => {
      render(<Breadcrumb items={items} />);
      expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
        "href",
        "/",
      );
      expect(screen.getByRole("link", { name: "Section" })).toHaveAttribute(
        "href",
        "/section",
      );
    });

    it("should render current page as text without link", () => {
      render(<Breadcrumb items={items} />);
      const currentPage = screen.getByText("Current Page");
      expect(currentPage.tagName).toBe("SPAN");
      expect(currentPage).not.toHaveAttribute("href");
    });

    it("should render default separator between items", () => {
      const { container } = render(<Breadcrumb items={items} />);
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      expect(separators.length).toBe(2); // One less than number of items
    });

    it("should render custom separator", () => {
      render(<Breadcrumb items={items} separator=">" />);
      expect(screen.getAllByText(">")).toHaveLength(2);
    });

    it("should handle single item", () => {
      const singleItem: BreadcrumbItem[] = [{ label: "Only Item" }];
      const { container } = render(<Breadcrumb items={singleItem} />);
      expect(screen.getByText("Only Item")).toBeInTheDocument();
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      expect(separators.length).toBe(0);
    });

    it("should handle empty items array", () => {
      const { container } = render(<Breadcrumb items={[]} />);
      const list = container.querySelector("ol");
      expect(list?.children.length).toBe(0);
    });
  });

  describe("Styling", () => {
    it("should style current page differently", () => {
      render(<Breadcrumb items={items} />);
      const currentPage = screen.getByText("Current Page");
      expect(currentPage).toHaveClass("text-neutral-900");
      expect(currentPage).toHaveClass("font-medium");
    });

    it("should style links with primary color", () => {
      render(<Breadcrumb items={items} />);
      const homeLink = screen.getByRole("link", { name: "Home" });
      expect(homeLink).toHaveClass("text-primary-600");
    });

    it("should have hover styles for links", () => {
      render(<Breadcrumb items={items} />);
      const homeLink = screen.getByRole("link", { name: "Home" });
      expect(homeLink).toHaveClass("hover:text-primary-700");
      expect(homeLink).toHaveClass("hover:underline");
    });

    it("should have focus styles for links", () => {
      render(<Breadcrumb items={items} />);
      const homeLink = screen.getByRole("link", { name: "Home" });
      expect(homeLink).toHaveClass("focus:ring-2");
      expect(homeLink).toHaveClass("focus:outline-none");
    });
  });

  describe("Accessibility", () => {
    it("should have navigation landmark", () => {
      render(<Breadcrumb items={items} />);
      expect(
        screen.getByRole("navigation", { name: "Breadcrumb" }),
      ).toBeInTheDocument();
    });

    it("should use ordered list", () => {
      const { container } = render(<Breadcrumb items={items} />);
      expect(container.querySelector("ol")).toBeInTheDocument();
    });

    it("should hide separators from screen readers", () => {
      const { container } = render(<Breadcrumb items={items} />);
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      separators.forEach((separator) => {
        expect(separator).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("should have no accessibility violations", async () => {
      const { container } = render(<Breadcrumb items={items} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations (all links)", async () => {
      const allLinks: BreadcrumbItem[] = [
        { label: "Home", href: "/" },
        { label: "Section", href: "/section" },
        { label: "Subsection", href: "/section/subsection" },
      ];
      const { container } = render(<Breadcrumb items={allLinks} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Navigation structure", () => {
    it("should maintain correct order", () => {
      const { container } = render(<Breadcrumb items={items} />);
      const listItems = container.querySelectorAll("li");
      expect(listItems[0]).toHaveTextContent("Home");
      expect(listItems[1]).toHaveTextContent("Section");
      expect(listItems[2]).toHaveTextContent("Current Page");
    });

    it("should support complex paths", () => {
      const complexItems: BreadcrumbItem[] = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings", href: "/dashboard/settings" },
        { label: "Profile", href: "/dashboard/settings/profile" },
        { label: "Edit Email" },
      ];
      render(<Breadcrumb items={complexItems} />);
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Edit Email")).toBeInTheDocument();
    });
  });
});
