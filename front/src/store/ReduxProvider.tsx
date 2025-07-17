"use client";

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { refreshUserThunk } from './authSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {});
    store.dispatch(refreshUserThunk());
    return () => unsub();
  }, []);

  return <Provider store={store}>{children}</Provider>;
};
