import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import SideNavbar from '../components/SideNavbar';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <SideNavbar />
      <Box component="main" sx={{ flexGrow: 1, width: '70%' }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
