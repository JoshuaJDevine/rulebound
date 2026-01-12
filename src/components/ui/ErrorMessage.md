# ErrorMessage

## Purpose

The ErrorMessage component displays error states to users in a consistent, accessible manner throughout the Rule Bound application. It provides a clear visual indicator of errors with a title, descriptive message, and optional retry action. The component ensures errors are immediately announced to screen reader users through ARIA live regions.

## Usage

```tsx
import { ErrorMessage } from '@/components/ui';

// Basic error
<ErrorMessage
  title="Failed to load"
  message="The data could not be loaded. Please try again."
/>

// With retry action
<ErrorMessage
  title="Connection Error"
  message="Unable to connect to the server."
  retry={() => refetch()}
/>
```

## Props / Parameters

| Name    | Type       | Required | Description                      |
| ------- | ---------- | -------- | -------------------------------- |
| title   | string     | Yes      | Error title/heading              |
| message | string     | Yes      | Detailed error description       |
| retry   | () => void | No       | Optional retry callback function |

## Returns

An accessible error message container with visual error styling, icon, title, description, and optional retry button.

## Examples

```tsx
// Example 1: Simple error message
<ErrorMessage
  title="Rule Not Found"
  message="The rule you're looking for doesn't exist or has been removed."
/>

// Example 2: Error with retry action
<ErrorMessage
  title="Failed to Load Rules"
  message="We couldn't load the rules from the server. Please check your connection and try again."
  retry={() => loadRules()}
/>

// Example 3: Network error
<ErrorMessage
  title="Network Error"
  message="You appear to be offline. Please check your internet connection."
  retry={() => window.location.reload()}
/>

// Example 4: Validation error
<ErrorMessage
  title="Invalid Input"
  message="Please check your input and ensure all required fields are filled correctly."
/>

// Example 5: Conditional rendering in a page
function RulesPage() {
  const { error, retry } = useRulesStore();

  if (error) {
    return (
      <ErrorMessage
        title="Error Loading Rules"
        message={error.message}
        retry={retry}
      />
    );
  }

  return <RulesList />;
}
```

## Accessibility

- **ARIA Attributes**:
  - `role="alert"` - Identifies container as an alert region
  - `aria-live="assertive"` - Immediately announces error to screen readers, interrupting current content
  - `aria-hidden="true"` - Hides decorative error icon from screen readers
- **Semantic Structure**:
  - `<h3>` for error title (proper heading hierarchy)
  - `<p>` for error message description
- **Color Contrast**: All text meets WCAG AA standards on error background:
  - Error background: Red 50 (#FEF2F2)
  - Error border: Red 200 (#FECACA)
  - Title text: Red 900 (#7F1D1D) - contrast ratio > 4.5:1
  - Message text: Red 700 (#B91C1C) - contrast ratio > 4.5:1
- **Visual Indicators**:
  - Red color scheme universally recognized for errors
  - Error icon (X in circle) provides quick visual recognition
  - Rounded border and background distinguish from regular content
- **Keyboard Navigation**: Optional retry button is fully keyboard accessible
- **Focus Management**: Retry button has visible focus indicator

## Visual Design

### Color System

- **Background**: `bg-error-50` - Light red background (#FEF2F2)
- **Border**: `border-error-200` - Red border (#FECACA)
- **Icon**: `text-error-600` - Medium red (#DC2626)
- **Title**: `text-error-900` - Dark red (#7F1D1D)
- **Message**: `text-error-700` - Red (#B91C1C)

### Layout

- Rounded corners (`rounded-lg`) for friendly appearance
- 16px padding for comfortable spacing
- Flexbox layout with icon and content
- 12px gap between icon and text
- Icon is 20×20px (h-5 w-5)
- Retry button has 16px top margin when present

## Design Patterns

### Page-Level Errors

```tsx
function DataPage() {
  const { data, error, isLoading, refetch } = useData();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          title="Failed to Load Data"
          message={error.message}
          retry={refetch}
        />
      </div>
    );
  }

  // ... rest of component
}
```

### Inline Errors

```tsx
function FormField() {
  const [error, setError] = useState(null);

  return (
    <div>
      <input {...} />
      {error && (
        <ErrorMessage
          title="Validation Error"
          message={error}
        />
      )}
    </div>
  );
}
```

### Error Boundaries

```tsx
class ErrorBoundary extends React.Component {
  render() {
    if (this.state.hasError) {
      return (
        <ErrorMessage
          title="Something Went Wrong"
          message="An unexpected error occurred. Please refresh the page."
          retry={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}
```

## User Experience Considerations

1. **Clear Language**: Error messages should be user-friendly, avoiding technical jargon
2. **Actionable**: When possible, provide a retry action to help users recover
3. **Context**: Include enough detail for users to understand what went wrong
4. **Immediate Feedback**: Use assertive ARIA live region for critical errors
5. **Visual Hierarchy**: Title draws attention, message provides details

## Related

- [Button](./Button.md) - Used for retry action
- [LoadingSpinner](./LoadingSpinner.md) - Complementary component for loading states
- [EmptyState](../common/EmptyState.md) - Related component for empty states
- [rulesStore](../../store/rulesStore.md) - Store that uses ErrorMessage for error handling
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
