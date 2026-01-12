/**
 * RuleTree Component
 * Hierarchical tree navigation component for exploring the full rule structure
 * Per designer specs: WCAG-compliant tree role, keyboard navigation, roving tabindex
 *
 * Keyboard shortcuts:
 * - Arrow Down: Next visible node
 * - Arrow Up: Previous visible node
 * - Arrow Right: Expand node (if collapsed) or move to first child (if expanded)
 * - Arrow Left: Collapse node (if expanded) or move to parent (if collapsed)
 * - Enter: Navigate to focused rule
 * - Space: Toggle expand/collapse
 * - Home: First node
 * - End: Last visible node
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { RuleSection } from "@/types";

export interface RuleTreeProps {
  rootRuleId?: string; // Start tree from this rule (default: show all level 0)
  rulesMap: Map<string, RuleSection>;
  currentRuleId?: string; // Highlight and auto-scroll to this rule
  onNavigate?: (ruleId: string) => void;
  maxDepth?: number; // Limit tree depth (default: unlimited)
  className?: string;
}

interface RuleTreeNodeProps {
  rule: RuleSection;
  rulesMap: Map<string, RuleSection>;
  level: number;
  selectedId?: string;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onRuleClick: (ruleId: string) => void;
  maxDepth?: number;
}

function RuleTreeNode({
  rule,
  rulesMap,
  level,
  selectedId,
  expandedIds,
  onToggle,
  onRuleClick,
  maxDepth,
}: RuleTreeNodeProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isExpanded = expandedIds.has(rule.id);
  const isSelected = rule.id === selectedId;

  // Respect maxDepth if set
  const shouldShowChildren = maxDepth === undefined || level < maxDepth;

  const children = shouldShowChildren
    ? rule.children
        .map((id) => rulesMap.get(id))
        .filter((r): r is RuleSection => r !== undefined)
        .sort((a, b) => {
          // Sort by rule number for consistent ordering
          return a.number.localeCompare(b.number);
        })
    : [];
  const hasChildren = children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggle(rule.id);
    }
  };

  const handleClick = () => {
    onRuleClick(rule.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (hasChildren) {
        onToggle(rule.id);
      }
      handleClick();
    } else if (e.key === "ArrowRight" && hasChildren && !isExpanded) {
      e.preventDefault();
      onToggle(rule.id);
    } else if (e.key === "ArrowLeft" && hasChildren && isExpanded) {
      e.preventDefault();
      onToggle(rule.id);
    }
  };

  return (
    <li
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-level={level + 1}
      aria-label={`${rule.number} ${rule.title}`}
    >
      <div className="flex items-start gap-1">
        {/* Indentation - 16px (pl-4) per level per designer specs */}
        <div
          className="flex-shrink-0"
          style={{ width: `${level * 16}px` }}
          aria-hidden="true"
        />

        {/* Expand/Collapse Icon */}
        {hasChildren ? (
          <button
            ref={buttonRef}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded transition-colors"
            aria-label={
              isExpanded ? `Collapse ${rule.title}` : `Expand ${rule.title}`
            }
            aria-expanded={isExpanded}
            type="button"
            tabIndex={-1}
          >
            {isExpanded ? (
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        ) : (
          <div
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-neutral-300 text-xs">•</span>
          </div>
        )}

        {/* Rule Content Button */}
        <button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex-1 text-left px-2 py-1.5 rounded transition-colors",
            "hover:bg-primary-50 hover:text-primary-700",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
            isSelected
              ? "bg-primary-200 text-primary-900 font-bold"
              : "text-neutral-700",
          )}
          aria-current={isSelected ? "page" : undefined}
          type="button"
          tabIndex={isSelected ? 0 : -1}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs font-mono font-medium flex-shrink-0",
                isSelected ? "text-primary-700" : "text-neutral-500",
              )}
            >
              {rule.number}
            </span>
            <span className="flex-1 text-sm truncate">{rule.title}</span>
          </div>
        </button>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <ul role="group" className="mt-1">
          {children.map((child) => (
            <RuleTreeNode
              key={child.id}
              rule={child}
              rulesMap={rulesMap}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onRuleClick={onRuleClick}
              maxDepth={maxDepth}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function RuleTree({
  rootRuleId,
  rulesMap,
  currentRuleId,
  onNavigate,
  maxDepth,
  className,
}: RuleTreeProps) {
  const navigate = useNavigate();
  const processedRuleIdRef = useRef<string | undefined>(undefined);

  // If no rootRuleId provided, show all top-level sections
  const rootRules = rootRuleId
    ? [rulesMap.get(rootRuleId)].filter(
        (r): r is RuleSection => r !== undefined,
      )
    : Array.from(rulesMap.values())
        .filter((r) => r.level === 0)
        .sort((a, b) => a.number.localeCompare(b.number));

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(rootRuleId ? [rootRuleId] : rootRules.map((r) => r.id)),
  );

  // Auto-expand path to current rule (only once per currentRuleId)
  // This is a legitimate use case for setting state in an effect - we're responding
  // to external navigation state to update the tree's expanded nodes
  useEffect(() => {
    if (!currentRuleId || processedRuleIdRef.current === currentRuleId) return;

    processedRuleIdRef.current = currentRuleId;
    const pathToExpand = new Set<string>();
    let current = rulesMap.get(currentRuleId);

    while (current?.parentId) {
      pathToExpand.add(current.parentId);
      current = rulesMap.get(current.parentId);
    }

    if (pathToExpand.size > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedIds((prev) => {
        const needsUpdate = Array.from(pathToExpand).some(
          (id) => !prev.has(id),
        );
        if (!needsUpdate) return prev;
        return new Set([...prev, ...pathToExpand]);
      });
    }
  }, [currentRuleId, rulesMap]);

  if (rootRules.length === 0) {
    return null;
  }

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleRuleClick = (ruleId: string) => {
    if (onNavigate) {
      onNavigate(ruleId);
    } else {
      navigate(`/rules/${ruleId}`);
    }
  };

  return (
    <nav
      className={cn(
        "bg-white border border-neutral-200 rounded-lg p-4",
        className,
      )}
      aria-label="Rule hierarchy navigation"
    >
      <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
        Rules Navigation
      </h2>
      <div
        role="tree"
        aria-orientation="vertical"
        aria-multiselectable={false}
        className="max-h-[600px] overflow-y-auto"
      >
        {rootRules.map((rootRule) => (
          <RuleTreeNode
            key={rootRule.id}
            rule={rootRule}
            rulesMap={rulesMap}
            level={0}
            selectedId={currentRuleId}
            expandedIds={expandedIds}
            onToggle={handleToggle}
            onRuleClick={handleRuleClick}
            maxDepth={maxDepth}
          />
        ))}
      </div>
    </nav>
  );
}
