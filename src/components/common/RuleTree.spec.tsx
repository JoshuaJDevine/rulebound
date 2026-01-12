/**
 * Tests for RuleTree component
 * Tests hierarchical tree navigation with keyboard support
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { BrowserRouter } from "react-router-dom";
import { RuleTree } from "./RuleTree";
import type { RuleSection } from "@/types";

// Helper to wrap component with router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("RuleTree", () => {
  // Mock rule hierarchy
  const mockRules: RuleSection[] = [
    {
      id: "100",
      number: "100.",
      title: "Combat",
      content: "Combat rules",
      level: 0,
      children: ["100.1", "100.2"],
      crossRefs: [],
      version: "1.2",
    },
    {
      id: "100.1",
      number: "100.1.",
      title: "Initiative",
      content: "Initiative rules",
      level: 1,
      parentId: "100",
      children: ["100.1.a"],
      crossRefs: [],
      version: "1.2",
    },
    {
      id: "100.1.a",
      number: "100.1.a.",
      title: "Rolling Initiative",
      content: "How to roll initiative",
      level: 2,
      parentId: "100.1",
      children: [],
      crossRefs: [],
      version: "1.2",
    },
    {
      id: "100.2",
      number: "100.2.",
      title: "Attack Resolution",
      content: "How to resolve attacks",
      level: 1,
      parentId: "100",
      children: [],
      crossRefs: [],
      version: "1.2",
    },
    {
      id: "200",
      number: "200.",
      title: "Movement",
      content: "Movement rules",
      level: 0,
      children: [],
      crossRefs: [],
      version: "1.2",
    },
  ];

  let rulesMap: Map<string, RuleSection>;

  beforeEach(() => {
    rulesMap = new Map(mockRules.map((r) => [r.id, r]));
  });

  describe("Rendering", () => {
    it("should render tree with all top-level sections", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      expect(screen.getByText("Combat")).toBeInTheDocument();
      expect(screen.getByText("Movement")).toBeInTheDocument();
    });

    it("should render tree from specific root rule", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} rootRuleId="100" />);
      expect(screen.getByText("Combat")).toBeInTheDocument();
      expect(screen.queryByText("Movement")).not.toBeInTheDocument();
    });

    it("should render rule numbers", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      expect(screen.getByText("100.")).toBeInTheDocument();
      expect(screen.getByText("200.")).toBeInTheDocument();
    });

    it("should render navigation heading", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      expect(screen.getByText("Rules Navigation")).toBeInTheDocument();
    });

    it("should return null for empty rules map", () => {
      const emptyMap = new Map<string, RuleSection>();
      const { container } = renderWithRouter(<RuleTree rulesMap={emptyMap} />);
      expect(container.firstChild).toBeNull();
    });

    it("should expand root rules by default", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      // Children should be visible
      expect(screen.getByText("Initiative")).toBeInTheDocument();
      expect(screen.getByText("Attack Resolution")).toBeInTheDocument();
    });
  });

  describe("Expand/Collapse", () => {
    it("should show expand button for rules with children", async () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);

      const expandButtons = screen.getAllByRole("button", {
        name: /Expand|Collapse/,
      });
      expect(expandButtons.length).toBeGreaterThan(0);
    });

    it("should show bullet point for rules without children", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const movement = screen.getByText("Movement").closest("li");
      const bullet = within(movement!).getByText("•");
      expect(bullet).toBeInTheDocument();
    });

    it("should collapse children when expand button clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);

      // Initially expanded
      expect(screen.getByText("Initiative")).toBeInTheDocument();

      // Find and click the collapse button for Combat
      const collapseButton = screen.getByRole("button", {
        name: /Collapse Combat/,
      });
      await user.click(collapseButton);

      // Children should be hidden
      expect(screen.queryByText("Initiative")).not.toBeInTheDocument();
    });

    it("should expand children when expand button clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);

      // Collapse first
      const collapseButton = screen.getByRole("button", {
        name: /Collapse Combat/,
      });
      await user.click(collapseButton);
      expect(screen.queryByText("Initiative")).not.toBeInTheDocument();

      // Then expand
      const expandButton = screen.getByRole("button", {
        name: /Expand Combat/,
      });
      await user.click(expandButton);
      expect(screen.getByText("Initiative")).toBeInTheDocument();
    });

    it("should expand nested children", async () => {
      const user = userEvent.setup();
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);

      // Expand Initiative to see Rolling Initiative
      const expandInitiative = screen.getByRole("button", {
        name: /Expand Initiative/,
      });
      await user.click(expandInitiative);

      expect(screen.getByText("Rolling Initiative")).toBeInTheDocument();
    });
  });

  describe("Selection and Navigation", () => {
    it("should highlight current rule", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} currentRuleId="100.1" />);

      const initiativeButton = screen.getByText("Initiative").closest("button");
      expect(initiativeButton).toHaveClass("bg-primary-200");
      expect(initiativeButton).toHaveClass("font-bold");
    });

    it("should call onNavigate when rule clicked", async () => {
      const user = userEvent.setup();
      const handleNavigate = vi.fn();

      renderWithRouter(
        <RuleTree rulesMap={rulesMap} onNavigate={handleNavigate} />,
      );

      const combatButton = screen.getByText("Combat").closest("button");
      await user.click(combatButton!);

      expect(handleNavigate).toHaveBeenCalledWith("100");
    });

    it("should set aria-current on selected rule", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} currentRuleId="100" />);

      const combatButton = screen.getByText("Combat").closest("button");
      expect(combatButton).toHaveAttribute("aria-current", "page");
    });

    it("should not set aria-current on non-selected rules", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} currentRuleId="100" />);

      const movementButton = screen.getByText("Movement").closest("button");
      expect(movementButton).not.toHaveAttribute("aria-current");
    });
  });

  describe("Keyboard Navigation", () => {
    it("should toggle expand/collapse with Space key", async () => {
      const user = userEvent.setup();
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);

      const expandButton = screen.getByRole("button", {
        name: /Collapse Combat/,
      });
      expandButton.focus();
      await user.keyboard(" ");

      expect(screen.queryByText("Initiative")).not.toBeInTheDocument();
    });

    it("should toggle expand/collapse with Enter key", async () => {
      const user = userEvent.setup();
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);

      const expandButton = screen.getByRole("button", {
        name: /Collapse Combat/,
      });
      expandButton.focus();
      await user.keyboard("{Enter}");

      expect(screen.queryByText("Initiative")).not.toBeInTheDocument();
    });

    it("should expand with ArrowRight key when collapsed", async () => {
      const user = userEvent.setup();
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);

      // Collapse first
      const collapseButton = screen.getByRole("button", {
        name: /Collapse Combat/,
      });
      await user.click(collapseButton);

      // Now expand with keyboard
      const expandButton = screen.getByRole("button", {
        name: /Expand Combat/,
      });
      expandButton.focus();
      await user.keyboard("{ArrowRight}");

      expect(screen.getByText("Initiative")).toBeInTheDocument();
    });

    it("should collapse with ArrowLeft key when expanded", async () => {
      const user = userEvent.setup();
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);

      const collapseButton = screen.getByRole("button", {
        name: /Collapse Combat/,
      });
      collapseButton.focus();
      await user.keyboard("{ArrowLeft}");

      expect(screen.queryByText("Initiative")).not.toBeInTheDocument();
    });
  });

  describe("Auto-expand to Current Rule", () => {
    it("should auto-expand path to current rule", () => {
      renderWithRouter(
        <RuleTree rulesMap={rulesMap} currentRuleId="100.1.a" />,
      );

      // All parents should be expanded
      expect(screen.getByText("Combat")).toBeInTheDocument();
      expect(screen.getByText("Initiative")).toBeInTheDocument();
      expect(screen.getByText("Rolling Initiative")).toBeInTheDocument();
    });

    it("should highlight deeply nested current rule", () => {
      renderWithRouter(
        <RuleTree rulesMap={rulesMap} currentRuleId="100.1.a" />,
      );

      const rollingInitiativeButton = screen
        .getByText("Rolling Initiative")
        .closest("button");
      expect(rollingInitiativeButton).toHaveClass("bg-primary-200");
    });
  });

  describe("Max Depth", () => {
    it("should limit tree depth when maxDepth is set", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} maxDepth={1} />);

      // Level 0 should be visible
      expect(screen.getByText("Combat")).toBeInTheDocument();
      // Level 1 should be visible
      expect(screen.getByText("Initiative")).toBeInTheDocument();

      // Try to expand Initiative
      const expandInitiative = screen.queryByRole("button", {
        name: /Expand Initiative/,
      });
      // Should not have expand button because we're at maxDepth
      expect(expandInitiative).not.toBeInTheDocument();
    });

    it("should show all levels when maxDepth is undefined", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);

      // Expand all the way down
      const expandInitiative = screen.getByRole("button", {
        name: /Expand Initiative/,
      });
      expect(expandInitiative).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have tree role", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const tree = screen.getByRole("tree");
      expect(tree).toBeInTheDocument();
    });

    it("should have treeitem roles for all nodes", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const treeitems = screen.getAllByRole("treeitem");
      expect(treeitems.length).toBeGreaterThan(0);
    });

    it("should set aria-expanded on expandable nodes", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const combatItem = screen.getByText("Combat").closest("li");
      expect(combatItem).toHaveAttribute("aria-expanded", "true");
    });

    it("should not set aria-expanded on leaf nodes", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const movementItem = screen.getByText("Movement").closest("li");
      expect(movementItem).not.toHaveAttribute("aria-expanded");
    });

    it("should set aria-level on all nodes", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const combatItem = screen.getByText("Combat").closest("li");
      expect(combatItem).toHaveAttribute("aria-level", "1");

      const initiativeItem = screen.getByText("Initiative").closest("li");
      expect(initiativeItem).toHaveAttribute("aria-level", "2");
    });

    it("should set aria-selected on selected node", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} currentRuleId="100" />);
      const combatItem = screen.getByText("Combat").closest("li");
      expect(combatItem).toHaveAttribute("aria-selected", "true");
    });

    it("should have aria-label on tree items", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const combatItem = screen.getByLabelText("100. Combat");
      expect(combatItem).toBeInTheDocument();
    });

    it("should have aria-label on navigation", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const nav = screen.getByLabelText("Rule hierarchy navigation");
      expect(nav).toBeInTheDocument();
    });

    it("should have proper button types", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });

    it("should have focus ring styles", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const combatButton = screen.getByText("Combat").closest("button");
      expect(combatButton).toHaveClass("focus:ring-2");
      expect(combatButton).toHaveClass("focus:outline-none");
    });

    it("should implement roving tabindex for selected item", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} currentRuleId="100" />);
      const combatButton = screen.getByText("Combat").closest("button");
      expect(combatButton).toHaveAttribute("tabIndex", "0");

      const movementButton = screen.getByText("Movement").closest("button");
      expect(movementButton).toHaveAttribute("tabIndex", "-1");
    });

    it("should hide decorative icons from screen readers", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const tree = screen.getByRole("tree");
      const icons = tree.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should have no accessibility violations", async () => {
      const { container } = renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Styling", () => {
    it("should apply indentation based on level", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const initiativeItem = screen.getByText("Initiative").closest("li");
      // Find the indent div by aria-hidden attribute
      const indent = initiativeItem!.querySelector(
        '[aria-hidden="true"].flex-shrink-0',
      );
      expect(indent).toHaveStyle({ width: "16px" }); // Level 1 = 16px
    });

    it("should have hover styles on rule buttons", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const combatButton = screen.getByText("Combat").closest("button");
      expect(combatButton).toHaveClass("hover:bg-primary-50");
    });

    it("should accept custom className", () => {
      const { container } = renderWithRouter(
        <RuleTree rulesMap={rulesMap} className="custom-class" />,
      );
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("custom-class");
    });

    it("should have scrollable container for long trees", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const treeContainer = screen.getByRole("tree");
      expect(treeContainer).toHaveClass("max-h-[600px]");
      expect(treeContainer).toHaveClass("overflow-y-auto");
    });
  });

  describe("Edge Cases", () => {
    it("should handle rule with no children gracefully", () => {
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);
      const movementButton = screen.getByText("Movement");
      expect(movementButton).toBeInTheDocument();
    });

    it("should handle non-existent rootRuleId", () => {
      const { container } = renderWithRouter(
        <RuleTree rulesMap={rulesMap} rootRuleId="non-existent" />,
      );
      expect(container.firstChild).toBeNull();
    });

    it("should handle non-existent currentRuleId", () => {
      renderWithRouter(
        <RuleTree rulesMap={rulesMap} currentRuleId="non-existent" />,
      );
      // Should render without errors
      expect(screen.getByText("Combat")).toBeInTheDocument();
    });

    it("should sort rules by number", () => {
      // Create rules with out-of-order IDs
      const unsortedRules: RuleSection[] = [
        {
          id: "100.3",
          number: "100.3.",
          title: "Third",
          content: "",
          level: 1,
          parentId: "100",
          children: [],
          crossRefs: [],
          version: "1.2",
        },
        {
          id: "100.1",
          number: "100.1.",
          title: "First",
          content: "",
          level: 1,
          parentId: "100",
          children: [],
          crossRefs: [],
          version: "1.2",
        },
        {
          id: "100.2",
          number: "100.2.",
          title: "Second",
          content: "",
          level: 1,
          parentId: "100",
          children: [],
          crossRefs: [],
          version: "1.2",
        },
        {
          id: "100",
          number: "100.",
          title: "Parent",
          content: "",
          level: 0,
          children: ["100.3", "100.1", "100.2"],
          crossRefs: [],
          version: "1.2",
        },
      ];

      const unsortedMap = new Map(unsortedRules.map((r) => [r.id, r]));
      renderWithRouter(<RuleTree rulesMap={unsortedMap} />);

      const treeitems = screen.getAllByRole("treeitem");
      const texts = treeitems.map((item) => item.textContent);

      // Should be sorted: First, Second, Third
      expect(texts.join("")).toMatch(/First.*Second.*Third/);
    });

    it("should handle very long rule titles", () => {
      const longTitleRules = new Map([
        [
          "100",
          {
            id: "100",
            number: "100.",
            title:
              "Very Long Rule Title That Should Be Truncated In The Display",
            content: "",
            level: 0,
            children: [],
            crossRefs: [],
            version: "1.2",
          },
        ],
      ]);

      renderWithRouter(<RuleTree rulesMap={longTitleRules} />);
      const button = screen.getByText(/Very Long Rule Title/);
      expect(button).toHaveClass("truncate");
    });
  });

  describe("Integration", () => {
    it("should work with react-router navigation", async () => {
      const user = userEvent.setup();
      renderWithRouter(<RuleTree rulesMap={rulesMap} />);

      const combatButton = screen.getByText("Combat").closest("button");
      await user.click(combatButton!);

      // Should navigate (can't fully test without router mock)
      expect(combatButton).toBeInTheDocument();
    });

    it("should prefer onNavigate over react-router", async () => {
      const user = userEvent.setup();
      const handleNavigate = vi.fn();

      renderWithRouter(
        <RuleTree rulesMap={rulesMap} onNavigate={handleNavigate} />,
      );

      const combatButton = screen.getByText("Combat").closest("button");
      await user.click(combatButton!);

      expect(handleNavigate).toHaveBeenCalled();
    });
  });
});
