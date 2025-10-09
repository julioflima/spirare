import { NextRequest, NextResponse } from "next/server";
import { StructureService } from "@/services/structureService";

interface UpdateStructureParams {
  params: Promise<{ id: string }>;
}

// GET /api/structure/[id] - Get structure item by ID
export async function GET(request: NextRequest, context: UpdateStructureParams) {
  try {
    const { id } = await context.params;
    const structure = await StructureService.getById(id);

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

// PUT /api/structure/[id] - Update structure item
export async function PUT(request: NextRequest, context: UpdateStructureParams) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const structure = await StructureService.updateById(id, body);

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

// DELETE /api/structure/[id] - Delete structure item
export async function DELETE(request: NextRequest, context: UpdateStructureParams) {
  try {
    const { id } = await context.params;
    const success = await StructureService.delete(id);

    if (!success) {
      return NextResponse.json(
        { error: "Structure not found" },
        { status: 404 }
      );
    }

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