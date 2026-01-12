# formatTimestamp

## Purpose

The `formatTimestamp` utility function converts Unix timestamps into human-readable, relative time strings (e.g., "2 hours ago", "3 days ago") for the Rule Bound application. This provides users with intuitive time references for recently viewed rules, bookmarks, and other time-sensitive information, improving the overall user experience by showing how recent an activity was.

## Usage

```tsx
import { formatTimestamp } from "@/lib/utils";

// Format a timestamp
const timeStr = formatTimestamp(Date.now() - 7200000);
// Returns: "2 hours ago"

// In a component
function RecentlyViewed({ timestamp }) {
  return (
    <time dateTime={new Date(timestamp).toISOString()}>
      {formatTimestamp(timestamp)}
    </time>
  );
}
```

## Function Signature

```typescript
function formatTimestamp(timestamp: number): string;
```

## Parameters

| Name      | Type   | Description                                                    |
| --------- | ------ | -------------------------------------------------------------- |
| timestamp | number | Unix timestamp in milliseconds (from Date.now() or .getTime()) |

## Returns

A human-readable string representing the time elapsed from the timestamp to now.

## Output Format

| Time Elapsed | Output            | Example                       |
| ------------ | ----------------- | ----------------------------- |
| < 1 minute   | "Just now"        | 10 seconds ago → "Just now"   |
| 1 minute     | "1 minute ago"    | 60 seconds → "1 minute ago"   |
| 2-59 minutes | "{n} minutes ago" | 30 minutes → "30 minutes ago" |
| 1 hour       | "1 hour ago"      | 60 minutes → "1 hour ago"     |
| 2-23 hours   | "{n} hours ago"   | 5 hours → "5 hours ago"       |
| 1 day        | "1 day ago"       | 24 hours → "1 day ago"        |
| 2-6 days     | "{n} days ago"    | 3 days → "3 days ago"         |
| 1 week       | "1 week ago"      | 7 days → "1 week ago"         |
| 2-4 weeks    | "{n} weeks ago"   | 2 weeks → "2 weeks ago"       |
| 1 month      | "1 month ago"     | 30 days → "1 month ago"       |
| 2-11 months  | "{n} months ago"  | 6 months → "6 months ago"     |
| 1 year       | "1 year ago"      | 365 days → "1 year ago"       |
| 2+ years     | "{n} years ago"   | 730 days → "2 years ago"      |

## Examples

```tsx
// Example 1: Just now (< 1 minute)
formatTimestamp(Date.now() - 30000);
// Returns: "Just now"

// Example 2: Minutes ago
formatTimestamp(Date.now() - 600000); // 10 minutes
// Returns: "10 minutes ago"

// Example 3: Hours ago
formatTimestamp(Date.now() - 7200000); // 2 hours
// Returns: "2 hours ago"

// Example 4: Days ago
formatTimestamp(Date.now() - 172800000); // 2 days
// Returns: "2 days ago"

// Example 5: Weeks ago
formatTimestamp(Date.now() - 1209600000); // 2 weeks
// Returns: "2 weeks ago"

// Example 6: Months ago
formatTimestamp(Date.now() - 7776000000); // 90 days
// Returns: "3 months ago"

// Example 7: Years ago
formatTimestamp(Date.now() - 63072000000); // 2 years
// Returns: "2 years ago"

// Example 8: In RuleCard component
function RuleCard({ rule, timestamp }) {
  return (
    <div className="rule-card">
      <h3>{rule.title}</h3>
      {timestamp && (
        <time
          dateTime={new Date(timestamp).toISOString()}
          className="text-xs text-neutral-500"
        >
          Viewed {formatTimestamp(timestamp)}
        </time>
      )}
    </div>
  );
}

// Example 9: Bookmark timestamp
function BookmarkItem({ bookmark }) {
  return (
    <div>
      <p>Bookmarked {formatTimestamp(bookmark.timestamp)}</p>
    </div>
  );
}

// Example 10: Singular vs plural handling
formatTimestamp(Date.now() - 60000); // "1 minute ago" (singular)
formatTimestamp(Date.now() - 120000); // "2 minutes ago" (plural)
```

## Implementation

```typescript
export function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
  if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  if (weeks > 0) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  return "Just now";
}
```

### How It Works

1. **Calculate Difference**: `now - timestamp` in milliseconds
2. **Convert to Units**: Divide by milliseconds per unit
3. **Use Largest Unit**: Start from years, work down to minutes
4. **Handle Singular/Plural**: Use ternary for grammatically correct output
5. **Default**: Return "Just now" for < 1 minute

## Design Patterns

### With Semantic HTML

Always wrap in `<time>` element for accessibility:

```tsx
<time dateTime={new Date(timestamp).toISOString()}>
  {formatTimestamp(timestamp)}
</time>
```

Benefits:

- Screen readers can announce date
- Search engines understand temporal context
- Semantic HTML5 best practice

### Recently Viewed Rules

