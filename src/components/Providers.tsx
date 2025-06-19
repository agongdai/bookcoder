'use client';
import React from 'react';
import _debounce from 'lodash/debounce';
import { Provider as ReduxProvider } from 'react-redux';

import store from '@/store';
import { saveState } from '@/store/localStorage';

store.subscribe(
  _debounce(() => {
    saveState(store.getState());
  }, 1000)
);

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
