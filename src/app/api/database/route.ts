import { NextRequest, NextResponse } from "next/server";
import { MeditationsService } from "@/services/meditationsService";
import { StructureService } from "@/services/structureService";
import { AudioService } from "@/services/audiosService";
import { ThemeService } from "@/services/themesService";
import { getDatabase } from "@/lib/mongodb";
import fs from "fs/promises";
import path from "path";

// GET /api/database - Get database status
export async function GET() {
  try {
    const db = await getDatabase();
    
    const themesCount = await db.collection("themes").countDocuments();
    const audiosCount = await db.collection("audios").countDocuments();
    const structureCount = await db.collection("structure").countDocuments();
    const meditationsCount = await db.collection("meditations").countDocuments();

    return NextResponse.json({
      success: true,
      status: {
        collections: {
          themes: themesCount,
          audios: audiosCount,
          structure: structureCount,
          meditations: meditationsCount,
        },
        total: themesCount + audiosCount + structureCount + meditationsCount,
        timestamp: new Date().toISOString(),
      },
      endpoints: {
        themes: "/api/database/themes",
        audios: "/api/database/audios",
        structure: "/api/database/structure",
        meditations: "/api/database/meditations",
      }
    });
  } catch (error) {
    console.error("Error fetching database status:", error);

    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch database status" 
      },
      { status: 500 }
    );
  }
}

// POST /api/database - Database operations (seed, backup, drop, status)
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case "seed":
        return await handleSeed();
      
      case "backup":
        return await handleBackup();
      
      case "drop":
        return await handleDrop();
      
      case "status":
        return await handleStatus();
      
      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action. Supported actions: seed, backup, drop, status"
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Database operation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to execute database operation: ${error instanceof Error ? error.message : "Unknown error"}`
      },
      { status: 500 }
    );
  }
}

    switch (action) {
      case "updateGeneral": {
        const validatedData = updateGeneralContentSchema.parse(data);
        const database = await MeditationDatabaseService.updateGeneral(
          validatedData
        );

        if (!database) {
          return NextResponse.json(
            { error: "Database not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          database,
          message: "General content updated successfully",
        });
      }

      case "updateStructure": {
        const validatedData = updateStructureSchema.parse(data);
        const database = await MeditationDatabaseService.updateStructure(
          validatedData
        );

        if (!database) {
          return NextResponse.json(
            { error: "Database not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          database,
          message: "Structure updated successfully",
        });
      }

      case "addTheme": {
        const { theme } = data;
        const database = await MeditationDatabaseService.addTheme(theme);

        if (!database) {
          return NextResponse.json(
            { error: "Database not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          database,
          message: "Theme added successfully",
        });
      }

      case "removeTheme": {
        const { category } = data;
        const database = await MeditationDatabaseService.removeTheme(category);

        if (!database) {
          return NextResponse.json(
            { error: "Database not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          database,
          message: "Theme removed successfully",
        });
      }

      case "addAudio": {
        const { audio } = data;
        const database = await MeditationDatabaseService.addAudio(audio);

        if (!database) {
          return NextResponse.json(
            { error: "Database not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          database,
          message: "Audio added successfully",
        });
      }

      case "removeAudio": {
        const { audioId } = data;
        const database = await MeditationDatabaseService.removeAudio(audioId);

        if (!database) {
          return NextResponse.json(
            { error: "Database not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          database,
          message: "Audio removed successfully",
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating meditation database:", error);

    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update meditation database" },
      { status: 500 }
    );
  }
}
