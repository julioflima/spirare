import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateAudioRequest, UpdateAudioResponse } from "@/types/api";

interface UpdateAudioParams {
  id: string;
  data: UpdateAudioRequest;
}

async function updateAudio({
  id,
  data,
}: UpdateAudioParams): Promise<UpdateAudioResponse> {
  const response = await fetch(`/api/database/audios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update audio");
  }

  return response.json();
}

export const useUpdateAudioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAudio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["database", "all"] });
    },
  });
};
