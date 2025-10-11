import { NextResponse } from "next/server";
import { ThemeService } from "@/services/themesService";

// GET /api/categories - Get all categories with their titles
export async function GET() {
  try {
    const themes = await ThemeService.getAll();

    // Extract unique categories with their titles
    const categories = themes.map((theme) => ({
      category: theme.category,
      title: theme.title,
      description: theme.description || "",
    }));

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}
