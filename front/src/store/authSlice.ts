import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '@/types';
import { getUserDataAction, updateUserProfileInMemoryAction } from '@/lib/actions';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const USER_ID_STORAGE_KEY = 'cr_duels_user_id';

const initialState: AuthState = {
  user: null,
  isLoading: true,
};

export const refreshUserThunk = createAsyncThunk<User | null>(
  'auth/refreshUser',
  async () => {
    const storedUserId = typeof window !== 'undefined'
      ? localStorage.getItem(USER_ID_STORAGE_KEY)
      : null;
    if (!storedUserId) return null;
    const result = await getUserDataAction(storedUserId);
    if (result.user) return result.user;
    throw new Error(result.error || 'Error fetching user');
  }
);

export const updateUserThunk = createAsyncThunk<User, Partial<User>, { state: { auth: AuthState } }>(
  'auth/updateUser',
  async (updatedData, { getState, rejectWithValue }) => {
    const user = getState().auth.user;
    if (!user?.id) {
      return rejectWithValue('Usuario no autenticado.') as any;
    }
    const result = await updateUserProfileInMemoryAction(user.id, updatedData);
    if (result.user) {
      return { ...user, ...updatedData } as User;
    }
    return rejectWithValue(result.error || 'Error') as any;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      if (action.payload.id && typeof window !== 'undefined') {
        localStorage.setItem(USER_ID_STORAGE_KEY, action.payload.id);
      }
    },
    logout(state) {
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_ID_STORAGE_KEY);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(refreshUserThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(refreshUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(refreshUserThunk.rejected, state => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
