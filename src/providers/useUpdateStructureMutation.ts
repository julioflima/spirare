import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  UpdateStructureRequest,
  UpdateStructureResponse,
} from "@/types/api";

async function updateStructure(
  data: UpdateStructureRequest
): Promise<UpdateStructureResponse> {
  const response = await fetch("/api/database/structure", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update structure");
  }

  return response.json();
}

export const useUpdateStructureMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["database", "all"] });
    },
  });
};
