import { NextRequest, NextResponse } from "next/server";
import { StructureService } from "@/services/structureService";

interface UpdateStructureParams {
  params: Promise<{ id: string }>;
}

// GET /api/structure/[id] - Get structure (id parameter is ignored, returns singleton)
export async function GET(
  request: NextRequest,
  context: UpdateStructureParams
) {
  try {
    await context.params; // Consume params to satisfy type
    const structure = await StructureService.get();

    if (!structure) {
      return NextResponse.json(
        { error: "Structure not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ structure });
  } catch (error) {
    console.error("Error fetching structure:", error);
    return NextResponse.json(
      { error: "Failed to fetch structure" },
      { status: 500 }
    );
  }
}

// PUT /api/structure/[id] - Update structure (id parameter is ignored, updates singleton)
export async function PUT(
  request: NextRequest,
  context: UpdateStructureParams
) {
  try {
    await context.params; // Consume params to satisfy type
    const body = await request.json();

    const structure = await StructureService.update(body);

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

// DELETE /api/structure/[id] - Delete all structures (id parameter is ignored)
export async function DELETE(
  request: NextRequest,
  context: UpdateStructureParams
) {
  try {
    await context.params; // Consume params to satisfy type
    await StructureService.deleteAll();

    return NextResponse.json({
      message: "Structure deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting structure:", error);
    return NextResponse.json(
      { error: "Failed to delete structure" },
      { status: 500 }
    );
  }
}
