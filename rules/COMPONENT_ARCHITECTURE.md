# Component Architecture Rules

## Overview

Guidelines for organizing React components in the Spirare application.

## Component Organization

### Directory Structure

```
src/app/
├── components/              # ✅ Global, pure components (NO API calls)
│   ├── Button.tsx
│   ├── Card.tsx
│   └── meditation/
│       ├── StartOverlay.tsx
│       ├── SessionHeader.tsx
│       └── TimerPanel.tsx
├── admin/
│   ├── _components/        # ✅ Admin-specific (CAN use APIs)
│   │   ├── ThemeForm.tsx
│   │   └── AudioList.tsx
│   └── page.tsx           # ✅ Page with inline logic
└── [category]/
    ├── _components/        # ✅ Category-specific
    │   └── StageCard.tsx
    └── page.tsx
```

## Rules

### ❌ Don't Do This

```typescript
// ❌ WRONG - API call in global component
// src/app/components/ThemeCard.tsx
export function ThemeCard() {
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    fetch("/api/themes").then(r => r.json()).then(setTheme);
  }, []);
  return <div>{theme?.title}</div>;
}
```

```typescript
// ❌ WRONG - Global component in route-specific folder
// src/app/admin/_components/Button.tsx
export function Button() {
  return <button>Click</button>;
}
```

### ✅ Do This Instead

```typescript
// ✅ CORRECT - Pure component in global folder
// src/app/components/ThemeCard.tsx
export function ThemeCard({ theme }: { theme: Theme }) {
  return <div>{theme.title}</div>;
}
```

```typescript
// ✅ CORRECT - Component with API logic in route folder
// src/app/admin/_components/ThemesList.tsx
import { useThemesQuery } from "@/providers";

export function ThemesList() {
  const { data: themes } = useThemesQuery();
  return (
    <div>
      {themes?.map(theme => (
        <ThemeCard key={theme._id} theme={theme} />
      ))}
    </div>
  );
}
```

```typescript
// ✅ CORRECT - Page with inline logic
// src/app/admin/page.tsx
export default function AdminPage() {
  const { data: themes } = useThemesQuery();
  const createMutation = useCreateThemeMutation();
  
  const handleCreate = () => {
    createMutation.mutate({ /* data */ });
  };
  
  return <div>{/* JSX */}</div>;
}
```

## Component Types

### 1. Pure Components (`src/app/components/`)

**Purpose:** Reusable UI components without side effects

**Characteristics:**
- No API calls
- No direct database access
- No React Query hooks
- Only receive props and render UI
- Can use local state (useState) for UI state only
- Can use React hooks (useMemo, useCallback)

**Examples:**
- `Button.tsx` - Generic button component
- `Card.tsx` - Card layout component
- `Modal.tsx` - Modal dialog component
- `Input.tsx` - Form input component

### 2. Route-Specific Components (`src/app/[route]/_components/`)

**Purpose:** Components tied to specific routes/features

**Characteristics:**
- CAN make API calls via React Query
- CAN use providers and mutations
- CAN have complex business logic
- Should NOT be reused in other routes
- Prefix folder with `_` to indicate private

**Examples:**
- `src/app/admin/_components/ThemeForm.tsx` - Theme editing form
- `src/app/admin/_components/AudioUploader.tsx` - Audio upload widget
- `src/app/[category]/_components/StageSelector.tsx` - Stage navigation

### 3. Pages (`src/app/[route]/page.tsx`)

**Purpose:** Route entry points

**Characteristics:**
- CAN have inline logic
- CAN use React Query hooks directly
- CAN have useState, useEffect, etc.
- Should be relatively simple
- Complex logic → extract to `_components/`

**When to extract:**
- Component exceeds ~200 lines
- Logic is reused in multiple places within the route
- Component has complex state management

## Naming Conventions

### File Names
- PascalCase for components: `ThemeCard.tsx`
- camelCase for hooks: `useThemeForm.ts`
- camelCase for utils: `formatDate.ts`

### Component Names
- Match file name: `ThemeCard.tsx` exports `ThemeCard`
- Descriptive and specific: `AudioUploadButton` not `Button2`

### Folder Names
- kebab-case for routes: `[category]`, `[stage]`
- Prefix with `_` for private: `_components`, `_utils`

## Import Organization

```typescript
// ✅ CORRECT - Organized imports
// 1. External dependencies
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// 2. Internal providers
import { useThemesQuery } from "@/providers";

// 3. Types
import type { Theme } from "@/types/database";

// 4. Components
import { Button } from "@/components/Button";

// 5. Styles
import styles from "./styles.module.scss";
```

## Props Patterns

### ✅ CORRECT - Explicit props interface

```typescript
interface ThemeCardProps {
  theme: Theme;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function ThemeCard({ theme, onEdit, onDelete, className }: ThemeCardProps) {
  return <div className={className}>{theme.title}</div>;
}
```

### ❌ WRONG - Inline props type

```typescript
export function ThemeCard({ theme, onEdit }: { theme: Theme; onEdit: () => void }) {
  return <div>{theme.title}</div>;
}
```

## State Management

### Local UI State
Use `useState` for component-specific UI state:

```typescript
// ✅ CORRECT
const [isOpen, setIsOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState("themes");
```

### Server State
Use React Query for server data:

```typescript
// ✅ CORRECT
const { data: themes } = useThemesQuery();
const mutation = useCreateThemeMutation();
```

### Form State
Use controlled components or form libraries:

```typescript
// ✅ CORRECT - Controlled
const [title, setTitle] = useState("");

// ✅ CORRECT - Form library
const { register, handleSubmit } = useForm<ThemeForm>();
```

## Benefits

- **Clear separation** - Easy to find components
- **Reusability** - Pure components can be used anywhere
- **Testability** - Pure components are easier to test
- **Maintainability** - Consistent structure reduces confusion
- **Scalability** - Pattern works for projects of any size

## Related Documentation

- [TYPE_SAFETY_RULES.md](./TYPE_SAFETY_RULES.md) - Type patterns
- [GLOBAL_API_TYPES.md](./GLOBAL_API_TYPES.md) - API types
- [REACT_QUERY_PATTERNS.md](./REACT_QUERY_PATTERNS.md) - Data fetching patterns
