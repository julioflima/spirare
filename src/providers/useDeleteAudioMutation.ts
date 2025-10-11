import { useMutation, useQueryClient } from '@tanstack/react-query';

async function deleteAudio(id: string) {
  const response = await fetch(`/api/database/audios/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete audio');
  }

  return response.json();
}

export const useDeleteAudioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAudio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['database', 'all'] });
    },
  });
};
