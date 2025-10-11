import { useQuery } from "@tanstack/react-query";
import type { MeditationSession, GetMeditationSessionResponse } from "@/types/api";

async function fetchMeditationSession(
  category: string
): Promise<MeditationSession> {
  const response = await fetch(`/api/meditation/${category}`);
  const data: GetMeditationSessionResponse = await response.json();

  return data.session;
}

export function useMeditationSessionQuery(category: string) {
  return useQuery({
    queryKey: ["meditation-session", category],
    queryFn: () => fetchMeditationSession(category),
    enabled: !!category,
  });
}
