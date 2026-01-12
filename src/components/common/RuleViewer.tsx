/**
 * RuleViewer Component
 * Displays a single rule with full hierarchy context
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import type { RuleSection } from "@/types";
import { Button, Breadcrumb } from "@/components/ui";

interface RuleViewerProps {
  rule: RuleSection;
  rulesMap: Map<string, RuleSection>;
  className?: string;
}

function buildBreadcrumb(
  rule: RuleSection,
  rulesMap: Map<string, RuleSection>,
): Array<{ label: string; href: string }> {
  const breadcrumb: Array<{ label: string; href: string }> = [
    { label: "Home", href: "/" },
  ];

  const path: RuleSection[] = [];
  let current: RuleSection | undefined = rule;

  // Build path from root to current rule
  while (current) {
    path.unshift(current);
    if (current.parentId) {
      current = rulesMap.get(current.parentId);
    } else {
      break;
    }
  }

  // Add breadcrumb items
  path.forEach((r) => {
    breadcrumb.push({
      label: `${r.number} ${r.title}`,
      href: `/rules/${r.id}`,
    });
  });

  return breadcrumb;
}

function renderContent(
  content: string,
  rulesMap: Map<string, RuleSection>,
  navigate: (path: string) => void,
): React.ReactNode {
  // Replace "See rule X.Y" with clickable links
  const pattern =
    /(?:See\s+)?rule\s+(\d{3}(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?)\./gi;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    // Add clickable link
    const ruleNumber = match[1];
    const referencedRule = rulesMap.get(ruleNumber);
    const linkText = match[0];

    if (referencedRule) {
      parts.push(
        <button
          key={match.index}
          onClick={() => navigate(`/rules/${ruleNumber}`)}
          className="text-blue-600 hover:text-blue-800 underline"
          aria-label={`Go to rule ${ruleNumber}`}
        >
          {linkText}
        </button>,
      );
    } else {
      parts.push(<span key={match.index}>{linkText}</span>);
    }

    lastIndex = pattern.lastIndex;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : content;
}

export function RuleViewer({
  rule,
  rulesMap,
  className = "",
}: RuleViewerProps) {
  const navigate = useNavigate();
  const breadcrumb = buildBreadcrumb(rule, rulesMap);

  const children = rule.children
    .map((id) => rulesMap.get(id))
    .filter((r): r is RuleSection => r !== undefined);

  const parent = rule.parentId ? rulesMap.get(rule.parentId) : undefined;
  const siblings = parent
    ? parent.children
        .map((id) => rulesMap.get(id))
        .filter((r): r is RuleSection => r !== undefined)
    : [];

  const currentIndex = siblings.findIndex((r) => r.id === rule.id);
  const prevSibling = currentIndex > 0 ? siblings[currentIndex - 1] : undefined;
  const nextSibling =
    currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : undefined;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumb} />

      {/* Rule Header */}
      <div>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-sm font-mono text-neutral-500">
            {rule.number}
          </span>
          <h1 className="text-2xl font-bold text-neutral-900">{rule.title}</h1>
        </div>
        {parent && (
          <p className="text-sm text-neutral-600">
            Part of:{" "}
            <button
              onClick={() => navigate(`/rules/${parent.id}`)}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {parent.number} {parent.title}
            </button>
          </p>
        )}
      </div>

      {/* Rule Content */}
      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-wrap text-neutral-700">
          {renderContent(rule.content, rulesMap, navigate)}
        </div>
      </div>

      {/* Cross-References */}
      {rule.crossRefs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">
            Related Rules
          </h2>
          <div className="flex flex-wrap gap-2">
            {rule.crossRefs.map((refId) => {
              const refRule = rulesMap.get(refId);
              if (!refRule) return null;
              return (
                <Button
                  key={refId}
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/rules/${refId}`)}
                >
                  {refRule.number} {refRule.title}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Children Rules */}
      {children.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">
            Sub-rules
          </h2>
          <ul className="space-y-1">
            {children.map((child) => (
              <li key={child.id}>
                <button
                  onClick={() => navigate(`/rules/${child.id}`)}
                  className="text-blue-600 hover:text-blue-800 underline text-left"
                >
                  {child.number} {child.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-4 border-t border-neutral-200">
        {prevSibling ? (
          <Button
            variant="secondary"
            onClick={() => navigate(`/rules/${prevSibling.id}`)}
          >
            ← {prevSibling.number} {prevSibling.title}
          </Button>
        ) : (
          <div />
        )}
        {nextSibling && (
          <Button
            variant="secondary"
            onClick={() => navigate(`/rules/${nextSibling.id}`)}
          >
            {nextSibling.number} {nextSibling.title} →
          </Button>
        )}
      </div>
    </div>
  );
}
