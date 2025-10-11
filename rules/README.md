# Spirare Development Rules Directory

This directory contains comprehensive documentation and guidelines for the Spirare meditation application. All detailed patterns, architectural decisions, and implementation guides have been centralized here.

## 📚 Essential Rules (Must Read)

### ⚠️ Critical - Data Fetching
**[REACT_QUERY_PATTERNS.md](./REACT_QUERY_PATTERNS.md)**
- **ALL** API calls must use React Query providers
- NEVER use `fetch()` directly in components
- One provider per file in `/src/providers/`
- Critical for cache management and data consistency

### ⚠️ Critical - Type Safety
**[TYPE_SAFETY_RULES.md](./TYPE_SAFETY_RULES.md)**
- ALL types must be centralized in `/src/types/`
- NEVER define interfaces in API routes or providers
- Shared types between frontend and backend
- Essential for compile-time safety

### Component Architecture
**[COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md)**
- Global pure components vs route-specific components
- Clear separation of concerns
- API usage patterns

## 📖 System Documentation

### Project Information
**[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)**
- Complete feature overview
- Setup and installation
- Technology stack
- Brand identity guidelines

### File Organization
**[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)**
- Complete project structure
- File organization rules
- Architecture layers
- Directory patterns

### Database System
**[DATABASE.md](./DATABASE.md)**
- MongoDB collections structure
- Schemas and validation
- Service layer patterns
- Seeding procedures

### API Type System
**[GLOBAL_API_TYPES.md](./GLOBAL_API_TYPES.md)**
- 40+ API type definitions
- Request/response contracts
- Category organization
- Usage examples

### Meditation System
**[MEDITATION_METHODOLOGY.md](./MEDITATION_METHODOLOGY.md)**
- Dynamic content composition
- Session structure
- Theme-specific overrides
- Algorithm details

### API Best Practices
**[MEDITATION_API_REVIEW.md](./MEDITATION_API_REVIEW.md)**
- Code quality improvements
- Performance optimizations
- Error handling patterns
- Documentation standards

## 🎯 Quick Start Guide

### Before Writing Code
1. Read **[REACT_QUERY_PATTERNS.md](./REACT_QUERY_PATTERNS.md)** for data fetching
2. Review **[TYPE_SAFETY_RULES.md](./TYPE_SAFETY_RULES.md)** for types
3. Check **[COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md)** for structure

### Creating New Features
1. **APIs**: Reference **[GLOBAL_API_TYPES.md](./GLOBAL_API_TYPES.md)** for types
2. **Database**: Follow **[DATABASE.md](./DATABASE.md)** patterns
3. **Components**: Use **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** organization

### Code Review Checklist
- ✅ Data fetching uses React Query providers
- ✅ Types are centralized in `/src/types/`
- ✅ Components follow architecture patterns
- ✅ API contracts match type definitions

## 🔍 Quick Reference Patterns

### Data Fetching Pattern
```typescript
// ✅ CORRECT
import { useDataQuery } from "@/providers";
const { data, isLoading } = useDataQuery();

// ❌ WRONG
useEffect(() => {
  fetch("/api/data").then(r => r.json());
}, []);
```

### Type Safety Pattern
```typescript
// ✅ CORRECT
import type { ApiResponse } from "@/types/api";
import { DatabaseModel } from "@/types/database";

// ❌ WRONG
interface LocalType { // Never define locally
  field: string;
}
```

### Component Organization
```
src/app/
├── components/              # ✅ Pure global components
│   └── Button.tsx          # No API calls
├── admin/
│   ├── _components/        # ✅ Route-specific components
│   │   └── ThemeForm.tsx  # Can use APIs
│   └── page.tsx           # ✅ Pages with logic
```

## 📊 Rules Coverage

| Rule Document | Coverage | Status | Priority |
|---------------|----------|--------|----------|
| REACT_QUERY_PATTERNS.md | Data Fetching | ✅ Complete | Critical |
| TYPE_SAFETY_RULES.md | Type System | ✅ Complete | Critical |
| COMPONENT_ARCHITECTURE.md | Components | ✅ Complete | High |
| PROJECT_OVERVIEW.md | Project Info | ✅ Complete | Medium |
| FILE_STRUCTURE.md | Organization | ✅ Complete | Medium |
| DATABASE.md | Data Layer | ✅ Complete | High |
| GLOBAL_API_TYPES.md | API Types | ✅ Complete | High |
| MEDITATION_METHODOLOGY.md | Business Logic | ✅ Complete | Medium |
| MEDITATION_API_REVIEW.md | Best Practices | ✅ Complete | Medium |

## 🔄 Rules Maintenance

### When to Update Rules
- New architectural patterns are introduced
- Breaking changes in technologies
- New quality standards are adopted
- Common mistakes are identified

### How to Add New Rules
1. Create new `.md` file in `/rules/`
2. Use clear examples (✅ correct vs ❌ incorrect)
3. Explain rationale and benefits
4. Update this README with reference
5. Link from `.github/copilot-instructions.md`

### Version Control
Rules are kept synchronized with the codebase. When implementation patterns change, rules are updated to reflect current best practices.

---

**Important**: Always consult the relevant rules before implementing new features. These documents prevent common mistakes and ensure consistency across the codebase.