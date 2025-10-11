import { useMutation, useQueryClient } from "@tanstack/react-query";

// Example mutation for creating/updating data
interface MutationData {
  id?: string;
  data: any;
}

async function createOrUpdate(params: MutationData): Promise<any> {
  const url = params.id ? `/api/resource/${params.id}` : "/api/resource";
  const method = params.id ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params.data),
  });

  if (!response.ok) {
    throw new Error("Failed to save data");
  }

  return response.json();
}

async function deleteResource(id: string): Promise<void> {
  const response = await fetch(`/api/resource/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete");
  }
}

// Mutation hooks
export function useCreateOrUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrUpdate,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["resource"] });
    },
  });
}

export function useDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource"] });
    },
  });
}
