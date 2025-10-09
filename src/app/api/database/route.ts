import { NextRequest, NextResponse } from "next/server";
import { MeditationDatabaseService } from "@/services/meditationDatabaseService";
import {
  updateGeneralContentSchema,
  updateStructureSchema,
} from "@/types/database";

// GET /api/database - Get the complete meditation database
export async function GET() {
  try {
    let database = await MeditationDatabaseService.get();

    // Initialize with default data if doesn't exist
    if (!database) {
      database = await MeditationDatabaseService.initializeDefault();
    }

    return NextResponse.json({ database });
  } catch (error) {
    console.error("Error fetching meditation database:", error);
    return NextResponse.json(
      { error: "Failed to fetch meditation database" },
      { status: 500 }
    );
  }
}

// PUT /api/database - Update database content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

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