```tsx
function RecentlyViewedList() {
  const { preferences, rules } = useRulesStore();

  return (
    <div>
      <h2>Recently Viewed</h2>
      {preferences.recentlyViewed.map((ruleId) => {
        const rule = rules.find((r) => r.id === ruleId);
        const viewedTime = getViewedTimestamp(ruleId); // hypothetical

        return (
          <div key={ruleId}>
            <h3>{rule.title}</h3>
            <time dateTime={new Date(viewedTime).toISOString()}>
              Viewed {formatTimestamp(viewedTime)}
            </time>
          </div>
        );
      })}
    </div>
  );
}
```

### Bookmarks with Timestamps

```tsx
function BookmarksList() {
  const { bookmarks, rules } = useRulesStore();

  return (
    <div>
      {bookmarks.map((bookmark) => {
        const rule = rules.find((r) => r.id === bookmark.ruleId);

        return (
          <div key={bookmark.ruleId}>
            <RuleCard rule={rule} />
            <p className="text-xs text-neutral-500">
              Saved {formatTimestamp(bookmark.timestamp)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
```

### Auto-Updating Timestamps

For live-updating timestamps, combine with interval:

```tsx
function LiveTimestamp({ timestamp }) {
  const [formattedTime, setFormattedTime] = useState(
    formatTimestamp(timestamp),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedTime(formatTimestamp(timestamp));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <time dateTime={new Date(timestamp).toISOString()}>{formattedTime}</time>
  );
}
```

## Approximation Caveats

### Month Calculation

Uses 30 days as approximation:

- Real months: 28-31 days
- "1 month ago" may be 28-31 days
- Good enough for UI display
- Not suitable for precise date calculations

### Year Calculation

Uses 365 days as approximation:

- Ignores leap years (366 days)
- "1 year ago" may be off by ~1 day per 4 years
- Acceptable for relative time display

### Precision Trade-off

- **Priority**: Human readability
- **Sacrifice**: Mathematical precision
- **Use Case**: UI display, not date math

For precise dates, use `Date` object or date library.

## Testing

The utility has 100% test coverage with the following scenarios:

```typescript
// Just now (< 1 minute)
formatTimestamp(Date.now() - 30000) === "Just now";

// Singular forms
formatTimestamp(Date.now() - 60000) === "1 minute ago";
formatTimestamp(Date.now() - 3600000) === "1 hour ago";
formatTimestamp(Date.now() - 86400000) === "1 day ago";

// Plural forms
formatTimestamp(Date.now() - 120000) === "2 minutes ago";
formatTimestamp(Date.now() - 7200000) === "2 hours ago";
formatTimestamp(Date.now() - 172800000) === "2 days ago";

// Weeks
formatTimestamp(Date.now() - 604800000) === "1 week ago";
formatTimestamp(Date.now() - 1209600000) === "2 weeks ago";

// Months
formatTimestamp(Date.now() - 2592000000) === "1 month ago";
formatTimestamp(Date.now() - 7776000000) === "3 months ago";

// Years
formatTimestamp(Date.now() - 31536000000) === "1 year ago";
formatTimestamp(Date.now() - 63072000000) === "2 years ago";

// Edge cases
formatTimestamp(Date.now()) === "Just now";
formatTimestamp(Date.now() - 1) === "Just now";
```

## Internationalization (i18n)

Currently English-only. For multi-language support:

```tsx
import { useTranslation } from "react-i18next";

function formatTimestamp(timestamp: number, t: Function): string {
  // ... calculate units ...

  if (years > 0) {
    return t("time.years_ago", { count: years });
  }
  // ... etc
}

// In component
const { t } = useTranslation();
const formatted = formatTimestamp(timestamp, t);
```

Translation files:

```json
{
  "time": {
    "years_ago": "{{count}} year ago",
    "years_ago_plural": "{{count}} years ago",
    "just_now": "Just now"
  }
}
```

## Performance Considerations

### Very Lightweight

- Simple arithmetic operations
- No date parsing
- No string allocations (template literals)
- Can be called frequently without performance issues

### Memoization (Optional)

For frequently re-rendered components:

```tsx
const formattedTime = useMemo(() => formatTimestamp(timestamp), [timestamp]);
```

Usually unnecessary due to function's low cost.

## Related

- [RuleCard](../../components/common/RuleCard.md) - Uses formatTimestamp for recently viewed
- [rulesStore](../../store/rulesStore.md) - Stores timestamps for bookmarks
- [cn](./cn.md) - Companion utility function
- Test file: `formatTimestamp.spec.ts` - 100% coverage

## Alternatives

### date-fns

```tsx
import { formatDistanceToNow } from "date-fns";

formatDistanceToNow(timestamp, { addSuffix: true });
// "2 hours ago"
```

**Pros**: More features, i18n support
**Cons**: Larger bundle (~13KB), overkill for simple use case

### Day.js / Moment.js

```tsx
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs(timestamp).fromNow();
// "2 hours ago"
```

**Pros**: Full-featured date library
**Cons**: Much larger bundle, unnecessary for this use case

For Rule Bound, the custom implementation is ideal:

- Tiny bundle impact (~200 bytes)
- No dependencies
- Exactly what we need
- Easy to customize
