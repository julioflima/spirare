import { useQuery } from '@tanstack/react-query';

interface DatabaseData {
  meditations?: any;
  structure?: any;
  themes?: any[];
  audios?: any[];
}

async function fetchAllDatabaseData(): Promise<DatabaseData> {
  const [meditations, structure, themes, audios] = await Promise.all([
    fetch('/api/database/meditations').then((r) => r.json()),
    fetch('/api/database/structure').then((r) => r.json()),
    fetch('/api/database/themes').then((r) => r.json()),
    fetch('/api/database/audios').then((r) => r.json()),
  ]);

  return {
    meditations: meditations.data,
    structure: structure.data,
    themes: themes.data,
    audios: audios.data,
  };
}

export const useAllDatabaseDataQuery = () => {
  return useQuery({
    queryKey: ['database', 'all'],
    queryFn: fetchAllDatabaseData,
  });
};
