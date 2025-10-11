import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSongRequest, CreateSongResponse } from "@/types/api";

async function createSong(
  song: CreateSongRequest
): Promise<CreateSongResponse> {
  const response = await fetch("/api/database/songs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(song),
  });

  if (!response.ok) {
    throw new Error("Failed to create song");
  }

  return response.json();
}

export const useCreateSongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["database", "all"] });
    },
  });
};
