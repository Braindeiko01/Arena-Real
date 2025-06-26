"use client";

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { refreshUserThunk } from './authSlice';

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    store.dispatch(refreshUserThunk());
  }, []);

  return <Provider store={store}>{children}</Provider>;
};
