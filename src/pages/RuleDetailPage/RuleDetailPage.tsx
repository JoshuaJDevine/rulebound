/**
 * RuleDetailPage Component
 * Full display of a single rule with content, references, and actions
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRulesStore } from '@/store/rulesStore';
import { BookmarkButton } from '@/components/common';
import { Breadcrumb, LoadingSpinner, ErrorMessage, Chip, Button } from '@/components/ui';

export function RuleDetailPage() {
  const { ruleId } = useParams<{ ruleId: string }>();
  const navigate = useNavigate();
  const { rules, isLoading, error, loadRules, addToRecentlyViewed } = useRulesStore();

  useEffect(() => {
    if (rules.length === 0 && !isLoading && !error) {
      loadRules();
    }
  }, [rules.length, isLoading, error, loadRules]);

  useEffect(() => {
    if (ruleId) {
      addToRecentlyViewed(ruleId);
    }
  }, [ruleId, addToRecentlyViewed]);

  const rule = rules.find(r => r.id === ruleId);
  const relatedRules = rule
    ? rules.filter(r => rule.references.includes(r.id))
    : [];

  if (isLoading) {
    return <LoadingSpinner variant="page" label="Loading rule..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          title="Failed to load rule"
          message={error.message || 'An error occurred while loading the rule. Please try again.'}
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
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Go to Home
        </Button>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: rule.section, href: `/rules?section=${rule.section.toLowerCase().replace(/\s+/g, '-')}` },
    { label: rule.title },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
        icon={
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        }
      >
        Back
      </Button>

      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Rule Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
            {rule.title}
          </h1>
          {rule.subsection && (
            <p className="text-neutral-600">{rule.subsection}</p>
          )}
        </div>
        <BookmarkButton ruleId={rule.id} size="lg" />
      </div>

      {/* Rule Content */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
        <div className="prose prose-neutral max-w-none">
          <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
            {rule.content}
          </p>
        </div>
      </div>

      {/* Tags */}
      {rule.tags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {rule.tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="default" />
            ))}
          </div>
        </div>
      )}

      {/* Related Rules */}
      {relatedRules.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            Related Rules
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedRules.map((relatedRule) => (
              <Chip
                key={relatedRule.id}
                label={relatedRule.title}
                variant="interactive"
                onClick={() => navigate(`/rules/${relatedRule.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Page Reference */}
      {rule.pageNumber && (
        <div className="text-sm text-neutral-600">
          <strong>Page Reference:</strong> p. {rule.pageNumber}
        </div>
      )}
    </div>
  );
}
