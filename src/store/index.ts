import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { configureStore, Tuple } from '@reduxjs/toolkit';

import bookReducer from './book/slice';
import { socketMiddleware } from './middleware/socket.middleware';
import wssReducer from './wss/slice';
import { loadState } from './localStorage';
import { Socket } from './Socket';

const store = configureStore<{
  book: ReturnType<typeof bookReducer>;
  wss: ReturnType<typeof wssReducer>;
}>({
  reducer: {
    book: bookReducer,
    wss: wssReducer,
  },
  preloadedState: loadState(),
  middleware: () => new Tuple(socketMiddleware(new Socket())),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useMyDispatch: () => AppDispatch = useDispatch;
export const useMySelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
