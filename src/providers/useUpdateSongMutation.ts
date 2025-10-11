import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateSongRequest, UpdateSongResponse } from "@/types/api";

interface UpdateSongParams {
  id: string;
  data: UpdateSongRequest;
}

async function updateSong({
  id,
  data,
}: UpdateSongParams): Promise<UpdateSongResponse> {
  const response = await fetch(`/api/database/songs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update song");
  }

  return response.json();
}

export const useUpdateSongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["database", "all"] });
    },
  });
};
