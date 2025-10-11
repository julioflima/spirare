import { useMutation } from "@tanstack/react-query";

type DatabaseAction = "seed" | "drop" | "backup";

interface DatabaseActionParams {
  action: DatabaseAction;
}

async function executeDatabaseAction({ action }: DatabaseActionParams) {
  const response = await fetch("/api/database", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || `Erro ao executar ${action}`);
  }

  // For backup action, return the blob
  if (action === "backup") {
    return response.blob();
  }

  return response.json();
}

export const useDatabaseActionMutation = () => {
  return useMutation({
    mutationFn: executeDatabaseAction,
  });
};
