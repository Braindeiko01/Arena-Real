import { useRouter } from 'next/navigation';
import type { User } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, logout, updateUserThunk, refreshUserThunk } from '@/store/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector(state => state.auth.user);
  const isLoading = useAppSelector(state => state.auth.isLoading);
  const isAuthenticated = !!user;

  const loginUser = (userData: User) => {
    dispatch(login(userData));
  };

  const logoutUser = () => {
    dispatch(logout());
    router.push('/login');
  };

  const updateUser = async (updatedData: Partial<User>) => {
    return dispatch(updateUserThunk(updatedData)).unwrap();
  };

  const refreshUser = async () => {
    await dispatch(refreshUserThunk());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginUser,
    logout: logoutUser,
    updateUser,
    refreshUser,
  };
};
