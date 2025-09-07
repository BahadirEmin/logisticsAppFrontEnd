import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, ml: 0 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#1976d2' }}>
          Welcome to Logistics Management System
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Manage your trucks, drivers, personnels and trailers efficiently
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <LocalShippingIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
            <Typography variant="h6" component="h2" gutterBottom>
              Trucks Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View, add, edit, and manage your fleet of trucks. Track maintenance, 
              assign drivers, and monitor vehicle status.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <PersonIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
            <Typography variant="h6" component="h2" gutterBottom>
              Drivers Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage driver information, licenses, schedules, and assignments. 
              Keep track of driver performance and availability.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <GroupIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
            <Typography variant="h6" component="h2" gutterBottom>
              Personnels Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all personnel information, roles, schedules, and assignments. 
              Keep track of employee performance and availability.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <DirectionsCarIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
            <Typography variant="h6" component="h2" gutterBottom>
              Trailers Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View, add, edit, and manage your fleet of trailers. Track maintenance, 
              assign to trucks, and monitor trailer status.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Use the navigation menu on the left to access different management sections
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage; 