import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { Notification } from '@/types';

export interface NotificationsState {
  list: Notification[];
}

const STORAGE_KEY = 'arena_notifications';

const loadState = (): Notification[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Notification[];
  } catch {
    return [];
  }
};

const saveState = (state: Notification[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const initialState: NotificationsState = {
  list: loadState(),
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<{ message: string }>) => {
      const newNotif: Notification = {
        id: nanoid(),
        message: action.payload.message,
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.list.unshift(newNotif);
      saveState(state.list);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.list.find(n => n.id === action.payload);
      if (notif) {
        notif.read = true;
        saveState(state.list);
      }
    },
    markAllRead: state => {
      state.list.forEach(n => (n.read = true));
      saveState(state.list);
    },
    clearNotifications: state => {
      state.list = [];
      saveState(state.list);
    },
  },
});

export const { addNotification, markAsRead, markAllRead, clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
