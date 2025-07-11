import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import tableReducer from './slices/tableSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['table'], 
  version: 1,
  migrate: (state: any) => {
    if (state && state.table && !state.table.version) {
      return Promise.resolve({
        table: {
          ...state.table,
          version: 1,
          hasImportedData: false
        }
      });
    }
    return Promise.resolve(state);
  }
};

const rootReducer = combineReducers({
  table: tableReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const clearPersistedData = () => {
  return persistor.purge();
};