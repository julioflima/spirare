import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/services/databaseService";

// GET /api/database - Return database status summary
export async function GET() {
  try {
    const status = await DatabaseService.getStatus();
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Error fetching database status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch database status",
      },
      { status: 500 }
    );
  }
}

// POST /api/database - Execute administrative action (seed, backup, drop, status)
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case "seed": {
        const seeded = await DatabaseService.seedDatabase();
        return NextResponse.json({
          success: true,
          message: "Database seeded successfully",
          data: seeded,
        });
      }
      case "backup": {
        const backup = await DatabaseService.backupDatabase();
        return NextResponse.json({
          success: true,
          message: "Database backup created successfully",
          backup,
        });
      }
      case "drop": {
        await DatabaseService.dropDatabase();
        return NextResponse.json({
          success: true,
          message: "Database dropped successfully",
        });
      }
      case "status": {
        const status = await DatabaseService.getStatus();
        return NextResponse.json({ success: true, status });
      }
      default:
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid action. Supported actions: seed, backup, drop, status",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Database operation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to execute database operation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
