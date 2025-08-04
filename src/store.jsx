/**
 * Redux Store Configuration
 * 
 * This file sets up the Redux store with:
 * - Redux Toolkit for state management
 * - Redux Persist for data persistence across browser sessions
 * - User cart state management
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userCartReducer from './features/userCart/userCartSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

// Combine all reducers
const rootReducer = combineReducers({
  userCart: userCartReducer,
});

// Redux persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export const persistor = persistStore(store);
