export interface TableRow {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
  [key: string]: any; 
}

export interface ColumnConfig {
  field: string;
  headerName: string;
  width: number;
  type: 'string' | 'number' | 'email';
  visible: boolean;
  editable: boolean;
  required: boolean;
}

export interface TableState {
  data: TableRow[];
  columns: ColumnConfig[];
  searchTerm: string;
  sortConfig: {
    field: string;
    direction: 'asc' | 'desc';
  } | null;
  currentPage: number;
  rowsPerPage: number;
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  theme: 'light' | 'dark';
  columnVisibility: Record<string, boolean>;
}

export type SortDirection = 'asc' | 'desc';

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

export interface ImportResult {
  success: boolean;
  data: TableRow[];
  errors: ImportError[];
}