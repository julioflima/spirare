import { useMutation } from '@tanstack/react-query';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
}

async function loginAdmin(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch('/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  return response.json();
}

export const useAdminAuthMutation = () => {
  return useMutation({
    mutationFn: loginAdmin,
  });
};
