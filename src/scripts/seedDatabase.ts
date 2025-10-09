import { promises as fs } from "fs";
import path from "path";
import { MeditationsService } from "@/services/meditationsService";
import { StructureService } from "@/services/structureService";
import { AudioService } from "@/services/audiosService";
import { ThemeService } from "@/services/themesService";

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Read the JSON data
    const dbJsonPath = path.join(process.cwd(), "src/data/db.json");
    const dbJsonContent = await fs.readFile(dbJsonPath, "utf-8");
    const dbData = JSON.parse(dbJsonContent);

    // Seed audios collection
    console.log("🎵 Seeding audios collection...");
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
          console.log(
            `⚠️  Audio "${audioData.title}" already exists or failed to create:`,
            error
          );
        }
      }
    }

    // Seed themes collection
    console.log("🎨 Seeding themes collection...");
    if (dbData.themes && Array.isArray(dbData.themes)) {
      for (const themeData of dbData.themes) {
        try {
          await ThemeService.create({
            category: themeData.category,
            title: themeData.title,
            description: themeData.description,
            meditations: themeData.meditations,
            isActive: themeData.isActive !== false,
          });
          console.log(`✅ Theme "${themeData.category}" created`);
        } catch (error) {
          console.log(
            `⚠️  Theme "${themeData.category}" already exists or failed to create:`,
            error
          );
        }
      }
    }

    // Seed structure collection
    console.log("📚 Seeding structure collection...");
    if (dbData.structure) {
      console.log("📚 Setting structure document...");
      await StructureService.set(dbData.structure);
    } else {
      // Initialize with default structure if no structure data provided
      console.log("📚 Initializing default structure...");
      await StructureService.initializeDefault();
    }

    // Seed meditations collection
    console.log("📝 Seeding meditations collection...");
    if (dbData.meditations) {
      try {
        await MeditationsService.update(dbData.meditations);
        console.log("✅ Meditations data updated");
      } catch (error) {
        console.log(
          "⚠️  Failed to update meditations, initializing default:",
          error
        );
        await MeditationsService.initializeDefault();
      }
    } else {
      // Initialize with default meditations if no data provided
      console.log("📝 Initializing default meditations...");
      await MeditationsService.initializeDefault();
    }

    console.log("🎉 Database seeding completed successfully!");

    const audiosCount = dbData.audios?.length || 0;
    const themesCount = dbData.themes?.length || 0;
    const structureCount = dbData.structure ? 1 : 0;

    return {
      success: true,
      message: "Database seeded successfully",
      data: {
        audios: audiosCount,
        themes: themesCount,
        structure: structureCount,
        meditations: "initialized",
      },
    };
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    return {
      success: false,
      message: "Failed to seed database",
      error: error instanceof Error ? error.message : "Unknown error",
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
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

export { seedDatabase };
