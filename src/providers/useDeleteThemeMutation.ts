import { useMutation, useQueryClient } from '@tanstack/react-query';

async function deleteTheme(id: string) {
  const response = await fetch(`/api/database/themes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete theme');
  }

  return response.json();
}

export const useDeleteThemeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
      queryClient.invalidateQueries({ queryKey: ['database', 'all'] });
    },
  });
};
