import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import type {
  MeditationSession,
  GetMeditationSessionResponse,
  ApiError,
} from "@/types/api";

async function fetchMeditationSession(
  category: string
): Promise<MeditationSession> {
  const response = await fetch(`/api/meditation/${category}`);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(
      errorData.error ||
        `Failed to fetch meditation session: ${response.status}`
    );
  }

  const data: GetMeditationSessionResponse = await response.json();

  if (!data.session) {
    throw new Error("Invalid response: session data missing");
  }

  return data.session;
}

export function useMeditationSessionQuery(
  category: string,
  options: Omit<
    UseQueryOptions<unknown, ApiError, MeditationSession>,
    "queryKey"
  > = {}
) {
  return useQuery({
    queryKey: ["meditation-session", category],
    queryFn: () => fetchMeditationSession(category),
    enabled: !!category,
    ...options,
  });
}
