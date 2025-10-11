import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateMeditationsRequest, UpdateMeditationsResponse } from "@/types/api";

async function updateMeditations(data: UpdateMeditationsRequest): Promise<UpdateMeditationsResponse> {
  const response = await fetch("/api/database/meditations", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update meditations");
  }

  return response.json();
}

export const useUpdateMeditationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMeditations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["database", "all"] });
    },
  });
};
