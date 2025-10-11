import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteSong(id: string) {
  const response = await fetch(`/api/database/songs/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete song");
  }

  return response.json();
}

export const useDeleteSongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["database", "all"] });
    },
  });
};
