import { getDatabase } from "@/lib/mongodb";
import { ThemeService } from "./themesService";
import { SongService } from "./songsService";
import { StructureService } from "./structureService";
import { MeditationsService } from "./meditationsService";
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
      await db.collection("songs").deleteMany({});
      await db.collection("structure").deleteMany({});
      await db.collection("meditations").deleteMany({});

      // Helper function to transform string arrays to ContentItem arrays
      const transformToContentItems = (items: string[]) => {
        return items.map((text, index) => ({
          text,
          order: index,
        }));
      };

      // Helper function to transform meditation phase data
      const transformPhaseData = (phaseData: Record<string, string[]>) => {
        const transformed: Record<
          string,
          Array<{ text: string; order: number }>
        > = {};
        for (const [key, value] of Object.entries(phaseData)) {
          transformed[key] = Array.isArray(value)
            ? transformToContentItems(value)
            : [];
        }
        return transformed;
      };

      // Seed themes with embedded meditations
      if (data.themes && Array.isArray(data.themes)) {
        for (const theme of data.themes) {
          // Remove _id field from the theme before creating to let MongoDB generate it
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _id, createdAt, updatedAt, meditations, ...themeData } =
            theme;

          // Transform meditation data from string arrays to ContentItem arrays
          const transformedMeditations = {
            opening: transformPhaseData(meditations.opening),
            concentration: transformPhaseData(meditations.concentration),
            exploration: transformPhaseData(meditations.exploration),
            awakening: transformPhaseData(meditations.awakening),
          };

          await ThemeService.create({
            ...themeData,
            meditations: transformedMeditations,
          });
        }
      }

      // Seed songs
      if (data.songs && Array.isArray(data.songs)) {
        for (const song of data.songs) {
          // Remove _id field from the song before creating
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _id, createdAt, updatedAt, ...songData } = song;
          await SongService.create(songData);
        }
      }

      // Seed structure document
      if (data.structure) {
        await StructureService.set(data.structure);
      } else {
        await StructureService.initializeDefault();
      }

      // Seed meditations document - transform string arrays to ContentItem arrays
      if (data.meditations) {
        const transformedMeditations = {
          opening: transformPhaseData(data.meditations.opening),
          concentration: transformPhaseData(data.meditations.concentration),
          exploration: transformPhaseData(data.meditations.exploration),
          awakening: transformPhaseData(data.meditations.awakening),
        };

        // Create new by setting the data directly
        await db.collection("meditations").insertOne({
          ...transformedMeditations,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        await MeditationsService.initializeDefault();
      }

      return {
        themes: data.themes?.length || 0,
        songs: data.songs?.length || 0,
        structure: data.structure ? 1 : 0,
        meditations: data.meditations ? 1 : 0,
      };
    } catch (error) {
      console.error("Error seeding database:", error);
      throw error;
    }
  }

  static async backupDatabase() {
    try {
      const themes = await ThemeService.getAll();
      const songs = await SongService.getAll();
      const structure = await StructureService.get();
      const meditations = await MeditationsService.get();

      return {
        themes,
        songs,
        structure,
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
        .collection("songs")
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
      const songsCount = await db.collection("songs").countDocuments();
      const structureCount = await db.collection("structure").countDocuments();
      const meditationsCount = await db
        .collection("meditations")
        .countDocuments();

      return {
        collections: {
          themes: themesCount,
          songs: songsCount,
          structure: structureCount,
          meditations: meditationsCount,
        },
        total: themesCount + songsCount + structureCount + meditationsCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error getting database status:", error);
      throw error;
    }
  }
}
