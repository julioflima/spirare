# Development Rules Directory

Comprehensive development guidelines and patterns for the Spirare project.

## 🚨 Critical Rules (Must Read First)

- **[REACT_QUERY_PATTERNS.md](./REACT_QUERY_PATTERNS.md)** - Data fetching patterns ⚠️ **CRITICAL**
- **[TYPE_SAFETY_RULES.md](./TYPE_SAFETY_RULES.md)** - Type system rules ⚠️ **CRITICAL**
- **[COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md)** - Component organization

## 📚 System Documentation

- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Project features & tech stack
- **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** - File organization patterns
- **[DATABASE.md](./DATABASE.md)** - MongoDB schemas & operations
- **[GLOBAL_API_TYPES.md](./GLOBAL_API_TYPES.md)** - API type system (40+ types)
- **[MEDITATION_METHODOLOGY.md](./MEDITATION_METHODOLOGY.md)** - Content composition system
- **[MEDITATION_API_REVIEW.md](./MEDITATION_API_REVIEW.md)** - API implementation patterns

## 🎯 Quick Reference

### Before Writing Code
1. Review **REACT_QUERY_PATTERNS.md** for data fetching
2. Check **TYPE_SAFETY_RULES.md** for type definitions  
3. Follow **COMPONENT_ARCHITECTURE.md** for structure

### Code Review Checklist
- ✅ Data fetching uses React Query providers
- ✅ Types are centralized in `/src/types/`
- ✅ Components follow architecture patterns
- ✅ API contracts match type definitions

## 🔄 Maintenance

Rules are kept synchronized with the codebase. When implementation patterns change, documentation is updated to reflect current best practices.

Always consult relevant rules before implementing new features to prevent common mistakes and ensure consistency.