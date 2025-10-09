import { NextRequest, NextResponse } from "next/server";
import { MeditationsService } from "@/services/meditationsService";

// GET /api/meditations - Get the meditation content
export async function GET() {
  try {
    let meditations = await MeditationsService.get();

    // Initialize with default data if doesn't exist
    if (!meditations) {
      meditations = await MeditationsService.initializeDefault();
    }

    return NextResponse.json({ meditations });
  } catch (error) {
    console.error("Error fetching meditations:", error);
    return NextResponse.json(
      { error: "Failed to fetch meditations" },
      { status: 500 }
    );
  }
}

// PUT /api/meditations - Update meditation content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const meditations = await MeditationsService.update(body);

    if (!meditations) {
      return NextResponse.json(
        { error: "Meditations not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      meditations,
      message: "Meditations updated successfully",
    });
  } catch (error) {
    console.error("Error updating meditations:", error);

    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update meditations" },
      { status: 500 }
    );
  }
}
