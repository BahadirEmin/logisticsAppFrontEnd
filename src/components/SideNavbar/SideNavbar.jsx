import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  Divider,
  Button
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimelineIcon from '@mui/icons-material/Timeline';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../contexts/AuthContext';
import './SideNavbar.css';

const drawerWidth = '20%';

const SideNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const userRole = user?.role;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/login');
    }
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { text: 'Home', icon: <HomeIcon />, path: '/admin' },
          { text: 'Trucks', icon: <LocalShippingIcon />, path: '/admin/trucks' },
          { text: 'Drivers', icon: <PersonIcon />, path: '/admin/drivers' },
          { text: 'Personnels', icon: <GroupIcon />, path: '/admin/personnels' },
          { text: 'Trailers', icon: <DirectionsCarIcon />, path: '/admin/trailers' },
        ];
      case 'operator':
      case 'operation':
        return [
          { text: 'Dashboard', icon: <HomeIcon />, path: '/operator' },
          { text: 'Hesabım', icon: <AccountCircleIcon />, path: '/operator/hesabim' },
          { text: 'Tekliflerim', icon: <ListAltIcon />, path: '/operator/tekliflerim' },
          { text: 'Onaylanan Teklifler', icon: <CheckCircleIcon />, path: '/operator/onaylanan-teklifler' },
          { text: 'Sefer Takip Ekranı', icon: <TimelineIcon />, path: '/operator/sefer-takip' },
        ];
      case 'sales':
        return [
          { text: 'Dashboard', icon: <HomeIcon />, path: '/sales' },
          { text: 'Müşteriler', icon: <PeopleIcon />, path: '/sales/musteriler' },
          { text: 'Tedarikçiler', icon: <BusinessIcon />, path: '/sales/tedarikciler' },
          { text: 'Teklif Ver', icon: <AddIcon />, path: '/sales/teklif-ver' },
          { text: 'Teklifler', icon: <AssignmentIcon />, path: '/sales/teklifler' },
          { text: 'Tekliflerim', icon: <ListAltIcon />, path: '/sales/tekliflerim' },
        ];
      case 'fleet':
        return [
          { text: 'Dashboard', icon: <HomeIcon />, path: '/fleet' },
          { text: 'Tekliflerim', icon: <ListAltIcon />, path: '/fleet/tekliflerim' },
          { text: 'Tırlar', icon: <LocalShippingIcon />, path: '/fleet/tirlar' },
          { text: 'Sürücüler', icon: <PersonIcon />, path: '/fleet/suruculer' },
          { text: 'Römorklar', icon: <DirectionsCarIcon />, path: '/fleet/romorklar' },
          { text: 'Teklifler', icon: <AssignmentIcon />, path: '/fleet/teklifler' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant="permanent"
      className="side-navbar"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="div" className="app-title">
          Logistics App
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
          {user?.name || user?.username}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {userRole === 'admin' ? 'Admin' : userRole === 'operator' || userRole === 'operation' ? 'Operasyoncu' : userRole === 'fleet' ? 'Filocu' : 'Satışçı'}
        </Typography>
      </Box>
      <Divider className="divider" />
      <List sx={{ pt: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isSelected}
                className={`nav-item ${isSelected ? 'selected' : ''}`}
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  mb: 1,
                }}
              >
                <ListItemIcon className="nav-icon">
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  className={`nav-text ${isSelected ? 'selected' : ''}`}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      {/* Logout button at bottom */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Çıkış Yap
        </Button>
      </Box>
    </Drawer>
  );
};

export default SideNavbar; 