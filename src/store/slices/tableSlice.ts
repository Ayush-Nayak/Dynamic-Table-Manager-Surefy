import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Column {
  key: string;
  label: string;
  visible: boolean;
  sortable: boolean;
}

export interface TableRow {
  id: number | string;
  [key: string]: any;
}

export interface TableState {
  data: TableRow[];
  columns: Column[];
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
  currentPage: number;
  rowsPerPage: number;
  importErrors: string[];
  hasImportedData: boolean; 
}

const defaultColumns: Column[] = [
  { key: 'name', label: 'Name', visible: true, sortable: true },
  { key: 'email', label: 'Email', visible: true, sortable: true },
  { key: 'age', label: 'Age', visible: true, sortable: true },
  { key: 'role', label: 'Role', visible: true, sortable: true },
];

const sampleData: TableRow[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, role: 'Developer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, role: 'Designer' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, role: 'Manager' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, role: 'Developer' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 32, role: 'Analyst' },
  { id: 6, name: 'Diana Lee', email: 'diana@example.com', age: 29, role: 'Designer' },
  { id: 7, name: 'Eva Martinez', email: 'eva@example.com', age: 26, role: 'Developer' },
  { id: 8, name: 'Frank Chen', email: 'frank@example.com', age: 31, role: 'Manager' },
  { id: 9, name: 'Grace Kim', email: 'grace@example.com', age: 27, role: 'Analyst' },
  { id: 10, name: 'Henry Taylor', email: 'henry@example.com', age: 33, role: 'Developer' },
  { id: 11, name: 'Ivy Thompson', email: 'ivy@example.com', age: 24, role: 'Designer' },
  { id: 12, name: 'Jack Anderson', email: 'jack@example.com', age: 36, role: 'Manager' },
];

const initialState: TableState = {
  data: sampleData,
  columns: defaultColumns,
  sortBy: null,
  sortOrder: 'asc',
  searchTerm: '',
  currentPage: 0,
  rowsPerPage: 10,
  importErrors: [],
  hasImportedData: false,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload;
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.data.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<{ id: string | number; data: Partial<TableRow> }>) => {
      const { id, data } = action.payload;
      const index = state.data.findIndex(row => row.id === id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...data };
      }
    },
    deleteRow: (state, action: PayloadAction<string | number>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
    },

    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.key === action.payload);
      if (column) {
        column.visible = !column.visible;
      }
    },
    addColumn: (state, action: PayloadAction<{ key: string; label: string }>) => {
      const { key, label } = action.payload;
      if (!state.columns.find(col => col.key === key)) {
        state.columns.push({
          key,
          label,
          visible: true,
          sortable: true,
        });
      }
    },
    removeColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter(col => col.key !== action.payload);
      state.data = state.data.map(row => {
        const { [action.payload]: removed, ...rest } = row;
        return rest;
      });
    },
    reorderColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },

    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.currentPage = 0; 
    },

    importData: (state, action: PayloadAction<{ 
      data: TableRow[]; 
      errors: string[];
      replaceExisting?: boolean; 
    }>) => {
      const { data, errors, replaceExisting = true } = action.payload;
      
      if (data.length > 0) {
        const newColumns: Column[] = [];
        const allKeys = new Set<string>();
        
        data.forEach(row => {
          Object.keys(row).forEach(key => allKeys.add(key));
        });
        
        Array.from(allKeys).forEach(key => {
          if (key !== 'id') { 
            newColumns.push({
              key,
              label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
              visible: true,
              sortable: true
            });
          }
        });
        
        if (replaceExisting || !state.hasImportedData) {
          state.data = data;
          state.columns = newColumns;
          state.hasImportedData = true;
        } else {
          const existingColumnKeys = state.columns.map(col => col.key);
          const columnsToAdd = newColumns.filter(
            col => !existingColumnKeys.includes(col.key)
          );
          
          state.data = [...state.data, ...data];
          state.columns = [...state.columns, ...columnsToAdd];
        }
        
        state.currentPage = 0;
        state.searchTerm = '';
        state.sortBy = null;
        state.sortOrder = 'asc';
      }
      
      state.importErrors = errors;
    },

    appendData: (state, action: PayloadAction<{ data: TableRow[]; errors: string[] }>) => {
      const { data, errors } = action.payload;
      
      if (data.length > 0) {
        const existingColumnKeys = state.columns.map(col => col.key);
        const newColumns: Column[] = [];
        
        data.forEach(row => {
          Object.keys(row).forEach(key => {
            if (key !== 'id' && !existingColumnKeys.includes(key) && !newColumns.find(col => col.key === key)) {
              newColumns.push({
                key,
                label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                visible: true,
                sortable: true
              });
            }
          });
        });
        
        state.data = [...state.data, ...data];
        state.columns = [...state.columns, ...newColumns];
        state.hasImportedData = true;
      }
      
      state.importErrors = errors;
    },

    clearImportErrors: (state) => {
      state.importErrors = [];
    },
    
    clearAllData: (state) => {
      state.data = [];
      state.columns = [];
      state.currentPage = 0;
      state.searchTerm = '';
      state.sortBy = null;
      state.sortOrder = 'asc';
      state.hasImportedData = false;
    },

    resetToDemo: (state) => {
      state.data = sampleData;
      state.columns = defaultColumns;
      state.currentPage = 0;
      state.searchTerm = '';
      state.sortBy = null;
      state.sortOrder = 'asc';
      state.hasImportedData = false;
      state.importErrors = [];
    },
  },
});

export const {
  setData,
  addRow,
  updateRow,
  deleteRow,
  toggleColumnVisibility,
  addColumn,
  removeColumn,
  reorderColumns,
  setSortBy,
  setSortOrder,
  setSearchTerm,
  setPage,
  setRowsPerPage,
  importData,
  appendData,
  clearImportErrors,
  clearAllData,
  resetToDemo,
} = tableSlice.actions;


export default tableSlice.reducer;

export const selectTableData = (state: { table: TableState }) => state.table.data;
export const selectTableColumns = (state: { table: TableState }) => state.table.columns;
export const selectVisibleColumns = (state: { table: TableState }) => 
  state.table.columns.filter(col => col.visible);
export const selectTableState = (state: { table: TableState }) => state.table;