'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search,
  Settings,
  Upload,
  Download,
  Add,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { setSearchTerm } from '@/store/slices/tableSlice';

interface TableControlsProps {
  onManageColumns: () => void;
  onImportCSV: () => void;
  onExportCSV: () => void;
  onAddRow?: () => void;
}

const TableControls: React.FC<TableControlsProps> = ({
  onManageColumns,
  onImportCSV,
  onExportCSV,
  onAddRow,
}) => {
  const dispatch = useAppDispatch();
  const { data, searchTerm, columns } = useAppSelector((state) => state.table);
  
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearchTerm(localSearchTerm));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, dispatch]);

  const visibleColumns = columns.filter(col => col.visible);
  const totalRows = data.length;

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header with stats */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          📊 Data Table Manager
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            label={`${totalRows} Total Rows`} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={`${visibleColumns.length} Visible Columns`} 
            color="secondary" 
            variant="outlined" 
          />
        </Stack>
      </Box>

      {/* Controls */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
      >
        {/* Search */}
        <TextField
          placeholder="Search all fields..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          sx={{ minWidth: { xs: 'auto', sm: 300 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {/* Action buttons */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={onManageColumns}
          >
            Manage Columns
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={onImportCSV}
          >
            Import CSV
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={onExportCSV}
          >
            Export CSV
          </Button>

          {onAddRow && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAddRow}
            >
              Add Row
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default TableControls;