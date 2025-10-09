import { NextRequest, NextResponse } from "next/server";
import { ThemeService } from "@/services/themesService";
import { updateThemeSchema } from "@/types/database";

interface ThemeParams {
  params: Promise<{ id: string }>;
}

// GET /api/database/themes/[id] - Get theme by ID
export async function GET(request: NextRequest, context: ThemeParams) {
  try {
    const { id } = await context.params;
    const theme = await ThemeService.getById(id);

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    return NextResponse.json({ theme });
  } catch (error) {
    console.error("Error fetching theme:", error);
    return NextResponse.json(
      { error: "Failed to fetch theme" },
      { status: 500 }
    );
  }
}

// PUT /api/database/themes/[id] - Update theme
export async function PUT(request: NextRequest, context: ThemeParams) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validatedData = updateThemeSchema.parse(body);

    const theme = await ThemeService.update(id, validatedData);

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    return NextResponse.json({
      theme,
      message: "Theme updated successfully",
    });
  } catch (error) {
    console.error("Error updating theme:", error);

    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 }
    );
  }
}

// DELETE /api/database/themes/[id] - Delete theme
export async function DELETE(request: NextRequest, context: ThemeParams) {
  try {
    const { id } = await context.params;
    const success = await ThemeService.delete(id);

    if (!success) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Theme deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting theme:", error);
    return NextResponse.json(
      { error: "Failed to delete theme" },
      { status: 500 }
    );
  }
}
