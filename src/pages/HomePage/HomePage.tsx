/**
 * HomePage Component
 * Landing page with hero section and primary navigation to rule sections
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRulesStore } from "@/store/rulesStore";
import { SectionCard } from "@/components/common";
import { LoadingSpinner, ErrorMessage } from "@/components/ui";

export function HomePage() {
  const navigate = useNavigate();
  const { rulesData, isLoading, error, loadRules, getTopLevelSections } =
    useRulesStore();

  const topLevelSections = getTopLevelSections();

  useEffect(() => {
    if (!rulesData && !isLoading && !error) {
      loadRules();
    }
  }, [rulesData, isLoading, error, loadRules]);

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
    <div className="min-h-screen">
      {/* Hero Section with gradient background */}
      <section className="bg-gradient-hero py-12 md:py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 dark:text-neutral-100 mb-4 tracking-wide">
            RULE BOUND
          </h1>
          <p className="font-body text-lg md:text-xl text-neutral-900 dark:text-neutral-100 mb-6 max-w-2xl mx-auto">
            Your guide to the{" "}
            <span className="font-semibold text-accent-600 dark:text-accent-400">
              Riftbound Core Rules
            </span>
          </p>
          {rulesData && (
            <p className="font-body text-sm text-neutral-800 dark:text-neutral-300 mb-8">
              Version {rulesData.version} • Last updated {rulesData.lastUpdated}
            </p>
          )}
          <button
            onClick={() => navigate("/rules")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-primary-900 rounded-md font-body font-semibold hover:bg-accent-400 transition-colors focus:outline-none focus:ring-4 focus:ring-accent-500"
          >
            Browse Rules
            <svg
              className="w-5 h-5"
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
          </button>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary-900 dark:text-neutral-100 mb-2">
          Browse by Section
        </h2>
        <div className="h-1 w-20 bg-accent-500 mb-8"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topLevelSections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onClick={(sectionId) => navigate(`/rules/${sectionId}`)}
            />
          ))}
        </div>

        {topLevelSections.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="font-body text-neutral-800 dark:text-neutral-400">
              No sections available. Please check back later.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
