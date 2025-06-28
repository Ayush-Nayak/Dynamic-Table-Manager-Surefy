'use client';
import React from 'react';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import DataTable from '@/components/table/DataTable';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dynamic Data Table Manager
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <DataTable />
      </Container>
    </Box>
  );
}
