import { useQuery } from '@tanstack/react-query';

interface MeditationPractice {
  practice: string;
  text: string;
  isSpecific: boolean;
}

interface MeditationStage {
  stage: string;
  practices: MeditationPractice[];
}

interface MeditationSession {
  category: string;
  title: string;
  description: string;
  stages: MeditationStage[];
}

async function fetchMeditationSession(category: string): Promise<MeditationSession> {
  const response = await fetch(`/api/meditation/${category}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch meditation session');
  }
  
  return data.session;
}

export function useMeditationSessionQuery(category: string) {
  return useQuery({
    queryKey: ['meditation-session', category],
    queryFn: () => fetchMeditationSession(category),
    enabled: !!category,
  });
}
