import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DatabaseOperation {
  operation: 'get' | 'update' | 'delete';
  collection?: string;
  data?: any;
}

async function manageDatabaseOperation(params: DatabaseOperation) {
  const method = params.operation === 'get' ? 'GET' : params.operation === 'delete' ? 'DELETE' : 'PUT';
  
  const response = await fetch('/api/database', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: method !== 'GET' ? JSON.stringify(params) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Failed to ${params.operation} database`);
  }

  return response.json();
}

export const useDatabaseOperationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: manageDatabaseOperation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['database'] });
    },
  });
};
