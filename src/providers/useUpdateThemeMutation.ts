import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateThemeParams {
  id: string;
  data: any;
}

async function updateTheme({ id, data }: UpdateThemeParams) {
  const response = await fetch(`/api/database/themes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update theme");
  }

  return response.json();
}

export const useUpdateThemeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["database", "all"] });
    },
  });
};
