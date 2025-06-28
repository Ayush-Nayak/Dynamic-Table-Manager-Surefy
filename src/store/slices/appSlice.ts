import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@/types';

const initialState: AppState = {
  theme: 'light',
  columnVisibility: {
    name: true,
    email: true,
    age: true,
    role: true,
    department: false,
    location: false,
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setColumnVisibility: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.columnVisibility = { ...state.columnVisibility, ...action.payload };
    },
    toggleColumnVisibilityByField: (state, action: PayloadAction<string>) => {
      state.columnVisibility[action.payload] = !state.columnVisibility[action.payload];
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setColumnVisibility,
  toggleColumnVisibilityByField,
} = appSlice.actions;

export default appSlice.reducer;