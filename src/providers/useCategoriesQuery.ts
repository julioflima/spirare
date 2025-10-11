import { useQuery } from '@tanstack/react-query';

interface Category {
  category: string;
  title: string;
  description: string;
}

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories');
  const data = await response.json();
  return data.categories || [];
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}
