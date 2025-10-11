# Type Safety Rules - Added to Copilot Instructions

## Summary

Added comprehensive type safety guidelines to `.github/copilot-instructions.md` to enforce shared types between frontend and backend.

## New Section Added: "🔷 Type Safety Pattern"

### Location in Instructions

Inserted after the "Data Fetching Pattern" section, before "Estrutura de Arquivos"

### Key Rules Enforced

#### 🚨 Critical Rules

1. **NO local type definitions in API routes or providers**

   - ❌ Never create `interface` inside `/api/**/*.ts`
   - ❌ Never create `interface` inside `/providers/**/*.ts`
   - ❌ Never duplicate types between frontend and backend

2. **ALWAYS use centralized types**
   - ✅ Define all types in `/src/types/api.ts` or `/src/types/database.ts`
   - ✅ Import types from `@/types` or `@/types/api`
   - ✅ Use same types in API routes and providers

### Structure Mandated

```
src/types/
├── database.ts      # Zod schemas + model types (Theme, Song, etc.)
├── api.ts          # Request/Response types for all APIs
└── index.ts        # Re-exports everything
```

### Examples Provided

#### ❌ INCORRECT (what NOT to do)

- Local interface in API route
- Duplicated interface in provider
- No type sharing between layers

#### ✅ CORRECT (what TO do)

- Types defined in `/src/types/api.ts`
- Same types imported in API route
- Same types imported in provider
- Full type safety chain

### Benefits Highlighted

- ✅ Type safety total entre frontend e backend
- ✅ Mudanças em contratos de API detectadas em compile-time
- ✅ IntelliSense completo em toda a aplicação
- ✅ Single source of truth para estruturas de dados
- ✅ Refactoring seguro e automatizado

## Impact

This guideline ensures that:

1. **All future development** will use shared types
2. **Copilot suggestions** will follow the centralized type pattern
3. **Code reviews** have clear standards to enforce
4. **Type mismatches** are caught at compile-time, not runtime
5. **API contracts** are explicitly defined and shared

## Related Files

- `.github/copilot-instructions.md` - Updated with type safety rules
- `src/types/api.ts` - Central API types file
- `src/types/database.ts` - Database schemas and types
- `src/types/index.ts` - Central exports
- `GLOBAL_API_TYPES.md` - Implementation documentation

## Enforcement

With these instructions in place, GitHub Copilot will:

- Suggest importing from `@/types` instead of creating local types
- Warn against defining interfaces in API routes
- Recommend using existing types from the central location
- Follow the established pattern in all generated code
