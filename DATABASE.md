# Spirare Database System

This document describes the MongoDB-based database system for the Spirare meditation application.

## Overview

The database system is built with:
- **MongoDB** as the primary database
- **Zod** for data validation
- **TypeScript** for type safety
- **Next.js API routes** for CRUD operations

## Database Structure

### Collections

1. **audios** - Audio tracks for meditation
2. **themes** - Meditation themes (anxiety, focus, etc.)
3. **meditation_database** - Main meditation content and structure

### Data Models

#### Audio
```typescript
{
  _id: ObjectId,
  title: string,         // Display name
  artist: string,        // Artist/Creator
  src: string,          // Audio file URL
  fadeInMs?: number,    // Fade in duration
  fadeOutMs?: number,   // Fade out duration
  volume?: number,      // Default volume (0-1)
  createdAt: Date,
  updatedAt: Date
}
```

#### Theme
```typescript
{
  _id: ObjectId,
  category: string,      // Unique identifier (e.g., "anxiety")
  title: string,         // Display name
  description?: string,  // Theme description
  structure: {           // Overrides for meditation phases
    opening?: {...},
    concentration?: {...},
    exploration?: {...},
    awakening?: {...}
  },
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Meditation Database
```typescript
{
  _id: ObjectId,
  general: {             // Default content for all phases
    opening: {
      psychoeducation: ContentItem[],
      intention: ContentItem[],
      posture_and_environment: ContentItem[],
      initial_breathing: ContentItem[],
      attention_orientation: ContentItem[]
    },
    concentration: {
      guided_breathing_rhythm: ContentItem[],
      progressive_body_relaxation: ContentItem[],
      non_judgmental_observation: ContentItem[],
      functional_silence: ContentItem[]
    },
    exploration: {
      main_focus: ContentItem[],
      narrative_guidance_or_visualization: ContentItem[],
      subtle_reflection_or_insight: ContentItem[],
      emotional_integration: ContentItem[]
    },
    awakening: {
      body_reorientation: ContentItem[],
      final_breathing: ContentItem[],
      intention_for_the_rest_of_the_day: ContentItem[],
      closing: ContentItem[]
    }
  },
  structure: {           // Order of elements in each phase
    opening: string[],
    concentration: string[],
    exploration: string[],
    awakening: string[]
  },
  themes: Theme[],           // Array of available themes
  audios: Audio[],           // Array of available audios
  version: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### Content Item
```typescript
{
  _id?: ObjectId,
  text: string,          // Meditation instruction text
  order: number,         // Order in sequence
  duration?: number,     // Duration in seconds
  audioId?: ObjectId,    // Reference to background audio
  createdAt?: Date,
  updatedAt?: Date
}
```

## API Endpoints

### Database Management
- `GET /api/database` - Get complete meditation database
- `PUT /api/database` - Update database (general content, structure, themes, audios)
- `POST /api/database/seed` - Seed database with initial data

### Audio Management
- `GET /api/database/audios` - Get all audios
- `POST /api/database/audios` - Create new audio
- `GET /api/database/audios/[id]` - Get audio by ID
- `PUT /api/database/audios/[id]` - Update audio
- `DELETE /api/database/audios/[id]` - Delete audio

### Theme Management
- `GET /api/database/themes` - Get all themes
- `POST /api/database/themes` - Create new theme
- `GET /api/database/themes/[id]` - Get theme by ID
- `PUT /api/database/themes/[id]` - Update theme
- `DELETE /api/database/themes/[id]` - Delete theme

## Services

### AudioService
```typescript
AudioService.getAll() // Get all audios
AudioService.getById(id) // Get audio by ID
AudioService.create(data) // Create new audio
AudioService.update(id, data) // Update audio
AudioService.delete(id) // Delete audio
AudioService.getAllAsArray() // Get as array for embedding
```

### ThemeService
```typescript
ThemeService.getAll() // Get all themes
ThemeService.getActive() // Get active themes only
ThemeService.getById(id) // Get theme by ID
ThemeService.getByCategory(category) // Get theme by category
ThemeService.create(data) // Create new theme
ThemeService.update(id, data) // Update theme
ThemeService.setActive(id, isActive) // Enable/disable theme
ThemeService.delete(id) // Delete theme
```

### MeditationDatabaseService
```typescript
MeditationDatabaseService.get() // Get main database
MeditationDatabaseService.updateGeneral(data) // Update general content
MeditationDatabaseService.updateStructure(data) // Update structure
MeditationDatabaseService.addTheme(theme) // Add theme
MeditationDatabaseService.removeTheme(category) // Remove theme by category
MeditationDatabaseService.addAudio(audio) // Add audio
MeditationDatabaseService.removeAudio(audioId) // Remove audio by ID
MeditationDatabaseService.syncWithCollections() // Sync with separate collections
MeditationDatabaseService.initializeDefault() // Initialize with defaults
```

## Setup

1. **Install MongoDB** locally or use MongoDB Atlas
2. **Set environment variables:**
   ```bash
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB=spirare
   ```
3. **Seed the database:**
   ```bash
   POST /api/database/seed
   ```

## Usage Examples

### Creating an Audio Track
```typescript
const audio = await AudioService.create({
  title: 'Ocean Waves',
  artist: 'Nature Sounds',
  src: '/audio/ocean-waves.mp3',
  fadeInMs: 2000,
  fadeOutMs: 2000,
  volume: 0.3
});
```

### Creating a Theme
```typescript
const theme = await ThemeService.create({
  category: 'anxiety',
  title: 'Anxiety Relief',
  description: 'Meditation practices for anxiety management',
  structure: {
    opening: {
      psychoeducation: [
        {
          text: 'Anxiety is a natural response...',
          order: 0,
          duration: 30
        }
      ]
    }
  },
  isActive: true
});
```

### Updating General Content
```typescript
await MeditationDatabaseService.updateGeneral({
  phase: 'opening',
  contentType: 'psychoeducation',
  content: [
    {
      text: 'Welcome to this meditation session...',
      order: 0,
      duration: 45
    }
  ]
});
```

## Validation

All data is validated using Zod schemas before database operations. This ensures:
- Type safety
- Data integrity
- Consistent error handling
- Clear validation messages

## Error Handling

The system provides comprehensive error handling:
- Validation errors return 400 with details
- Not found errors return 404
- Server errors return 500 with safe messages
- All errors are logged for debugging

## Migration

To migrate from the existing JSON-based system:
1. Use the seed endpoint to populate initial data
2. Update application code to use the new API endpoints
3. Replace direct JSON file access with service calls