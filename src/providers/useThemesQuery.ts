import { useQuery } from '@tanstack/react-query';

interface Theme {
  _id?: string;
  category: string;
  title: string;
  description: string;
  meditations?: any;
}

async function fetchThemes(): Promise<Theme[]> {
  const response = await fetch('/api/database/themes');
  const data = await response.json();
  return data.data || [];
}

export const useThemesQuery = () => {
  return useQuery({
    queryKey: ['themes'],
    queryFn: fetchThemes,
  });
};
