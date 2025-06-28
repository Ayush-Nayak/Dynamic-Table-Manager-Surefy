import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  TableSortLabel,
  Typography,
  Chip,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Collapse,
  Card,
  CardContent,
  Stack,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Settings,
  MoreVert,
  Edit,
  Delete,
  Save,
  Cancel,
  DragIndicator,
  ExpandMore,
  ExpandLess,
  FilterList,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { 
  setSortBy, 
  setSortOrder, 
  setSearchTerm, 
  setPage, 
  updateRow, 
  deleteRow, 
  reorderColumns,
  setRowsPerPage,
} from '@/store/slices/tableSlice';
import ColumnManagementModal from '../modals/ColumnManagementModal';
import ImportExportControls from './ImportExportControls';
;

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableColumnHeader: React.FC<{
  column: Column;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  onSort: (columnKey: string) => void;
}> = ({ column, sortBy, sortOrder, onSort }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      sx={{
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        position: 'relative',
        '&:hover .drag-handle': {
          opacity: 1,
        },
      }}
      {...attributes}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          className="drag-handle"
          {...listeners}
          sx={{
            opacity: 0,
            transition: 'opacity 0.2s',
            cursor: 'grab',
            '&:active': { cursor: 'grabbing' },
          }}
        >
          <DragIndicator fontSize="small" />
        </Box>
        
        {column.sortable ? (
          <TableSortLabel
            active={sortBy === column.key}
            direction={sortBy === column.key ? sortOrder : 'asc'}
            onClick={() => onSort(column.key)}
            sx={{ fontWeight: 'bold' }}
          >
            {column.label}
          </TableSortLabel>
        ) : (
          <Typography variant="subtitle2" fontWeight="bold">
            {column.label}
          </Typography>
        )}
      </Box>
    </TableCell>
  );
};

const EditableCell: React.FC<{
  value: any;
  rowId: string | number;
  columnKey: string;
  onSave: (rowId: string | number, columnKey: string, value: any) => void;
  type?: 'text' | 'number' | 'email';
}> = ({ value, rowId, columnKey, onSave, type = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(rowId, columnKey, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          size="small"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          type={type}
          autoFocus
          sx={{ minWidth: 100 }}
        />
        <IconButton size="small" onClick={handleSave} color="primary">
          <Save fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleCancel}>
          <Cancel fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
        p: 1,
        borderRadius: 1,
        minHeight: 40,
        display: 'flex',
        alignItems: 'center',
      }}
      onClick={() => setIsEditing(true)}
    >
      {value || '-'}
    </Box>
  );
};

