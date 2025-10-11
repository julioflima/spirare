import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateAudioRequest, CreateAudioResponse } from "@/types/api";

async function createAudio(
  audio: CreateAudioRequest
): Promise<CreateAudioResponse> {
  const response = await fetch("/api/database/audios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(audio),
  });

  if (!response.ok) {
    throw new Error("Failed to create audio");
  }

  return response.json();
}

export const useCreateAudioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAudio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["database", "all"] });
    },
  });
};
