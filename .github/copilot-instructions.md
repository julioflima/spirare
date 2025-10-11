# Spirare Development Instructions

Spirare é um ritual de meditação guiada construído com Next.js 15, TypeScript e TailwindCSS.

## 📚 Core Documentation

**ALWAYS consult these rules before development:**

### Essential Rules

- **[REACT_QUERY_PATTERNS.md](../rules/REACT_QUERY_PATTERNS.md)** - Data fetching with React Query ⚠️ **CRITICAL**
- **[TYPE_SAFETY_RULES.md](../rules/TYPE_SAFETY_RULES.md)** - Type definitions and safety ⚠️ **CRITICAL**
- **[COMPONENT_ARCHITECTURE.md](../rules/COMPONENT_ARCHITECTURE.md)** - Component organization patterns

### System Documentation

- **[PROJECT_OVERVIEW.md](../rules/PROJECT_OVERVIEW.md)** - Project features & tech stack
- **[FILE_STRUCTURE.md](../rules/FILE_STRUCTURE.md)** - File organization patterns
- **[DATABASE.md](../rules/DATABASE.md)** - MongoDB schemas & operations
- **[GLOBAL_API_TYPES.md](../rules/GLOBAL_API_TYPES.md)** - API type system (40+ types)
- **[MEDITATION_METHODOLOGY.md](../rules/MEDITATION_METHODOLOGY.md)** - Content composition system
- **[MEDITATION_API_REVIEW.md](../rules/MEDITATION_API_REVIEW.md)** - API best practices

## 🚨 Critical Development Rules

### Data Fetching
**ALL API calls MUST use React Query providers**
- ❌ NEVER use `fetch()` directly in components
- ✅ ALWAYS create providers in `/src/providers/`
- See: [REACT_QUERY_PATTERNS.md](../rules/REACT_QUERY_PATTERNS.md)

### Type Safety
**ALL types MUST be centralized**
- ❌ NEVER define interfaces in API routes or providers
- ✅ ALWAYS use types from `/src/types/api.ts` or `/src/types/database.ts`
- See: [TYPE_SAFETY_RULES.md](../rules/TYPE_SAFETY_RULES.md)

### Component Organization
**Components MUST follow architecture patterns**
- `src/app/components/` - Pure global components (no API calls)
- `src/app/[route]/_components/` - Route-specific components (can use APIs)
- See: [COMPONENT_ARCHITECTURE.md](../rules/COMPONENT_ARCHITECTURE.md)

## 🎯 Quick Development Workflow

1. **Before coding**: Review relevant rules in `/rules/`
2. **Creating APIs**: Check [GLOBAL_API_TYPES.md](../rules/GLOBAL_API_TYPES.md) for types
3. **Database changes**: Follow [DATABASE.md](../rules/DATABASE.md) patterns
4. **Data fetching**: Use [REACT_QUERY_PATTERNS.md](../rules/REACT_QUERY_PATTERNS.md)
5. **Type definitions**: Follow [TYPE_SAFETY_RULES.md](../rules/TYPE_SAFETY_RULES.md)

## 🔗 Quick Reference

```typescript
// ✅ CORRECT Pattern
import { useDataQuery } from "@/providers";
import type { ApiResponse } from "@/types/api";
import { DatabaseModel } from "@/types/database";

const MyComponent = () => {
  const { data, isLoading } = useDataQuery();
  return <div>{data?.field}</div>;
};
```

## 📂 Rules Directory Structure

```
/rules/
├── INDEX.md                     # This file - Rules directory guide  
├── REACT_QUERY_PATTERNS.md      # ⚠️ CRITICAL - Data fetching
├── TYPE_SAFETY_RULES.md         # ⚠️ CRITICAL - Type definitions
├── COMPONENT_ARCHITECTURE.md    # Component organization
├── PROJECT_OVERVIEW.md          # Project features & setup
├── FILE_STRUCTURE.md           # File organization
├── DATABASE.md                 # MongoDB schemas
├── GLOBAL_API_TYPES.md        # API type system
├── MEDITATION_METHODOLOGY.md   # Meditation composition
└── MEDITATION_API_REVIEW.md    # API best practices
```

**Note**: All detailed project information, architecture details, and implementation patterns are in `/rules/`. This instruction file serves as a quick reference and gateway to comprehensive documentation.