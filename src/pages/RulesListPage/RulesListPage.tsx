/**
 * RulesListPage Component
 * Displays a list of rules, optionally filtered by section
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRulesStore } from '@/store/rulesStore';
import { RuleCard, EmptyState } from '@/components/common';
import { SearchInput, LoadingSpinner, ErrorMessage, Breadcrumb } from '@/components/ui';

export function RulesListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sectionId = searchParams.get('section');
  
  const { rules, sections, isLoading, error, loadRules } = useRulesStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (rules.length === 0 && !isLoading && !error) {
      loadRules();
    }
  }, [rules.length, isLoading, error, loadRules]);

  // Filter rules by section if specified
  const section = sections.find(s => s.id === sectionId);
  const filteredBySection = sectionId
    ? rules.filter(rule => section?.rules.includes(rule.id))
    : rules;

  // Filter by search query
  const displayedRules = searchQuery
    ? filteredBySection.filter(rule =>
        rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredBySection;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...(section ? [{ label: section.title }] : [{ label: 'All Rules' }]),
  ];

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
    <div className="container mx-auto px-4 py-6">
      {/* Header with breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mt-4 mb-2">
          {section ? section.title : 'All Rules'}
        </h1>
        {section && (
          <p className="text-neutral-600">{section.description}</p>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder={`Search ${section ? section.title.toLowerCase() : 'rules'}...`}
        />
      </div>

      {/* Rules List */}
      {displayedRules.length > 0 ? (
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
      ) : (
        <EmptyState
          icon="🔍"
          title={searchQuery ? 'No rules found' : 'No rules in this section'}
          description={
            searchQuery
              ? `No rules match "${searchQuery}". Try a different search term.`
              : 'This section doesn\'t have any rules yet.'
          }
          action={{
            label: 'Browse All Rules',
            onClick: () => navigate('/rules'),
          }}
        />
      )}
    </div>
  );
}
