import { useQuery } from "@tanstack/react-query";
import type { AllDatabaseData } from "@/types/api";

async function fetchAllDatabaseData(): Promise<AllDatabaseData> {
  const [meditationsRes, structureRes, themesRes, songsRes] = await Promise.all(
    [
      fetch("/api/database/meditations").then((r) => r.json()),
      fetch("/api/database/structure").then((r) => r.json()),
      fetch("/api/database/themes").then((r) => r.json()),
      fetch("/api/database/songs").then((r) => r.json()),
    ]
  );

  return {
    meditations: meditationsRes.meditations,
    structure: structureRes.structure,
    themes: themesRes.themes,
    songs: songsRes.songs, // API still returns 'songs' but we map to 'songs'
  };
}

export const useAllDatabaseDataQuery = () => {
  return useQuery({
    queryKey: ["database", "all"],
    queryFn: fetchAllDatabaseData,
  });
};