const MobileTableCard: React.FC<{
  row: TableRow;
  columns: Column[];
  onEdit: (rowId: string | number, columnKey: string, value: any) => void;
  onDelete: (rowId: string | number) => void;
}> = ({ row, columns, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const visibleColumns = columns.filter(col => col.visible);
  const primaryColumns = visibleColumns.slice(0, 2);
  const secondaryColumns = visibleColumns.slice(2);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            {primaryColumns.map((column) => (
              <Box key={column.key} sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {column.label}
                </Typography>
                <EditableCell
                  value={row[column.key]}
                  rowId={row.id}
                  columnKey={column.key}
                  onSave={onEdit}
                />
              </Box>
            ))}
          </Box>
          
          <Box>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => onDelete(row.id)}>
                <Delete fontSize="small" sx={{ mr: 1 }} />
                Delete
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {secondaryColumns.length > 0 && (
          <>
            <Button
              onClick={() => setExpanded(!expanded)}
              size="small"
              startIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              sx={{ mt: 1 }}
            >
              {expanded ? 'Show Less' : `Show More (${secondaryColumns.length})`}
            </Button>
            
            <Collapse in={expanded}>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                {secondaryColumns.map((column) => (
                  <Box key={column.key}>
                    <Typography variant="caption" color="text.secondary">
                      {column.label}
                    </Typography>
                    <EditableCell
                      value={row[column.key]}
                      rowId={row.id}
                      columnKey={column.key}
                      onSave={onEdit}
                    />
                  </Box>
                ))}
              </Stack>
            </Collapse>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const BulkActions: React.FC<{
  selectedRows: (string | number)[];
  onDelete: (ids: (string | number)[]) => void;
  onClear: () => void;
}> = ({ selectedRows, onDelete, onClear }) => {
  if (selectedRows.length === 0) return null;

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2">
          {selectedRows.length} row{selectedRows.length > 1 ? 's' : ''} selected
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={() => onDelete(selectedRows)}
          >
            Delete Selected
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={onClear}
            sx={{ color: 'inherit', borderColor: 'currentColor' }}
          >
            Clear Selection
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export const DataTable: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  
  const { 
    data, 
    columns, 
    sortBy, 
    sortOrder, 
    searchTerm, 
    currentPage, 
    rowsPerPage 
  } = useAppSelector((state) => state.table);
  
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = data.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (aValue === bValue) return 0;
        
        let comparison = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [data, searchTerm, sortBy, sortOrder]);

  const visibleColumns = columns.filter(col => col.visible);
  
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * rowsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedData, currentPage, rowsPerPage]);

  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortBy(columnKey));
      dispatch(setSortOrder('asc'));
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
    dispatch(setPage(0));
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = visibleColumns.findIndex(col => col.key === active.id);
      const newIndex = visibleColumns.findIndex(col => col.key === over.id);
      
      const newOrder = arrayMove(visibleColumns, oldIndex, newIndex);
      const allColumns = [...columns];
      
      const reorderedColumns = [
        ...newOrder,
        ...allColumns.filter(col => !col.visible)
      ];
      
      dispatch(reorderColumns(reorderedColumns));
    }
  };

  const handleEditCell = (rowId: string | number, columnKey: string, value: any) => {
    dispatch(updateRow({ id: rowId, data: { [columnKey]: value } }));
  };

  const handleDeleteRow = (rowId: string | number) => {
    dispatch(deleteRow(rowId));
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleBulkDelete = (ids: (string | number)[]) => {
    ids.forEach(id => dispatch(deleteRow(id)));
    setSelectedRows([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (rowId: string | number, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, rowId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== rowId));
    }
  };

  const handleRowMenu = (event: React.MouseEvent, rowId: string | number) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(rowId);
  };

  if (!isClient) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dynamic Data Table Manager
          </Typography>
          <ImportExportControls />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Search all fields..."
              value=""
              sx={{ flexGrow: 1, maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton color="primary" sx={{ p: 1.5 }}>
              <Settings />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip label="Loading..." color="primary" variant="outlined" />
            <Chip label="Loading..." color="secondary" variant="outlined" />
          </Box>
        </Box>
        <Paper elevation={2}>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dynamic Data Table Manager
          </Typography>
          
          <ImportExportControls />
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton
              onClick={() => setColumnModalOpen(true)}
              color="primary"
            >
              <Settings />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`${filteredAndSortedData.length} rows`} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              label={`${visibleColumns.length} columns visible`} 
              color="secondary" 
              variant="outlined" 
            />
            {searchTerm && (
              <Chip 
                label={`Filtered by: "${searchTerm}"`} 
                color="info" 
                variant="outlined"
                onDelete={() => dispatch(setSearchTerm(''))}
              />
            )}
          </Box>
        </Box>

        <BulkActions
          selectedRows={selectedRows}
          onDelete={handleBulkDelete}
          onClear={() => setSelectedRows([])}
        />

        <Box>
          {paginatedData.length > 0 ? (
            paginatedData.map((row) => (
              <MobileTableCard
                key={row.id}
                row={row}
                columns={visibleColumns}
                onEdit={handleEditCell}
                onDelete={handleDeleteRow}
              />
            ))
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? 'No results found' : 'No data available'}
              </Typography>
            </Paper>
          )}
        </Box>

        <Box sx={{ mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAndSortedData.length}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Box>

        <ColumnManagementModal
          open={columnModalOpen}
          onClose={() => setColumnModalOpen(false)}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dynamic Data Table Manager
        </Typography>
        
        <ImportExportControls />
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search all fields..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <Tooltip title="Manage Columns">
            <IconButton
              onClick={() => setColumnModalOpen(true)}
              color="primary"
              sx={{ p: 1.5 }}
            >
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip 
            label={`${filteredAndSortedData.length} rows`} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={`${visibleColumns.length} columns visible`} 
            color="secondary" 
            variant="outlined" 
          />
          {searchTerm && (
            <Chip 
              label={`Filtered by: "${searchTerm}"`} 
              color="info" 
              variant="outlined"
              onDelete={() => dispatch(setSearchTerm(''))}
            />
          )}
          {selectedRows.length > 0 && (
            <Chip 
              label={`${selectedRows.length} selected`} 
              color="warning" 
              variant="outlined" 
            />
          )}
        </Box>
      </Box>

      <BulkActions
        selectedRows={selectedRows}
        onDelete={handleBulkDelete}
        onClear={() => setSelectedRows([])}
      />

      <Paper elevation={2}>
        <TableContainer>
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedData.length}
                      checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableCell>
                  
                  <SortableContext 
                    items={visibleColumns.map(col => col.key)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {visibleColumns.map((column) => (
                      <SortableColumnHeader
                        key={column.key}
                        column={column}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    ))}
                  </SortableContext>
                  
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => (
                    <TableRow key={row.id} hover selected={selectedRows.includes(row.id)}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(row.id)}
                          onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                        />
                      </TableCell>
                      
                      {visibleColumns.map((column) => (
                        <TableCell key={column.key}>
                          <EditableCell
                            value={row[column.key]}
                            rowId={row.id}
                            columnKey={column.key}
                            onSave={handleEditCell}
                            type={typeof row[column.key] === 'number' ? 'number' : 'text'}
                          />
                        </TableCell>
                      ))}
                      
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleRowMenu(e, row.id)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 2} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        {searchTerm ? 'No results found' : 'No data available'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredAndSortedData.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => menuRowId && handleDeleteRow(menuRowId)}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Row
        </MenuItem>
      </Menu>

      <ColumnManagementModal
        open={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
      />
    </Box>
  );
};

export default DataTable;