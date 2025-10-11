import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { Structure, Theme } from "@/types/database";
import type { GetMeditationSessionResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // Validate category parameter
    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { error: "Invalid category parameter" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Fetch structure and theme metadata in parallel
    const [structure, theme] = await Promise.all([
      db.collection("structure").findOne({}) as Promise<Structure | null>,
      db.collection("themes").findOne({ category }) as Promise<Theme | null>,
    ]);

    // Validate that required data exists
    if (!structure) {
      return NextResponse.json(
        { error: "Meditation structure not found" },
        { status: 500 }
      );
    }

    if (!theme) {
      return NextResponse.json(
        { error: `Theme '${category}' not found` },
        { status: 404 }
      );
    }

    // Validate structure has required fields
    if (!structure.method || !Array.isArray(structure.method)) {
      return NextResponse.json(
        { error: "Invalid meditation structure" },
        { status: 500 }
      );
    }

    async function getRandomPhrase(
      db: any,
      collectionName: "themes" | "meditations",
      stage: string,
      practice: string,
      category?: string
    ): Promise<string> {
      // Build aggregation pipeline based on collection type
      let pipeline: any[];

      if (collectionName === "themes") {
        console.log(
          await db
            .collection(collectionName)
            .findOne({ category })
            .aggregate([
              { $project: { phrases: `$meditations.${stage}.${practice}` } },
              { $unwind: "$phrases" },
              { $sample: { size: 1 } },
            ])
            .toArray()
        );
        // For themes, filter by category and navigate to nested meditations
        pipeline = [
          { $match: { category } },
          { $project: { phrases: `$meditations.${stage}.${practice}` } },
        ];
      } else {
        // For meditations, use base collection without category filter
        pipeline = [{ $project: { phrases: `$${stage}.${practice}` } }];
      }

      const result = await db
        .collection(collectionName)
        .aggregate([
          ...pipeline,
          { $unwind: "$phrases" },
          { $sample: { size: 1 } },
        ])
        .toArray();

      return result[0]?.phrases || "";
    }

    // Process stages using map instead of for...of
    const stages = await Promise.all(
      structure.method.map(async (stageObj) => {
        const stage = Object.keys(stageObj)[0] as keyof Structure["specifics"];
        const practices = stageObj[stage] || [];

        // Process practices using map
        const practicesData = await Promise.all(
          practices.map(async (practice: string) => {
            const isSpecific = structure.specifics[stage]?.[practice];

            // Determine collection: theme-specific or base
            const collectionName = isSpecific ? "themes" : "meditations";

            // Get one random phrase directly from MongoDB
            const text = await getRandomPhrase(
              db,
              collectionName,
              stage,
              practice,
              isSpecific ? category : undefined
            );

            return {
              practice,
              text,
              isSpecific,
            };
          })
        );

        return {
          stage,
          practices: practicesData,
        };
      })
    );

    // Build response with type safety
    const response: GetMeditationSessionResponse = {
      session: {
        category: theme.category,
        title: theme.title,
        description: theme.description || "",
        stages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    // Log detailed error for debugging
    console.error("[Meditation API] Error composing session:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return safe error to client
    return NextResponse.json(
      {
        error: "Failed to compose meditation session",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
