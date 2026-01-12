/**
 * BookmarksPage Component
 * Display user's bookmarked rules
 */

import { useNavigate } from "react-router-dom";
import { useRulesStore } from "@/store/rulesStore";
import { RuleCard, EmptyState } from "@/components/common";

export function BookmarksPage() {
  const navigate = useNavigate();
  const { bookmarks, getRuleById } = useRulesStore();

  // Get bookmarked rules with timestamps
  const bookmarkedRules = bookmarks
    .map((bookmark) => ({
      rule: getRuleById(bookmark.ruleId),
      timestamp: bookmark.timestamp,
    }))
    .filter((item) => item.rule !== undefined)
    .sort((a, b) => b.timestamp - a.timestamp); // Most recent first

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Bookmarks</h1>
      </div>

      {bookmarkedRules.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No bookmarks yet"
          description="Browse rules and tap the bookmark icon to save your favorites here."
          action={{
            label: "Browse Rules",
            onClick: () => navigate("/"),
          }}
        />
      ) : (
        <ul className="space-y-4">
          {bookmarkedRules.map(
            ({ rule, timestamp }) =>
              rule && (
                <li key={rule.id} className="relative">
                  <RuleCard
                    rule={rule}
                    onClick={() => navigate(`/rules/${rule.id}`)}
                  />
                  <div className="mt-2 text-xs text-neutral-500">
                    Bookmarked: {new Date(timestamp).toLocaleDateString()}
                  </div>
                </li>
              ),
          )}
        </ul>
      )}
    </div>
  );
}
