import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { toggleColumnVisibility, addColumn, removeColumn } from '@/store/slices/tableSlice';

interface ColumnManagementModalProps {
  open: boolean;
  onClose: () => void;
}

const ColumnManagementModal: React.FC<ColumnManagementModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { columns, columnVisibility } = useAppSelector((state) => state.table);
  const [newColumnName, setNewColumnName] = useState('');

  const handleToggleColumn = (columnKey: string) => {
    dispatch(toggleColumnVisibility(columnKey));
  };

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const columnKey = newColumnName.toLowerCase().replace(/\s+/g, '_');
      dispatch(addColumn({
        key: columnKey,
        label: newColumnName.trim(),
        sortable: true,
      }));
      setNewColumnName('');
    }
  };

  const handleRemoveColumn = (columnKey: string) => {
    
    const defaultColumns = ['name', 'email', 'age', 'role'];
    if (!defaultColumns.includes(columnKey)) {
      dispatch(removeColumn(columnKey));
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddColumn();
    }
  };

  
  if (!columns || !Array.isArray(columns)) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Manage Columns
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>Loading columns...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Manage Columns
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          Column Visibility
        </Typography>
        
        <List dense>
          {columns.map((column) => {
            
            if (!column || typeof column !== 'object') {
              return null;
            }
            
            return (
              <ListItem key={column.key || 'unknown'} disablePadding>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={columnVisibility?.[column.key] !== false}
                      onChange={() => handleToggleColumn(column.key)}
                    />
                  }
                  label={column.label || column.key || 'Unknown Column'}
                />
                <ListItemSecondaryAction>
                  {!['name', 'email', 'age', 'role'].includes(column.key) && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveColumn(column.key)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Add New Column
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter column name (e.g., Department, Location)"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              variant="contained"
              onClick={handleAddColumn}
              disabled={!newColumnName.trim()}
            >
              Add
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnManagementModal;