import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Alert,
  Snackbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Switch,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Upload,
  Download,
  Refresh,
  DeleteSweep,
  RestartAlt,
  Warning,
  Info,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { importData, resetToDemo, clearAllData } from '../../store/slices/tableSlice';
import { clearPersistedData } from '../../store/index';
import Papa from 'papaparse';

const ImportExportControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, columns, hasImportedData } = useAppSelector((state) => state.table);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  const [replaceMode, setReplaceMode] = useState(true);
  const [clearDialog, setClearDialog] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      showNotification('Please select a valid CSV file', 'error');
      return;
    }

    Papa.parse(file, {
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }

          const rawData = results.data as string[][];
          if (rawData.length < 2) {
            showNotification('CSV file must have at least a header row and one data row', 'error');
            return;
          }

          const headers = rawData[0].map(header => 
            header?.toString().trim() || 'Unnamed'
          );

          const dataRows = rawData.slice(1)
            .filter(row => row.some(cell => cell && cell.toString().trim())) 
            .map((row, index) => {
              const rowData: any = { id: `imported-${Date.now()}-${index}` };
              headers.forEach((header, colIndex) => {
                const cellValue = row[colIndex]?.toString().trim() || '';
                rowData[header] = cellValue;
              });
              return rowData;
            });

          if (dataRows.length === 0) {
            showNotification('No valid data rows found in CSV', 'error');
            return;
          }

          dispatch(importData({
            data: dataRows,
            replaceExisting: replaceMode
          }));

          const actionText = replaceMode ? 'replaced' : 'added';
          showNotification(
            `Successfully ${actionText} ${dataRows.length} rows from ${file.name}`,
            'success'
          );

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }

        } catch (error) {
          console.error('Import error:', error);
          showNotification('Failed to import CSV file', 'error');
        }
      },
      header: false,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });
  };

  const handleExport = () => {
    try {
      if (data.length === 0) {
        showNotification('No data to export', 'warning');
        return;
      }

      const visibleColumns = columns.filter(col => col.visible);
      if (visibleColumns.length === 0) {
        showNotification('No visible columns to export', 'warning');
        return;
      }

      const headers = visibleColumns.map(col => col.label);
      const csvData = [
        headers,
        ...data.map(row => 
          visibleColumns.map(col => {
            const value = row[col.key] || '';
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          })
        )
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = hasImportedData 
        ? `exported-data-${timestamp}.csv`
        : `demo-data-${timestamp}.csv`;
      
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification(`Exported ${data.length} rows to ${filename}`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Failed to export data', 'error');
    }
  };

  const handleClearAll = async () => {
    try {
      dispatch(clearAllData());
      await clearPersistedData(); 
      showNotification('All data cleared successfully', 'success');
      setClearDialog(false);
    } catch (error) {
      console.error('Clear error:', error);
      showNotification('Failed to clear data', 'error');
    }
  };

  const handleResetToDemo = async () => {
    try {
      dispatch(resetToDemo());
      await clearPersistedData(); 
      showNotification('Reset to demo data successfully', 'success');
      setResetDialog(false);
    } catch (error) {
      console.error('Reset error:', error);
      showNotification('Failed to reset to demo data', 'error');
    }
  };

  const handleFullReset = async () => {
    try {
      dispatch(clearAllData());
      await clearPersistedData();
      setTimeout(() => {
        dispatch(resetToDemo());
      }, 100);
      
      showNotification('Application reset successfully - demo data restored', 'success');
    } catch (error) {
      console.error('Full reset error:', error);
      showNotification('Failed to reset application', 'error');
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      {/* Status Indicator */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6">Data Management</Typography>
        <Chip
          icon={hasImportedData ? <Upload /> : <Info />}
          label={hasImportedData ? 'Custom Data Loaded' : 'Demo Data'}
          color={hasImportedData ? 'primary' : 'default'}
          size="small"
        />
        <Typography variant="caption" color="text.secondary">
          ({data.length} rows)
        </Typography>
      </Box>

      {/* Import Controls */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Import CSV Data
        </Typography>
        
        <Box sx={{ mb: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={replaceMode}
                onChange={(e) => setReplaceMode(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span>{replaceMode ? 'Replace existing data' : 'Add to existing data'}</span>
                <Tooltip title={replaceMode 
                  ? "New CSV will completely replace current data" 
                  : "New CSV will be added to current data"
                }>
                  <Info fontSize="small" />
                </Tooltip>
              </Box>
            }
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={() => fileInputRef.current?.click()}
          >
            Import CSV
          </Button>
          <Typography variant="caption" color="text.secondary">
            Select a .csv file to import
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Export & Management Controls */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
          disabled={data.length === 0}
        >
          Export CSV
        </Button>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => setResetDialog(true)}
          color="warning"
        >
          Reset to Demo
        </Button>

        <Button
          variant="outlined"
          startIcon={<DeleteSweep />}
          onClick={() => setClearDialog(true)}
          color="error"
        >
          Clear All
        </Button>

        <Button
          variant="outlined"
          startIcon={<RestartAlt />}
          onClick={handleFullReset}
          color="secondary"
        >
          Full Reset
        </Button>
      </Box>

      {/* Clear Confirmation Dialog */}
      <Dialog open={clearDialog} onClose={() => setClearDialog(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          Clear All Data?
        </DialogTitle>
        <DialogContent>
          <Typography>
            This will permanently delete all data including imported CSV data. 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialog(false)}>Cancel</Button>
          <Button onClick={handleClearAll} color="error" variant="contained">
            Clear All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialog} onClose={() => setResetDialog(false)}>
        <DialogTitle>Reset to Demo Data?</DialogTitle>
        <DialogContent>
          <Typography>
            This will replace all current data with the original demo data. 
            Any imported data will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialog(false)}>Cancel</Button>
          <Button onClick={handleResetToDemo} color="warning" variant="contained">
            Reset to Demo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImportExportControls;