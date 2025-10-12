import { NextRequest, NextResponse } from "next/server";
import { ThemeService } from "@/services/themesService";
import { createThemeSchema } from "@/types/database";

// GET /api/database/themes - Get all themes
export async function GET() {
  try {
    const themes = await ThemeService.getAll();
    return NextResponse.json({ themes });
  } catch (error) {
    console.error("Error fetching themes:", error);
    return NextResponse.json(
      { error: "Failed to fetch themes" },
      { status: 500 }
    );
  }
}

// POST /api/database/themes - Create new theme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createThemeSchema.parse(body);

    const theme = await ThemeService.create(validatedData);

    return NextResponse.json(
      { theme, message: "Theme created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating theme:", error);

    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create theme" },
      { status: 500 }
    );
  }
}
