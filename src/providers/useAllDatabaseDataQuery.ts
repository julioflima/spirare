import { useQuery } from "@tanstack/react-query";
import type { AllDatabaseData } from "@/types/api";

async function fetchAllDatabaseData(): Promise<AllDatabaseData> {
  const [meditationsRes, structureRes, themesRes, audiosRes] =
    await Promise.all([
      fetch("/api/database/meditations").then((r) => r.json()),
      fetch("/api/database/structure").then((r) => r.json()),
      fetch("/api/database/themes").then((r) => r.json()),
      fetch("/api/database/audios").then((r) => r.json()),
    ]);

  return {
    meditations: meditationsRes.meditations,
    structure: structureRes.structure,
    themes: themesRes.themes,
    audios: audiosRes.audios,
  };
}

export const useAllDatabaseDataQuery = () => {
  return useQuery({
    queryKey: ["database", "all"],
    queryFn: fetchAllDatabaseData,
  });
};
