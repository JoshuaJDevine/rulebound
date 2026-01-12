# cn (Class Name Utility)

## Purpose

The `cn` utility function provides a simple, efficient way to merge Tailwind CSS classes and handle conditional class names in the Rule Bound application. It filters out falsy values (null, undefined, false) and joins the remaining class names with spaces, enabling clean, readable conditional styling without complex string concatenation logic.

## Usage

```tsx
import { cn } from '@/lib/utils';

// Basic class merging
<div className={cn('base-class', 'additional-class')} />

// Conditional classes
<button className={cn(
  'btn',
  isActive && 'active',
  isDisabled && 'disabled'
)} />

// With custom className prop
<Card className={cn('default-styles', className)} />
```

## Function Signature

```typescript
function cn(...classes: (string | boolean | undefined | null)[]): string;
```

## Parameters

| Name       | Type                                       | Description                                               |
| ---------- | ------------------------------------------ | --------------------------------------------------------- |
| ...classes | (string \| boolean \| undefined \| null)[] | Variable number of class names or conditional expressions |

## Returns

A single string with all truthy class names joined by spaces, ready for use as a `className` prop.

## Examples

```tsx
// Example 1: Basic class merging
cn("text-lg", "font-bold", "text-blue-600");
// Returns: "text-lg font-bold text-blue-600"

// Example 2: Conditional classes
cn("button", isLoading && "loading", isDisabled && "disabled");
// If isLoading=true, isDisabled=false
// Returns: "button loading"

// Example 3: Component with conditional styling
function Button({ variant, className }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded",
        variant === "primary" && "bg-blue-600 text-white",
        variant === "secondary" && "bg-gray-200 text-gray-900",
        className,
      )}
    >
      Click me
    </button>
  );
}

// Example 4: Complex conditional logic
<div
  className={cn(
    "card",
    "p-4",
    "rounded-lg",
    isActive && "border-blue-500",
    isHovered && "shadow-lg",
    isDisabled && "opacity-50 cursor-not-allowed",
    !isDisabled && "hover:shadow-md",
    className,
  )}
/>;

// Example 5: Filtering null/undefined
cn("base", null, undefined, false, "", "extra");
// Returns: "base extra"

// Example 6: With object spread (if extended)
cn(
  "text-sm",
  props.bold && "font-bold",
  props.italic && "italic",
  props.underline && "underline",
);

// Example 7: Real component usage from codebase
function Card({ variant, padding, className, ...props }) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg transition-all",
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
    />
  );
}
```

## Implementation

```typescript
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}
```

### How It Works

1. **Rest Parameters**: Accepts any number of arguments
2. **Filter**: Removes all falsy values (false, null, undefined, '', 0)
3. **Join**: Combines remaining strings with space separator
4. **Return**: Single string ready for className prop

### Why This Works

JavaScript's `Boolean` constructor acts as a filter predicate:

- `Boolean(null)` → false (filtered out)
- `Boolean(undefined)` → false (filtered out)
- `Boolean(false)` → false (filtered out)
- `Boolean('')` → false (filtered out)
- `Boolean('text-lg')` → true (kept)

## Design Patterns

### Base + Variant Pattern

```tsx
const baseStyles = "rounded-lg p-4 transition-all";
const variants = {
  primary: "bg-blue-600 text-white",
  secondary: "bg-gray-200 text-gray-900",
};

<div className={cn(baseStyles, variants[variant])} />;
```

### Base + Conditional + Custom

```tsx
function Component({ isActive, className }) {
  return (
    <div
      className={cn(
        "base-styles", // Always applied
        isActive && "active", // Conditional
        className, // Custom from props
      )}
    />
  );
}
```

### Multiple Conditional States

```tsx
<button
  className={cn(
    "btn",
    size === "sm" && "btn-sm",
    size === "md" && "btn-md",
    size === "lg" && "btn-lg",
    variant === "primary" && "btn-primary",
    variant === "secondary" && "btn-secondary",
    isLoading && "loading",
    disabled && "disabled",
  )}
/>
```

