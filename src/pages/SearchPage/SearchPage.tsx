/**
 * SearchPage Component
 * Full-featured search interface with results showing hierarchical context
 * Per designer specs: Show breadcrumb path with each result for hierarchy context
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRulesStore } from "@/store/rulesStore";
import { SearchInput, LoadingSpinner, ErrorMessage } from "@/components/ui";
import { EmptyState } from "@/components/common";
import { cn } from "@/lib/utils";
import type { RuleSection } from "@/types";

// Build breadcrumb path for a rule
function buildBreadcrumbPath(
  rule: RuleSection,
  getRuleById: (id: string) => RuleSection | undefined,
): string {
  const path: string[] = ["Home"];
  const ancestors: RuleSection[] = [];

  let current: RuleSection | undefined = rule;
  while (current?.parentId) {
    const parent = getRuleById(current.parentId);
    if (parent) {
      ancestors.unshift(parent);
    }
    current = parent;
  }

  // Add ancestor titles
  for (const ancestor of ancestors) {
    path.push(ancestor.title);
  }

  return path.join(" > ");
}

// Get level label
function getLevelLabel(level: number): string {
  if (level === 0) return "Section";
  if (level === 1) return "Rule";
  if (level === 2) return "Sub-rule";
  return "Detail";
}

// Highlight query in excerpt
function highlightQuery(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(
    regex,
    '<mark class="bg-primary-200 text-primary-900 font-medium">$1</mark>',
  );
}

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const { rulesData, isLoading, error, loadRules, searchRules, getRuleById } =
    useRulesStore();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!rulesData && !isLoading && !error) {
      loadRules();
    }
  }, [rulesData, isLoading, error, loadRules]);

  const results = debouncedQuery ? searchRules(debouncedQuery) : [];

  const handleClear = () => {
    setSearchQuery("");
    setDebouncedQuery("");
  };

  if (isLoading) {
    return <LoadingSpinner variant="page" label="Loading rules..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          title="Failed to load rules"
          message={
            error.message ||
            "An error occurred while loading the rules. Please try again."
          }
          retry={loadRules}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Search Header */}
      <div className="bg-white border-b border-neutral-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <button
              className="h-10 w-10 flex items-center justify-center text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <svg
                className="h-5 w-5"
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
            </button>
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={handleClear}
                placeholder="Search all rules..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 container mx-auto px-4 py-6">
        {!debouncedQuery ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Search for rules
            </h2>
            <p className="text-neutral-600">
              Enter a search term to find rules by number, title, or content.
            </p>
          </div>
        ) : results.length > 0 ? (
          <>
            <p
              className="text-sm text-neutral-600 mb-4"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {results.length} {results.length === 1 ? "result" : "results"} for
              "{debouncedQuery}"
            </p>
            <ul className="space-y-4">
              {results.map(({ rule, matches }) => {
                const breadcrumbPath = buildBreadcrumbPath(rule, getRuleById);
                const contentMatch = matches.find((m) => m.field === "content");
                const excerpt =
                  contentMatch?.snippet || rule.content.slice(0, 200);

                return (
                  <li key={rule.id}>
                    <button
                      className={cn(
                        "block w-full bg-white rounded-lg border border-neutral-200 p-4 text-left",
                        "hover:shadow-md hover:border-primary-300 transition-all cursor-pointer",
                        "focus:ring-4 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none",
                      )}
                      onClick={() => navigate(`/rules/${rule.id}`)}
                      type="button"
                    >
                      {/* Rule number, title, and level badge */}
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-lg font-mono font-bold text-primary-600">
                              {rule.number}
                            </span>
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {rule.title}
                            </h3>
                          </div>

                          {/* Level badge */}
                          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                            {getLevelLabel(rule.level)}
                          </span>
                        </div>
                      </div>

                      {/* Breadcrumb path - shows where result lives in hierarchy */}
                      <p className="text-sm text-neutral-500 mb-3">
                        {breadcrumbPath}
                      </p>

                      {/* Content excerpt with highlighted query */}
                      <p
                        className="text-sm text-neutral-700 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: highlightQuery(excerpt, debouncedQuery),
                        }}
                      />

                      {/* Metadata */}
                      {rule.crossRefs.length > 0 && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-neutral-600">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                          <span>
                            {rule.crossRefs.length} cross-reference
                            {rule.crossRefs.length === 1 ? "" : "s"}
                          </span>
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <EmptyState
            icon="🔍"
            title="No results found"
            description={`No rules match "${debouncedQuery}". Try a different search term or browse all rules.`}
            action={{
              label: "Browse All Rules",
              onClick: () => navigate("/"),
            }}
          />
        )}
      </div>
    </div>
  );
}
