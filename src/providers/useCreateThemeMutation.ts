import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ThemeInput {
  category: string;
  title: string;
  description: string;
  meditations?: any;
}

async function createTheme(theme: ThemeInput) {
  const response = await fetch("/api/database/themes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(theme),
  });

  if (!response.ok) {
    throw new Error("Failed to create theme");
  }

  return response.json();
}

export const useCreateThemeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["database", "all"] });
    },
  });
};
