import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

interface MeditationStructure {
  method: Array<{ [stage: string]: string[] }>;
  specifics: {
    [stage: string]: {
      [practice: string]: boolean;
    };
  };
}

interface MeditationBase {
  [stage: string]: {
    [practice: string]: string[];
  };
}

interface Theme {
  category: string;
  title: string;
  description: string;
  meditations: MeditationBase;
}

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
        .findOne({}) as Promise<MeditationStructure | null>,
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
        const stageName = Object.keys(stageObj)[0];
        const practices = stageObj[stageName];

        // Process practices using map
        const practicesData = await Promise.all(
          practices.map(async (practiceName) => {
            const useSpecific =
              structure.specifics[stageName]?.[practiceName] === true;

            // Determine collection: theme-specific or base
            const collection = useSpecific ? "themes" : "meditations";

            // Get one random phrase directly from MongoDB
            const text = await getRandomPhrase(
              collection,
              stageName,
              practiceName
            );

            return {
              practice: practiceName,
              text,
              isSpecific: useSpecific,
            };
          })
        );

        return {
          stage: stageName,
          practices: practicesData,
        };
      })
    );

    const session = {
      category: theme.category,
      title: theme.title,
      description: theme.description,
      stages,
    };

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Error composing meditation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compose meditation" },
      { status: 500 }
    );
  }
}
