import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AudioInput {
  name: string;
  url: string;
  duration?: number;
}

async function createAudio(audio: AudioInput) {
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
