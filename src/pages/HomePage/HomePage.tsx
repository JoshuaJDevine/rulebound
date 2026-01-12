/**
 * HomePage Component
 * Landing page with hero section and primary navigation to rule sections
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRulesStore } from '@/store/rulesStore';
import { SectionCard } from '@/components/common';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';

export function HomePage() {
  const navigate = useNavigate();
  const { sections, rules, isLoading, error, loadRules } = useRulesStore();

  useEffect(() => {
    if (rules.length === 0 && !isLoading && !error) {
      loadRules();
    }
  }, [rules.length, isLoading, error, loadRules]);

  if (isLoading) {
    return <LoadingSpinner variant="page" label="Loading rules..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          title="Failed to load rules"
          message={error.message || 'An error occurred while loading the rules. Please try again.'}
          retry={loadRules}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-neutral-50 rounded-2xl p-8 md:p-12 mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4">
          Welcome to Rule Bound
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 mb-6 max-w-2xl mx-auto">
          Your accessible, easy-to-use reference for the Riftbound Core Rules. Find any rule quickly and bookmark your favorites.
        </p>
      </section>

      {/* Popular Sections */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          Browse by Section
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onClick={(sectionId) => navigate(`/rules?section=${sectionId}`)}
            />
          ))}
        </div>
      </section>

      {sections.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-neutral-600">
            No sections available. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}
