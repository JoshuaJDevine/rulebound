/**
 * SearchPage Component
 * Full-featured search interface with results
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRulesStore } from '@/store/rulesStore';
import { SearchInput, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { RuleCard, EmptyState } from '@/components/common';

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const { rules, isLoading, error, loadRules, searchRules } = useRulesStore();
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
    if (rules.length === 0 && !isLoading && !error) {
      loadRules();
    }
  }, [rules.length, isLoading, error, loadRules]);

  const results = debouncedQuery ? searchRules(debouncedQuery) : [];

  const handleClear = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

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
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
              Enter a search term to find rules by title, content, or tags.
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
              {results.length} {results.length === 1 ? 'result' : 'results'} for "{debouncedQuery}"
            </p>
            <ul className="space-y-4">
              {results.map(({ rule }) => (
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
            title="No results found"
            description={`No rules match "${debouncedQuery}". Try a different search term or browse all rules.`}
            action={{
              label: 'Browse All Rules',
              onClick: () => navigate('/rules'),
            }}
          />
        )}
      </div>
    </div>
  );
}
