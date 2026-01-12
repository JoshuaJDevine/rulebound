/**
 * ReadingView Component
 * Document-style reading experience for sequential rule consumption
 * Sticky header, progress tracking, prev/next navigation
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { RuleSection } from "@/types";

export interface ReadingViewProps {
  topicTitle: string;
  rules: RuleSection[];
  initialScrollToRule?: string;
  onExitReadingMode: () => void;
  className?: string;
}

export function ReadingView({
  topicTitle,
  rules,
  initialScrollToRule,
  onExitReadingMode,
  className,
}: ReadingViewProps) {
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const ruleRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Scroll to initial rule if specified
  useEffect(() => {
    if (initialScrollToRule && ruleRefs.current.has(initialScrollToRule)) {
      const element = ruleRefs.current.get(initialScrollToRule);
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [initialScrollToRule]);

  // Update current rule based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for sticky header

      let currentIndex = 0;
      rules.forEach((rule, index) => {
        const element = ruleRefs.current.get(rule.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentIndex = index;
        }
      });

      setCurrentRuleIndex(currentIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rules]);

  const navigateToRule = useCallback(
    (index: number) => {
      if (index >= 0 && index < rules.length) {
        const rule = rules[index];
        const element = ruleRefs.current.get(rule.id);
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
        setCurrentRuleIndex(index);
      }
    },
    [rules],
  );

  const handlePrevious = useCallback(() => {
    navigateToRule(currentRuleIndex - 1);
  }, [currentRuleIndex, navigateToRule]);

  const handleNext = useCallback(() => {
    navigateToRule(currentRuleIndex + 1);
  }, [currentRuleIndex, navigateToRule]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "Escape") {
        onExitReadingMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentRuleIndex,
    rules.length,
    handleNext,
    handlePrevious,
    onExitReadingMode,
  ]);

  const currentRule = rules[currentRuleIndex];
  const hasPrevious = currentRuleIndex > 0;
  const hasNext = currentRuleIndex < rules.length - 1;

  return (
    <div
      className={cn(
        "min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-20",
        className,
      )}
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-primary-900 border-b border-primary-700 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Back button */}
          <button
            onClick={onExitReadingMode}
            className="flex items-center gap-2 text-primary-100 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 rounded px-2 py-1"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden md:inline font-body text-sm">Back</span>
          </button>

          {/* Topic title */}
          <div className="flex-1 min-w-0 text-center">
            <h1 className="font-display text-lg md:text-xl font-semibold text-white truncate">
              {topicTitle}
            </h1>
          </div>

          {/* Progress */}
          <div className="font-body text-sm text-primary-200 whitespace-nowrap">
            Rule {currentRuleIndex + 1} of {rules.length}
          </div>
        </div>
      </header>

      {/* Reading Content */}
      <main ref={contentRef} className="prose-readable mx-auto px-4 py-8">
        {rules.map((rule, index) => (
          <article
            key={rule.id}
            ref={(el) => {
              if (el) ruleRefs.current.set(rule.id, el);
            }}
            className={cn(
              "mb-12 pb-8 border-b border-neutral-200 dark:border-primary-800",
              index === rules.length - 1 && "border-b-0",
            )}
          >
            {/* Rule Number */}
            <div className="font-mono text-base md:text-lg font-semibold text-accent-600 dark:text-accent-400 mb-3">
              {rule.number}
            </div>

            {/* Rule Title (if different from content) */}
            {rule.title && rule.title !== rule.content && (
              <h2 className="font-display text-xl md:text-2xl font-semibold text-primary-900 dark:text-neutral-100 mb-4">
                {rule.title}
              </h2>
            )}

            {/* Rule Content */}
            <div className="font-body text-base md:text-lg leading-relaxed text-neutral-700 dark:text-neutral-200 mb-4">
              {rule.content}
            </div>

            {/* Sub-rules would be rendered here if needed in future */}
          </article>
        ))}
      </main>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-primary-900 border-t border-primary-700 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Previous button */}
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded font-body text-sm font-medium transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent-500",
              hasPrevious
                ? "text-primary-100 hover:text-white hover:bg-primary-800"
                : "text-primary-600 cursor-not-allowed",
            )}
          >
            <svg
              className="w-4 h-4"
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
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Current rule indicator */}
          <div className="font-mono text-sm text-accent-400">
            {currentRule?.number}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded font-body text-sm font-medium transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent-500",
              hasNext
                ? "text-primary-100 hover:text-white hover:bg-primary-800"
                : "text-primary-600 cursor-not-allowed",
            )}
          >
            <span className="hidden sm:inline">Next</span>
            <svg
              className="w-4 h-4"
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
      </nav>
    </div>
  );
}
