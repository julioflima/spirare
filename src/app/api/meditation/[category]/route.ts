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

    // Fetch structure, base meditations, and theme
    const [structure, baseMeditations, theme] = await Promise.all([
      db
        .collection("structure")
        .findOne({}) as Promise<MeditationStructure | null>,
      db
        .collection("meditations")
        .findOne({}) as Promise<MeditationBase | null>,
      db.collection("themes").findOne({ category }) as Promise<Theme | null>,
    ]);

    if (!structure || !baseMeditations || !theme) {
      return NextResponse.json(
        { success: false, error: "Data not found" },
        { status: 404 }
      );
    }

    // Compose the meditation session
    const session: any = {
      category: theme.category,
      title: theme.title,
      description: theme.description,
      stages: [],
    };

    // Process each stage in the method order
    for (const stageObj of structure.method) {
      const stageName = Object.keys(stageObj)[0];
      const practices = stageObj[stageName];

      const stageData: any = {
        stage: stageName,
        practices: [],
      };

      // Process each practice
      for (const practiceName of practices) {
        const useSpecific =
          structure.specifics[stageName]?.[practiceName] === true;

        let phrases: string[] = [];

        if (
          useSpecific &&
          theme.meditations[stageName]?.[practiceName]?.length > 0
        ) {
          // Use theme-specific phrases
          phrases = theme.meditations[stageName][practiceName];
        } else {
          // Use base global phrases
          phrases = baseMeditations[stageName]?.[practiceName] || [];
        }

        // Select one random phrase
        const randomPhrase =
          phrases.length > 0
            ? phrases[Math.floor(Math.random() * phrases.length)]
            : "";

        stageData.practices.push({
          practice: practiceName,
          text: randomPhrase,
          isSpecific: useSpecific,
        });
      }

      session.stages.push(stageData);
    }

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
