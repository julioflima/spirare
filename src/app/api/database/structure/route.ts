import { NextRequest, NextResponse } from "next/server";
import { StructureService } from "@/services/structureService";
import { createStructureSchema, updateStructureSchema } from "@/types/database";

// GET /api/database/structure - Get structure document
export async function GET() {
  try {
    const existing = await StructureService.get();
    if (existing) {
      return NextResponse.json({ structure: existing });
    }

    const fallback = await StructureService.initializeDefault();
    return NextResponse.json({ structure: fallback });
  } catch (error) {
    console.error("Error fetching structure:", error);
    return NextResponse.json(
      { error: "Failed to fetch structure" },
      { status: 500 }
    );
  }
}

// POST /api/database/structure - Replace structure document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createStructureSchema.parse(body);

    const structure = await StructureService.set(validated);

    return NextResponse.json(
      {
        structure,
        message: "Structure saved successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving structure:", error);

    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save structure" },
      { status: 500 }
    );
  }
}

// PUT /api/database/structure - Update structure document partially
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = updateStructureSchema.parse(body);

    const structure = await StructureService.update(validated);

    if (!structure) {
      return NextResponse.json(
        { error: "Structure not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      structure,
      message: "Structure updated successfully",
    });
  } catch (error) {
    console.error("Error updating structure:", error);

    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update structure" },
      { status: 500 }
    );
  }
}