### Forwarding className Props

```tsx
interface ComponentProps {
  className?: string;
  // ... other props
}

function Component({ className, ...props }: ComponentProps) {
  return (
    <div
      className={cn(
        "default-component-styles",
        className, // Allow override/extension
      )}
      {...props}
    />
  );
}
```

## Advantages

### Clean Syntax

```tsx
// Without cn - verbose and error-prone
<div className={`btn ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''} ${className || ''}`} />

// With cn - clean and readable
<div className={cn('btn', isActive && 'active', isDisabled && 'disabled', className)} />
```

### Type Safety

TypeScript recognizes the function signature and provides autocomplete for string literals while allowing conditionals.

### No Dependencies

Simple implementation with no external dependencies. Alternative libraries like `clsx` or `classnames` offer similar functionality but add bundle size.

### Tailwind Friendly

Works perfectly with Tailwind's utility-first approach where many conditional classes are common.

## Limitations

### No Class Deduplication

The function doesn't remove duplicate classes:

```tsx
cn("text-lg", "text-sm");
// Returns: "text-lg text-sm"
// CSS: Last class wins (text-sm applied)
```

**Note**: For Tailwind, this is usually fine as classes are ordered in CSS by specificity. For complex scenarios, consider using `tailwind-merge`:

```tsx
import { twMerge } from "tailwind-merge";

export function cn(...classes) {
  return twMerge(classes.filter(Boolean).join(" "));
}
```

### No Object Syntax

Unlike `classnames` library, doesn't support object syntax:

```tsx
// Not supported
cn({
  "text-lg": true,
  "font-bold": isActive,
});

// Use conditionals instead
cn("text-lg", isActive && "font-bold");
```

## Testing

The utility has 100% test coverage with the following scenarios:

```typescript
// Merges multiple classes
cn("a", "b", "c") === "a b c";

// Filters out falsy values
cn("a", false, "b", null, "c", undefined) === "a b c";

// Handles conditional expressions
cn("base", condition && "conditional") === "base conditional"; // when true
cn("base", condition && "conditional") === "base"; // when false

// Returns empty string for no truthy values
cn(false, null, undefined) === "";

// Handles empty strings
cn("", "class") === "class";
```

## Performance Considerations

### Highly Performant

- Simple operations (filter + join)
- No regex or complex parsing
- No object allocation
- Inline-able by minifiers

### No Runtime Overhead

For static classes, modern bundlers can optimize:

```tsx
cn("static", "classes");
// May be optimized to: "static classes"
```

## Related

- All components in the application use `cn` for class name merging
- [Button](../../components/ui/Button.md) - Example: variant and size styling
- [Card](../../components/ui/Card.md) - Example: forwarding className
- [Chip](../../components/ui/Chip.md) - Example: complex conditionals
- [ADR-003: Styling Approach](../../../.cursor/features/active/setup-project/adr/ADR-003-styling-approach.md) - Tailwind CSS usage

## Alternatives

### clsx / classnames

Popular libraries with similar functionality:

```bash
npm install clsx
# or
npm install classnames
```

```tsx
import clsx from "clsx";

clsx("a", null, "b"); // 'a b'
clsx({ active: true, disabled: false }); // 'active'
```

**Pros**: Object syntax support, well-tested, widely used
**Cons**: Additional dependency, slightly larger bundle

### tailwind-merge

Combines class names with Tailwind-aware deduplication:

```tsx
import { twMerge } from "tailwind-merge";

twMerge("text-lg", "text-sm"); // 'text-sm'
```

**Pros**: Prevents Tailwind class conflicts
**Cons**: Larger bundle, may not be needed for most cases

For Rule Bound, the simple `cn` implementation is sufficient and keeps the bundle lean.
