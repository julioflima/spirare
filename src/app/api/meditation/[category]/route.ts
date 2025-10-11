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
    const db = await getDatabase();

    // Fetch only structure and theme metadata (not full phrase arrays)
    const [structure, theme] = await Promise.all([
      db
        .collection("structure")
        .findOne({}) as Promise<Structure | null>,
      db.collection("themes").findOne({ category }) as Promise<Theme | null>,
    ]);

    if (!structure || !theme) {
      return NextResponse.json(
        { success: false, error: "Data not found" },
        { status: 404 }
      );
    }

    // Helper function to get one random phrase using MongoDB aggregation
    const getRandomPhrase = async (
      collection: string,
      stage: string,
      practice: string
    ): Promise<string> => {
      const result = await db
        .collection(collection)
        .aggregate([
          { $project: { phrases: `$${stage}.${practice}` } },
          { $unwind: "$phrases" },
          { $sample: { size: 1 } },
        ])
        .toArray();

      return result[0]?.phrases || "";
    };

    // Process stages using map instead of for...of
    const stages = await Promise.all(
      structure.method.map(async (stageObj) => {
        const stage = Object.keys(stageObj)[0] as keyof Structure['specifics'];
        const practices = stageObj[stage] || [];

        // Process practices using map
        const practicesData = await Promise.all(
          practices.map(async (practice: string) => {
            const isSpecific = structure.specifics[stage]?.[practice];

            // Determine collection: theme-specific or base
            const collection = isSpecific ? "themes" : "meditations";

            // Get one random phrase directly from MongoDB
            const text = await getRandomPhrase(collection, stage, practice);

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

    const response: GetMeditationSessionResponse = {
      session: {
        category: theme.category,
        title: theme.title,
        description: theme.description || '',
        stages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error composing meditation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compose meditation" },
      { status: 500 }
    );
  }
}
