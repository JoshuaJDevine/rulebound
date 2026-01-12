/**
 * Tests for Header component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Header } from "./Header";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render logo with link to home", () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const logo = screen.getByRole("link", { name: /rule bound home/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("href", "/");
    });

    it("should render desktop navigation links", () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      expect(screen.getByRole("link", { name: /browse/i })).toBeInTheDocument();
      expect(
        screen.getAllByRole("link", { name: /bookmarks/i })[0],
      ).toBeInTheDocument();
    });

    it("should render desktop search input", () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      // Desktop search is hidden on mobile but present in DOM
      const searchInputs = screen.getAllByRole("searchbox");
      expect(searchInputs.length).toBeGreaterThan(0);
    });

    it("should render mobile search icon button", () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      expect(
        screen.getByRole("button", { name: /search rules/i }),
      ).toBeInTheDocument();
    });

    it("should render mobile bookmarks icon", () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      // There are two bookmarks links (desktop and mobile)
      const bookmarkLinks = screen.getAllByRole("link", { name: /bookmarks/i });
      expect(bookmarkLinks.length).toBeGreaterThan(1);
    });
  });

  describe("Navigation", () => {
    it("should link Browse to /rules", () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const browseLink = screen.getByRole("link", { name: /browse/i });
      expect(browseLink).toHaveAttribute("href", "/rules");
    });

    it("should link Bookmarks to /bookmarks", () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const bookmarkLinks = screen.getAllByRole("link", { name: /bookmarks/i });
      bookmarkLinks.forEach((link) => {
        expect(link).toHaveAttribute("href", "/bookmarks");
      });
    });

    it("should navigate to search page on mobile search icon click", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>,
      );

      await user.click(screen.getByRole("button", { name: /search rules/i }));
      expect(mockNavigate).toHaveBeenCalledWith("/search");
    });
  });

  describe("Search functionality", () => {
    it("should handle search input changes", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>,
      );

      const searchInput = screen.getAllByRole("searchbox")[0];
      await user.type(searchInput, "combat");

      expect(searchInput).toHaveValue("combat");
    });

    it("should navigate to search page with query", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>,
      );

      const searchInput = screen.getAllByRole("searchbox")[0];
      await user.type(searchInput, "test query");

      expect(mockNavigate).toHaveBeenCalledWith("/search?q=test%20query");
    });

    it("should encode search query in URL", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>,
      );

      const searchInput = screen.getAllByRole("searchbox")[0];
      await user.type(searchInput, "special & chars");

      expect(mockNavigate).toHaveBeenCalledWith(
        "/search?q=special%20%26%20chars",
      );
    });

    it("should not navigate with empty query", async () => {
      const user = userEvent.setup();
      mockNavigate.mockClear();

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>,
      );

      const searchInput = screen.getAllByRole("searchbox")[0];
      await user.type(searchInput, "   ");

      // Should not navigate with whitespace-only query
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should clear search input", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>,
      );

      const searchInput = screen.getAllByRole("searchbox")[0];
      await user.type(searchInput, "test");

      expect(searchInput).toHaveValue("test");

      // Find and click clear button
      const clearButton = screen.getByRole("button", { name: /clear search/i });
      await user.click(clearButton);

      expect(searchInput).toHaveValue("");
    });
  });

  describe("Styling", () => {
    it("should be sticky at top", () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const header = container.querySelector("header");
      expect(header).toHaveClass("sticky");
      expect(header).toHaveClass("top-0");
    });

    it("should have high z-index", () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const header = container.querySelector("header");
      expect(header).toHaveClass("z-50");
    });

    it("should have border bottom", () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const header = container.querySelector("header");
      expect(header).toHaveClass("border-b");
    });

    it("should have responsive height", () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const headerContent = container.querySelector(".h-14");
      expect(headerContent).toBeInTheDocument();
      expect(headerContent).toHaveClass("md:h-16");
    });
  });

  describe("Responsive behavior", () => {
    it("should hide desktop nav on mobile", () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const desktopNav = container.querySelector(".hidden.md\\:flex");
      expect(desktopNav).toBeInTheDocument();
    });

    it("should hide desktop search on mobile", () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const desktopSearch = container.querySelector(".hidden.md\\:block");
      expect(desktopSearch).toBeInTheDocument();
    });

    it("should show mobile icons", () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const mobileElements = container.querySelectorAll(".md\\:hidden");
      expect(mobileElements.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("should have banner role", () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("should have navigation landmark", () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      expect(
        screen.getByRole("navigation", { name: /main navigation/i }),
      ).toBeInTheDocument();
    });

    it("should have aria-label on logo link", () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const logo = screen.getByRole("link", { name: /rule bound home/i });
      expect(logo).toHaveAttribute("aria-label", "Rule Bound Home");
    });

    it("should have aria-label on mobile search button", () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      expect(
        screen.getByRole("button", { name: /search rules/i }),
      ).toBeInTheDocument();
    });

    it("should have aria-label on mobile bookmarks link", () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const mobileBookmark = screen
        .getAllByRole("link", { name: /bookmarks/i })
        .pop();
      expect(mobileBookmark).toHaveAttribute("aria-label", "Bookmarks");
    });

    it("should have focus styles on all interactive elements", () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const focusableElements = container.querySelectorAll("a, button");
      focusableElements.forEach((element) => {
        expect(element.className).toMatch(/focus:/);
      });
    });

    it("should have no accessibility violations", async () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
