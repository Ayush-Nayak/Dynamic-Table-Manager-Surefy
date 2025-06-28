'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  TableView,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { toggleTheme } from '@/store/slices/appSlice';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.app.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <TableView sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dynamic Data Table Manager
          </Typography>
          <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleThemeToggle}
              aria-label="toggle theme"
            >
              {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;