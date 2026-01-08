
"use client";

import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './slices/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);