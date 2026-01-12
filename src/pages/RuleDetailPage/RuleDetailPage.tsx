/**
 * RuleDetailPage Component
 * Full display of a single rule or section overview with content, references, and actions
 */

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRulesStore } from "@/store/rulesStore";
import { BookmarkButton, RuleCard } from "@/components/common";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  LoadingSpinner,
  ErrorMessage,
  Chip,
  Button,
} from "@/components/ui";
import type { RuleSection } from "@/types";

function buildBreadcrumbs(
  rule: RuleSection | undefined,
  getRuleById: (id: string) => RuleSection | undefined,
): Array<{ label: string; href?: string }> {
  if (!rule) return [{ label: "Home", href: "/" }];

  const crumbs: Array<{ label: string; href?: string }> = [
    { label: "Home", href: "/" },
  ];

  // Build path from root to current rule
  const path: RuleSection[] = [];
  let current: RuleSection | undefined = rule;

  while (current) {
    path.unshift(current);
    current = current.parentId ? getRuleById(current.parentId) : undefined;
  }

  // Add all ancestors except the last (current rule)
  for (let i = 0; i < path.length - 1; i++) {
    crumbs.push({
      label: `${path[i].number} ${path[i].title}`,
      href: `/rules/${path[i].id}`,
    });
  }

  // Add current rule (no href - it's the current page)
  crumbs.push({
    label: `${rule.number} ${rule.title}`,
  });

  return crumbs;
}

