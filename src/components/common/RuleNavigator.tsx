/**
 * RuleNavigator Component
 * Displays a hierarchical tree view of rules for navigation
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RuleSection } from "@/types";

interface RuleNavigatorProps {
  rules: RuleSection[];
  selectedId?: string;
  className?: string;
}

interface RuleNodeProps {
  rule: RuleSection;
  rulesMap: Map<string, RuleSection>;
  level: number;
  selectedId?: string;
  onSelect: (id: string) => void;
}

function RuleNode({
  rule,
  rulesMap,
  level,
  selectedId,
  onSelect,
}: RuleNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand top levels
  const children = rule.children
    .map((id) => rulesMap.get(id))
    .filter((r): r is RuleSection => r !== undefined);

  const isSelected = rule.id === selectedId;
  const hasChildren = children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    onSelect(rule.id);
  };

  // Dynamic indentation - Tailwind doesn't support template literals, so use inline style
  const indentStyle = { paddingLeft: `${level * 1}rem` };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full text-left px-2 py-1.5 rounded flex items-center gap-2 hover:bg-neutral-100 ${
          isSelected ? "bg-blue-50 text-blue-900 font-semibold" : "text-neutral-700"
        }`}
        style={indentStyle}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-current={isSelected ? "page" : undefined}
      >
        {hasChildren && (
          <span className="text-neutral-400 text-xs" aria-hidden="true">
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
        {!hasChildren && <span className="w-3" aria-hidden="true" />}
        <span className="text-xs text-neutral-500 font-mono">{rule.number}</span>
        <span className="flex-1 truncate">{rule.title}</span>
      </button>
      {hasChildren && isExpanded && (
        <div className="ml-4">
          {children.map((child) => (
            <RuleNode
              key={child.id}
              rule={child}
              rulesMap={rulesMap}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function RuleNavigator({
  rules,
  selectedId,
  className = "",
}: RuleNavigatorProps) {
  const navigate = useNavigate();
  const rulesMap = new Map(rules.map((r) => [r.id, r]));

  // Get top-level rules (sections, level 0)
  const topLevelRules = rules.filter((r) => r.level === 0);

  const handleSelect = (id: string) => {
    navigate(`/rules/${id}`);
  };

  return (
    <nav
      className={`bg-white border border-neutral-200 rounded-lg p-2 ${className}`}
      aria-label="Rules navigation"
    >
      <div className="space-y-1">
        {topLevelRules.map((rule) => (
          <RuleNode
            key={rule.id}
            rule={rule}
            rulesMap={rulesMap}
            level={0}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </nav>
  );
}
