/**
 * RulesListPage Component
 * Displays all rules in a flat list view (useful for scanning/browsing)
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRulesStore } from "@/store/rulesStore";
import { RuleCard, EmptyState } from "@/components/common";
import {
  SearchInput,
  LoadingSpinner,
  ErrorMessage,
  Breadcrumb,
} from "@/components/ui";

export function RulesListPage() {
  const navigate = useNavigate();
  const { rulesData, isLoading, error, loadRules, searchRules } =
    useRulesStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!rulesData && !isLoading && !error) {
      loadRules();
    }
  }, [rulesData, isLoading, error, loadRules]);

  // Get all rules, sorted by rule number
  const allRules = rulesData
    ? [...rulesData.sections].sort((a, b) => {
        // Sort by rule number (e.g., "000" < "001" < "103.1" < "103.1.a")
        return a.number.localeCompare(b.number, undefined, { numeric: true });
      })
    : [];

  // Filter by search query if provided
  const displayedRules = searchQuery
    ? searchRules(searchQuery).map((result) => result.rule)
    : allRules;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "All Rules" },
  ];

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
    <div className="container mx-auto px-4 py-6">
      {/* Header with breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mt-4 mb-2">
          All Rules
        </h1>
        <p className="text-neutral-600">
          Browse all {allRules.length} rules in a flat list view.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
          placeholder="Search rules by number, title, or content..."
        />
      </div>

      {/* Rules List */}
      {displayedRules.length > 0 ? (
        <>
          {searchQuery && (
            <p className="text-sm text-neutral-600 mb-4">
              {displayedRules.length}{" "}
              {displayedRules.length === 1 ? "result" : "results"} for "
              {searchQuery}"
            </p>
          )}
          <ul className="space-y-4">
            {displayedRules.map((rule) => (
              <li key={rule.id}>
                <RuleCard
                  rule={rule}
                  onClick={() => navigate(`/rules/${rule.id}`)}
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <EmptyState
          icon="🔍"
          title={searchQuery ? "No rules found" : "No rules available"}
          description={
            searchQuery
              ? `No rules match "${searchQuery}". Try a different search term.`
              : "No rules are available at this time."
          }
          action={{
            label: "Go to Home",
            onClick: () => navigate("/"),
          }}
        />
      )}
    </div>
  );
}