export function RuleDetailPage() {
  const { ruleId } = useParams<{ ruleId: string }>();
  const navigate = useNavigate();
  const {
    rulesData,
    isLoading,
    error,
    loadRules,
    addToRecentlyViewed,
    getRuleById,
    getChildRules,
    getReferencedBy,
  } = useRulesStore();

  useEffect(() => {
    if (!rulesData && !isLoading && !error) {
      loadRules();
    }
  }, [rulesData, isLoading, error, loadRules]);

  useEffect(() => {
    if (ruleId) {
      addToRecentlyViewed(ruleId);
    }
  }, [ruleId, addToRecentlyViewed]);

  const rule = ruleId ? getRuleById(ruleId) : undefined;
  const childRules = rule ? getChildRules(rule.id) : [];
  const referencedBy = rule ? getReferencedBy(rule.id) : [];
  const isSection = rule ? rule.children.length > 0 : false;

  // Get sibling rules (same parent)
  const siblings = rule?.parentId ? getChildRules(rule.parentId) : [];

  // Get previous/next sibling
  const siblingIndex = siblings.findIndex((s) => s.id === rule?.id);
  const prevSibling = siblingIndex > 0 ? siblings[siblingIndex - 1] : undefined;
  const nextSibling =
    siblingIndex >= 0 && siblingIndex < siblings.length - 1
      ? siblings[siblingIndex + 1]
      : undefined;

  if (isLoading) {
    return <LoadingSpinner variant="page" label="Loading rule..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          title="Failed to load rule"
          message={
            error.message ||
            "An error occurred while loading the rule. Please try again."
          }
          retry={loadRules}
        />
      </div>
    );
  }

  if (!rule) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          title="Rule not found"
          message="The rule you're looking for doesn't exist or has been removed."
        />
        <Button
          variant="primary"
          onClick={() => navigate("/")}
          className="mt-4"
        >
          Go to Home
        </Button>
      </div>
    );
  }

  const breadcrumbItems = buildBreadcrumbs(rule, getRuleById);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
        icon={
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        }
      >
        Back
      </Button>

      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Rule Header - sizing based on level per designer specs */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-baseline gap-4 mb-2">
            <span
              className={cn(
                "font-mono font-extrabold text-primary-600",
                rule.level === 0 && "text-4xl",
                rule.level === 1 && "text-3xl",
                rule.level >= 2 && "text-2xl",
              )}
            >
              {rule.number}
            </span>
            <h1
              id="rule-title"
              className={cn(
                "font-bold text-neutral-900",
                rule.level === 0 && "text-3xl md:text-4xl",
                rule.level === 1 && "text-2xl md:text-3xl",
                rule.level >= 2 && "text-xl md:text-2xl",
              )}
            >
              {rule.title}
            </h1>
          </div>
          {/* Level badge (optional) */}
          <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
            {rule.level === 0
              ? "Section"
              : rule.level === 1
                ? "Rule"
                : rule.level === 2
                  ? "Sub-rule"
                  : "Detail"}
          </span>
        </div>
        <BookmarkButton ruleId={rule.id} size="lg" />
      </div>

      {/* Section/Rule with Children Mode */}
      {isSection && (
        <>
          {/* Content Area - prose styling per designer specs */}
          {rule.content && rule.content !== rule.title && (
            <article aria-label="Rule content" className="mb-8">
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-neutral-700 leading-7 whitespace-pre-wrap">
                    {rule.content}
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* Children Section - Grid of RuleCard components per designer specs */}
          {childRules.length > 0 && (
            <section aria-labelledby="sub-rules-heading" className="mb-8">
              <h2
                id="sub-rules-heading"
                className="text-xl font-semibold text-neutral-900 mb-4"
              >
                {rule.level === 0 ? "Rules" : "Sub-Rules"}
              </h2>
              {/* Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {childRules.map((childRule) => (
                  <RuleCard
                    key={childRule.id}
                    rule={childRule}
                    onClick={(id) => navigate(`/rules/${id}`)}
                    variant="default"
                    showLevel={true}
                    showChildren={true}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Leaf Rule Mode (no children) */}
      {!isSection && (
        <>
          {/* Rule Content - max-width 65ch for optimal reading per designer specs */}
          <article aria-label="Rule content" className="mb-8">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div
                className="prose prose-lg max-w-none"
                style={{ maxWidth: "65ch" }}
              >
                <p className="text-neutral-700 leading-7 whitespace-pre-wrap">
                  {rule.content}
                </p>
              </div>
            </div>
          </article>

          {/* Parent Rule Link */}
          {rule.parentId && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-2">
                Parent Rule
              </h2>
              <Chip
                label={`${getRuleById(rule.parentId)?.number || ""} ${
                  getRuleById(rule.parentId)?.title || ""
                }`}
                variant="interactive"
                onClick={() => navigate(`/rules/${rule.parentId}`)}
              />
            </div>
          )}

          {/* Sibling Navigation */}
          {(prevSibling || nextSibling) && (
            <div className="mb-6 flex items-center justify-between gap-4">
              {prevSibling ? (
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/rules/${prevSibling.id}`)}
                  icon={
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  }
                >
                  <span className="hidden sm:inline">Previous: </span>
                  {prevSibling.number}
                </Button>
              ) : (
                <div />
              )}
              {nextSibling && (
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/rules/${nextSibling.id}`)}
                  icon={
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  }
                >
                  <span className="hidden sm:inline">Next: </span>
                  {nextSibling.number}
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {/* Cross-References Section - "See Also" per designer specs */}
      {rule.crossRefs.length > 0 && (
        <nav aria-labelledby="see-also-heading" className="mb-8">
          <h2
            id="see-also-heading"
            className="text-xl font-semibold text-neutral-900 mb-4"
          >
            See Also
          </h2>
          <ul className="space-y-2">
            {rule.crossRefs.map((refId) => {
              const refRule = getRuleById(refId);
              if (!refRule) return null;
              return (
                <li key={refId}>
                  <a
                    href={`/rules/${refId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/rules/${refId}`);
                    }}
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
                  >
                    <span aria-hidden="true" className="text-lg">
                      →
                    </span>
                    <span>
                      {refRule.number} {refRule.title}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Referenced By Section (Backlinks) - per designer specs */}
      {referencedBy.length > 0 && (
        <nav aria-labelledby="referenced-by-heading" className="mb-8">
          <h2
            id="referenced-by-heading"
            className="text-xl font-semibold text-neutral-900 mb-4"
          >
            Referenced By
          </h2>
          <ul className="space-y-2">
            {referencedBy.map((refRule) => (
              <li key={refRule.id}>
                <a
                  href={`/rules/${refRule.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/rules/${refRule.id}`);
                  }}
                  className="flex items-center gap-2 text-neutral-600 hover:text-neutral-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1 text-sm"
                >
                  <span aria-hidden="true">←</span>
                  <span>
                    {refRule.number} {refRule.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
