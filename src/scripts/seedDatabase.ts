import { promises as fs } from 'fs';
import path from 'path';
import { MeditationDatabaseService } from '@/services/meditationDatabaseService';
import { AudioService } from '@/services/audioService';
import { ThemeService } from '@/services/themeService';

interface ContentItem {
  text?: string;
  duration?: number;
  audioId?: string;
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Read the JSON data
    const dbJsonPath = path.join(process.cwd(), 'src/data/db.json');
    const dbJsonContent = await fs.readFile(dbJsonPath, 'utf-8');
    const dbData = JSON.parse(dbJsonContent);

    // Initialize the main meditation database
    console.log('📋 Initializing meditation database...');
    const database = await MeditationDatabaseService.initializeDefault();
    console.log('✅ Meditation database initialized');

    // Seed audios
    console.log('🎵 Seeding audio data...');
    if (dbData.audios && Array.isArray(dbData.audios)) {
      for (const audioData of dbData.audios) {
        try {
          await AudioService.create({
            title: audioData.title,
            artist: audioData.artist,
            src: audioData.src,
            fadeInMs: audioData.fadeInMs,
            fadeOutMs: audioData.fadeOutMs,
            volume: audioData.volume,
          });
          console.log(`✅ Audio "${audioData.title}" created`);
        } catch (error) {
          console.log(`⚠️  Audio "${audioData.title}" already exists or failed to create:`, error);
        }
      }
    }

    // Seed themes
    console.log('🎨 Seeding theme data...');
    if (dbData.themes && Array.isArray(dbData.themes)) {
      for (const themeData of dbData.themes) {
        try {
          await ThemeService.create({
            category: themeData.category,
            title: themeData.title,
            structure: themeData.structure,
            isActive: true,
          });
          console.log(`✅ Theme "${themeData.category}" created`);
        } catch (error) {
          console.log(`⚠️  Theme "${themeData.category}" already exists or failed to create:`, error);
        }
      }
    }

    // Update the main database with the structure from JSON
    console.log('📚 Updating database structure...');
    // Note: Structure is now embedded in themes as arrays, skipping separate structure update
    console.log('✅ Database structure is now managed through themes');

    // Update general content if provided
    if (dbData.general) {
      console.log('📝 Updating general content...');
      const phases = ['opening', 'concentration', 'exploration', 'awakening'] as const;
      
      for (const phase of phases) {
        if (dbData.general[phase]) {
          const contentTypes = Object.keys(dbData.general[phase]);
          
          for (const contentType of contentTypes) {
            const content = dbData.general[phase][contentType];
            if (Array.isArray(content) && content.length > 0) {
              await MeditationDatabaseService.updateGeneral({
                phase,
                contentType,
                content: content.map((item: unknown, index: number) => {
                  const contentItem = item as ContentItem | string;
                  return {
                    text: typeof contentItem === 'string' ? contentItem : contentItem?.text || '',
                    order: index,
                    duration: typeof contentItem === 'object' ? contentItem?.duration : undefined,
                    audioId: typeof contentItem === 'object' ? contentItem?.audioId : undefined,
                  };
                }),
              });
              console.log(`✅ Updated ${phase}.${contentType}`);
            }
          }
        }
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    
    return {
      success: true,
      message: 'Database seeded successfully',
      data: {
        audios: dbData.audios?.length || 0,
        themes: dbData.themes?.length || 0,
        database: database._id,
      },
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return {
      success: false,
      message: 'Failed to seed database',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Allow this script to be run directly
if (require.main === module) {
  seedDatabase()
    .then((result) => {
      console.log(result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { seedDatabase };