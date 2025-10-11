# React Query Patterns

## Overview

Guidelines for using React Query (@tanstack/react-query) in the Spirare application. ALL data fetching MUST go through React Query providers.

## Critical Rule

🚨 **NEVER use `fetch()` directly in components or pages**

## Provider Structure

### Directory Organization

```
src/providers/
├── index.ts                        # Central re-export
├── useCategoriesQuery.ts          # Query
├── useMeditationSessionQuery.ts   # Query
├── useThemesQuery.ts              # Query
├── useCreateThemeMutation.ts      # Mutation
├── useUpdateThemeMutation.ts      # Mutation
├── useDeleteThemeMutation.ts      # Mutation
└── [scope]/                       # Optional scoping
    ├── useAudiosQuery.ts
    └── useCreateAudioMutation.ts
```

### Rules

1. **One hook per file** - Each provider exports ONE specific hook
2. **Descriptive names** - `useCategoriesQuery` not `useData`
3. **Central export** - All providers re-exported from `index.ts`
4. **Type safety** - Import types from `@/types/api`

## Query Pattern

### Basic Query

```typescript
// src/providers/useCategoriesQuery.ts
import { useQuery } from "@tanstack/react-query";
import type { Category, GetCategoriesResponse } from "@/types/api";

export const useCategoriesQuery = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data: GetCategoriesResponse = await response.json();
      return data.categories;
    },
  });
};
```

### Query with Parameters

