import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { authService, type User } from '~/api-services';
import type { SignInRequest, SignUpRequest, AuthResponse } from '~/api-services/types';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return authService.isAuthenticated();
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = authService.isAuthenticated();
        setIsAuthenticated(isAuth);

        if (isAuth) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signInMutation = useMutation<AuthResponse, Error, SignInRequest>({
    mutationFn: authService.signIn.bind(authService),
    onSuccess: (data) => {
      // Handle the response - data is AuthResponse { user, tokens }
      if (data && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        queryClient.invalidateQueries({ queryKey: ['auth'] });
      } else {
        throw new Error('Invalid response from server');
      }
    },
    onError: (error: Error) => {
      console.error('Sign in failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    },
  });

  const signUpMutation = useMutation<AuthResponse, Error, SignUpRequest>({
    mutationFn: authService.signUp.bind(authService),
    onSuccess: (data) => {
      // Handle the response - data is AuthResponse { user, tokens }
      if (data && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        queryClient.invalidateQueries({ queryKey: ['auth'] });
      } else {
        throw new Error('Invalid response from server');
      }
    },
    onError: (error: Error) => {
      console.error('Sign up failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: authService.signOut.bind(authService),
    onSuccess: () => {
      setUser(null);
      setIsAuthenticated(false);
      queryClient.clear();
    },
  });

  const signIn = useCallback(
    (credentials: SignInRequest) => {
      return signInMutation.mutateAsync(credentials);
    },
    [signInMutation]
  );

  const signUp = useCallback(
    (userData: SignUpRequest) => {
      return signUpMutation.mutateAsync(userData);
    },
    [signUpMutation]
  );

  const signOut = useCallback(() => {
    return signOutMutation.mutateAsync();
  }, [signOutMutation]);

  return {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
  };
}
