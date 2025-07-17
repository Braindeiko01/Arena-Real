"use client";

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { refreshUserThunk } from './authSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      store.dispatch(refreshUserThunk());
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  if (!authReady) return null;

  return <Provider store={store}>{children}</Provider>;
};