```typescript
// src/providers/useMeditationSessionQuery.ts
import { useQuery } from "@tanstack/react-query";
import type {
  MeditationSession,
  GetMeditationSessionResponse,
} from "@/types/api";

export const useMeditationSessionQuery = (category: string) => {
  return useQuery<MeditationSession>({
    queryKey: ["meditation", category],
    queryFn: async () => {
      const response = await fetch(`/api/meditation/${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch session for ${category}`);
      }
      const data: GetMeditationSessionResponse = await response.json();
      return data.session;
    },
    enabled: !!category, // Only run if category is provided
  });
};
```

### Query with Options

```typescript
// src/providers/useThemesQuery.ts
import { useQuery } from "@tanstack/react-query";
import type { Theme, GetThemesResponse } from "@/types/api";

export const useThemesQuery = () => {
  return useQuery<Theme[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const response = await fetch("/api/database/themes");
      if (!response.ok) {
        throw new Error("Failed to fetch themes");
      }
      const data: GetThemesResponse = await response.json();
      return data.themes;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
```

## Mutation Pattern

### Basic Mutation

```typescript
// src/providers/useCreateThemeMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateThemeRequest, CreateThemeResponse } from "@/types/api";

export const useCreateThemeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateThemeResponse, Error, CreateThemeRequest>({
    mutationFn: async (data: CreateThemeRequest) => {
      const response = await fetch("/api/database/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create theme");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate themes query to refetch
      queryClient.invalidateQueries({ queryKey: ["themes"] });
    },
  });
};
```

### Mutation with Optimistic Updates

```typescript
// src/providers/useUpdateThemeMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Theme,
  UpdateThemeRequest,
  UpdateThemeResponse,
} from "@/types/api";

export const useUpdateThemeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateThemeResponse,
    Error,
    { id: string; data: UpdateThemeRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/database/themes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update theme");
      }

      return response.json();
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["themes"] });

      // Snapshot previous value
      const previousThemes = queryClient.getQueryData<Theme[]>(["themes"]);

      // Optimistically update
      queryClient.setQueryData<Theme[]>(["themes"], (old) =>
        old?.map((theme) => (theme._id === id ? { ...theme, ...data } : theme))
      );

      // Return context with snapshot
      return { previousThemes };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousThemes) {
        queryClient.setQueryData(["themes"], context.previousThemes);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["themes"] });
    },
  });
};
```

### Delete Mutation

```typescript
// src/providers/useDeleteThemeMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DeleteThemeResponse } from "@/types/api";

export const useDeleteThemeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteThemeResponse, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/database/themes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete theme");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
    },
  });
};
```

## Usage in Components

### Basic Usage

```typescript
// src/app/admin/page.tsx
import { useThemesQuery } from "@/providers";

export default function AdminPage() {
  const { data: themes, isLoading, error } = useThemesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {themes?.map((theme) => (
        <div key={theme._id}>{theme.title}</div>
      ))}
    </div>
  );
}
```

### With Mutations

```typescript
// src/app/admin/page.tsx
import {
  useThemesQuery,
  useCreateThemeMutation,
  useDeleteThemeMutation,
} from "@/providers";

export default function AdminPage() {
  const { data: themes } = useThemesQuery();
  const createMutation = useCreateThemeMutation();
  const deleteMutation = useDeleteThemeMutation();

  const handleCreate = () => {
    createMutation.mutate({
      category: "focus",
      title: "Focus Enhancement",
      description: "Improve concentration",
      meditations: {
        /* ... */
      },
      isActive: true,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={createMutation.isPending}>
        {createMutation.isPending ? "Creating..." : "Create Theme"}
      </button>

      {themes?.map((theme) => (
        <div key={theme._id}>
          {theme.title}
          <button
            onClick={() => handleDelete(theme._id)}
            disabled={deleteMutation.isPending}
          >
            Delete
          </button>
        </div>
      ))}

      {createMutation.isError && (
        <div>Error: {createMutation.error.message}</div>
      )}
    </div>
  );
}
```

### With Loading States

```typescript
import { useThemesQuery } from "@/providers";

export default function ThemesList() {
  const { data, isLoading, isError, error, refetch } = useThemesQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        {error.message}
        <button onClick={() => refetch()}>Retry</button>
      </ErrorMessage>
    );
  }

  return (
    <div>
      {data?.map((theme) => (
        <ThemeCard key={theme._id} theme={theme} />
      ))}
    </div>
  );
}
```

## Query Keys

### Structure

```typescript
// Simple key
["themes"][
  // With parameter
  ("meditation", category)
][
  // Nested
  ("themes", themeId, "meditations")
][
  // With filters
  ("themes", { active: true, category: "anxiety" })
];
```

### Best Practices

1. **Consistent structure** - Use same pattern across app
2. **Specific keys** - More specific = better cache granularity
3. **Include parameters** - Parameters should be in key
4. **Use arrays** - Always use array format

## Cache Invalidation

### Invalidate Specific Query

```typescript
queryClient.invalidateQueries({ queryKey: ["themes"] });
```

### Invalidate Multiple Queries

```typescript
// Invalidate all queries starting with "themes"
queryClient.invalidateQueries({ queryKey: ["themes"] });

// Invalidate all queries
queryClient.invalidateQueries();
```

### Refetch on Success

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["themes"] });
  queryClient.invalidateQueries({ queryKey: ["categories"] });
};
```

## Error Handling

### Provider Level

```typescript
export const useThemesQuery = () => {
  return useQuery<Theme[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const response = await fetch("/api/database/themes");

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch themes");
      }

      const data: GetThemesResponse = await response.json();
      return data.themes;
    },
    retry: 3, // Retry 3 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```

### Component Level

```typescript
const { data, error, isError } = useThemesQuery();

if (isError) {
  return <div>Error: {error.message}</div>;
}
```

## Benefits

- **Automatic caching** - No manual cache management
- **Background refetching** - Keeps data fresh
- **Optimistic updates** - Better UX
- **Error handling** - Consistent error patterns
- **Loading states** - Built-in loading indicators
- **Type safety** - Full TypeScript support

## Related Documentation

- [TYPE_SAFETY_RULES.md](./TYPE_SAFETY_RULES.md) - Type patterns
- [GLOBAL_API_TYPES.md](./GLOBAL_API_TYPES.md) - API types
- [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) - Component organization
