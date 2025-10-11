import { useQuery } from "@tanstack/react-query";
import type { Category, GetCategoriesResponse } from "@/types/api";

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  const data: GetCategoriesResponse = await response.json();
  return data.categories || [];
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}
