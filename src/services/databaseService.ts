import { getDatabase } from "@/lib/mongodb";
import { ThemesService } from "./themesService";
import { AudioService } from "./audiosService";
import { StructureService } from "./structureService";
import { MeditationService } from "./meditationsService";
import fs from "fs/promises";
import path from "path";

export class DatabaseService {
  static async seedDatabase() {
    try {
      // Read the db.json file
      const dbJsonPath = path.join(process.cwd(), "src/data/db.json");
      const dbContent = await fs.readFile(dbJsonPath, "utf-8");
      const data = JSON.parse(dbContent);

      // Clear existing collections
      const db = await getDatabase();
      await db.collection("themes").deleteMany({});
      await db.collection("audios").deleteMany({});
      await db.collection("structure").deleteMany({});
      await db.collection("meditations").deleteMany({});

      // Seed themes with embedded meditations
      if (data.themes && Array.isArray(data.themes)) {
        for (const theme of data.themes) {
          await ThemesService.create(theme);
        }
      }

      // Seed audios
      if (data.audios && Array.isArray(data.audios)) {
        for (const audio of data.audios) {
          await AudioService.create(audio);
        }
      }

      // Seed structure
      if (data.structure && Array.isArray(data.structure)) {
        for (const structureItem of data.structure) {
          await StructureService.create(structureItem);
        }
      }

      // Seed individual meditations if they exist
      if (data.meditations && Array.isArray(data.meditations)) {
        for (const meditation of data.meditations) {
          await MeditationService.create(meditation);
        }
      }

      return {
        themes: data.themes?.length || 0,
        audios: data.audios?.length || 0,
        structure: data.structure?.length || 0,
        meditations: data.meditations?.length || 0,
      };
    } catch (error) {
      console.error("Error seeding database:", error);
      throw error;
    }
  }

  static async backupDatabase() {
    try {
      const themes = await ThemesService.getAll();
      const audios = await AudioService.getAll();
      const structures = await StructureService.getAll();
      const meditations = await MeditationService.getAll();

      return {
        themes,
        audios,
        structure: structures,
        meditations,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error creating backup:", error);
      throw error;
    }
  }

  static async dropDatabase() {
    try {
      const db = await getDatabase();

      // Drop all collections
      await db
        .collection("themes")
        .drop()
        .catch(() => {});
      await db
        .collection("audios")
        .drop()
        .catch(() => {});
      await db
        .collection("structure")
        .drop()
        .catch(() => {});
      await db
        .collection("meditations")
        .drop()
        .catch(() => {});

      return true;
    } catch (error) {
      console.error("Error dropping database:", error);
      throw error;
    }
  }

  static async getStatus() {
    try {
      const db = await getDatabase();

      const themesCount = await db.collection("themes").countDocuments();
      const audiosCount = await db.collection("audios").countDocuments();
      const structureCount = await db.collection("structure").countDocuments();
      const meditationsCount = await db
        .collection("meditations")
        .countDocuments();

      return {
        collections: {
          themes: themesCount,
          audios: audiosCount,
          structure: structureCount,
          meditations: meditationsCount,
        },
        total: themesCount + audiosCount + structureCount + meditationsCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error getting database status:", error);
      throw error;
    }
  }
}
