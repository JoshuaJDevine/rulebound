/**
 * Tests for AppLayout component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { axe } from "vitest-axe";
import { AppLayout } from "./AppLayout";

// Wrapper component for tests
function Wrapper({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe("AppLayout", () => {
  describe("Rendering", () => {
    it("should render children content", () => {
      render(
        <Wrapper>
          <AppLayout>
            <div data-testid="test-content">Test Content</div>
          </AppLayout>
        </Wrapper>,
      );
      expect(screen.getByTestId("test-content")).toBeInTheDocument();
    });

    it("should render SkipLink", () => {
      render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      expect(screen.getByText(/skip to main content/i)).toBeInTheDocument();
    });

    it("should render Header", () => {
      render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("should render main content area", () => {
      render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should render BottomNav", () => {
      render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      expect(
        screen.getByRole("navigation", { name: /primary navigation/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Structure", () => {
    it("should have correct component order", () => {
      const { container } = render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );

      const wrapper = container.firstChild as HTMLElement;
      const elements = Array.from(wrapper.children);

      // SkipLink should be first (hidden)
      expect(elements[0].tagName).toBe("A");
      // Header should be second
      expect(elements[1].tagName).toBe("HEADER");
      // Main should be third
      expect(elements[2].tagName).toBe("MAIN");
      // Nav (BottomNav) should be last
      expect(elements[3].tagName).toBe("NAV");
    });

    it("should have main content with correct id", () => {
      render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      const main = screen.getByRole("main");
      expect(main).toHaveAttribute("id", "main-content");
    });

    it("should have main content as focusable", () => {
      render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      const main = screen.getByRole("main");
      expect(main).toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("Styling", () => {
    it("should have full height layout", () => {
      const { container } = render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("min-h-screen");
      expect(wrapper).toHaveClass("flex");
      expect(wrapper).toHaveClass("flex-col");
    });

    it("should have background color", () => {
      const { container } = render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("bg-neutral-50");
    });

    it("should have main content flex-1", () => {
      render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      const main = screen.getByRole("main");
      expect(main).toHaveClass("flex-1");
    });

    it("should have responsive bottom padding on main", () => {
      render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      const main = screen.getByRole("main");
      expect(main).toHaveClass("pb-20"); // Mobile
      expect(main).toHaveClass("md:pb-8"); // Desktop
    });
  });

  describe("Accessibility", () => {
    it("should have proper landmarks", () => {
      render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      expect(screen.getByRole("banner")).toBeInTheDocument(); // header
      expect(screen.getByRole("main")).toBeInTheDocument(); // main
      // Multiple navigation elements (Header desktop nav + BottomNav)
      expect(screen.getAllByRole("navigation").length).toBeGreaterThan(0);
    });

    it("should have skip link as first element", () => {
      const { container } = render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      const wrapper = container.firstChild as HTMLElement;
      const firstElement = wrapper.children[0];
      expect(firstElement.tagName).toBe("A");
      expect(firstElement.textContent).toContain("Skip to main content");
    });

    it("should connect skip link to main content", () => {
      render(
        <Wrapper>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      const skipLink = screen.getByText(/skip to main content/i);
      const main = screen.getByRole("main");

      expect(skipLink).toHaveAttribute("href", "#main-content");
      expect(main).toHaveAttribute("id", "main-content");
    });

    it("should have no accessibility violations", async () => {
      const { container } = render(
        <Wrapper>
          <AppLayout>
            <div>Test content for accessibility check</div>
          </AppLayout>
        </Wrapper>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Content rendering", () => {
    it("should render multiple children", () => {
      render(
        <Wrapper>
          <AppLayout>
            <h1>Title</h1>
            <p>Paragraph</p>
            <div>Content</div>
          </AppLayout>
        </Wrapper>,
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Paragraph")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should render complex nested content", () => {
      render(
        <Wrapper>
          <AppLayout>
            <div>
              <section>
                <article>
                  <p>Nested content</p>
                </article>
              </section>
            </div>
          </AppLayout>
        </Wrapper>,
      );
      expect(screen.getByText("Nested content")).toBeInTheDocument();
    });
  });
});
