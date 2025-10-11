import { useQuery } from "@tanstack/react-query";

async function fetchDatabaseStatus() {
  const response = await fetch("/api/database");

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Erro ao obter status");
  }

  return response.json();
}

export const useDatabaseStatusQuery = () => {
  return useQuery({
    queryKey: ["database", "status"],
    queryFn: fetchDatabaseStatus,
    enabled: false, // Only fetch when manually triggered
  });
};
