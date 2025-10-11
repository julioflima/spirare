import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateMeditationsParams {
  stage: string;
  practice: string;
  phrases: string[];
}

async function updateMeditations(data: UpdateMeditationsParams) {
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
