import React, { useState, useEffect, useRef } from 'react';
import { TableCell, TextField, IconButton, Box } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

interface EditableTableCellProps {
  value: any;
  columnKey: string;
  rowId: string;
  onSave: (rowId: string, columnKey: string, value: any) => void;
  type?: 'text' | 'number' | 'email';
}

const EditableTableCell: React.FC<EditableTableCellProps> = ({
  value,
  columnKey,
  rowId,
  onSave,
  type = 'text',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const validateValue = (val: string): boolean => {
    setError('');
    
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (val && !emailRegex.test(val)) {
          setError('Invalid email format');
          return false;
        }
        break;
      case 'number':
        if (val && (isNaN(Number(val)) || Number(val) < 0)) {
          setError('Must be a positive number');
          return false;
        }
        break;
      default:
        if (columnKey === 'name' && !val.trim()) {
          setError('Name is required');
          return false;
        }
        break;
    }
    return true;
  };

  const handleSave = () => {
    const stringValue = String(editValue);
    if (validateValue(stringValue)) {
      const finalValue = type === 'number' ? Number(editValue) || 0 : stringValue;
      onSave(rowId, columnKey, finalValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setError('');
    setIsEditing(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  if (isEditing) {
    return (
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            ref={inputRef}
            size="small"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            type={type === 'number' ? 'number' : 'text'}
            error={!!error}
            helperText={error}
            sx={{ minWidth: 120 }}
          />
          <IconButton size="small" onClick={handleSave} color="primary">
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleCancel} color="secondary">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
    );
  }

  return (
    <TableCell 
      onDoubleClick={handleDoubleClick}
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        }
      }}
    >
      {value || ''}
    </TableCell>
  );
};

export default EditableTableCell;