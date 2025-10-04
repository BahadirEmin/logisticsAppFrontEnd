import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Switch,
  FormControlLabel,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle,
  Schedule,
  LocalShipping,
  Assignment as AssignmentIcon,
  DirectionsCar as TruckIcon,
  Person as DriverIcon,
  Person as PersonIcon,
  LocalShipping as TrailerIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { ordersAPI } from '../../api/orders';
import { usersAPI } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';
import FleetResourceAssignment from '../../components/FleetResourceAssignment';
import { STATUS_OPTIONS, getStatusColor, getStatusLabel, getStatusIcon } from '../../constants/statusConstants';
import { useNavigate } from 'react-router-dom';

const OfferList = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignmentDialog, setAssignmentDialog] = useState({ open: false, order: null });
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadFleetOffers = useCallback(async () => {
    try {
      setError(null);

      // Always load all fleet offers, then filter in frontend based on switch
      const response = await ordersAPI.getOrdersForFleet();
      
      const processedOffers = Array.isArray(response.data || response) ? (response.data || response) : [];
      
      // API response already has correct field names: assignedTruckId, assignedDriverId, assignedTrailerId
      setOffers(processedOffers);
    } catch (err) {
      console.error('Fleet teklifleri yüklenirken hata:', err);
      setError('Teklifler yüklenirken bir hata oluştu.');
      setOffers([]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadFleetOffers().finally(() => setLoading(false));
  }, []);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch =
      (offer.customerName || offer.customer?.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (offer.departureCity || offer.departureAddress || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (offer.arrivalCity || offer.arrivalAddress || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (offer.cargoType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.id?.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' || (offer.tripStatus || offer.status) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewOffer = orderId => {
    navigate(`/fleet/aktif-isler/${orderId}`);
  };  const handleAssignResources = offer => {
    setAssignmentDialog({ open: true, order: offer });
  };

  const handleCloseAssignment = () => {
    setAssignmentDialog({ open: false, order: null });
  };

  const handleAssignmentSuccess = async (orderId) => {
    // Immediately close the dialog
    handleCloseAssignment();
    
    // Show success toast with custom styling
    toast.success('Kaynak ataması başarıyla tamamlandı!', {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      style: {
        backgroundColor: '#4caf50',
        color: 'white',
        fontSize: '14px',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
        border: 'none',
        fontWeight: '500'
      },
      progressStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
      }
    });

    try {
      // Update the specific order data in background
      if (orderId) {
        const updatedOrder = await ordersAPI.getById(orderId);
        
        // Update the specific offer in the state (API response has correct field names)
        setOffers(prevOffers => 
          prevOffers.map(offer => 
            offer.id === orderId ? updatedOrder : offer
          )
        );
      }
    } catch (error) {
      console.error('Failed to fetch updated order:', error);
      // Fallback to full reload if individual fetch fails
      loadFleetOffers();
      
      // Show error toast if data refresh fails
      toast.error('Veri güncellenirken hata oluştu, sayfa yenileniyor...', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        style: {
          backgroundColor: '#f44336',
          color: 'white',
          fontSize: '14px',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
          border: 'none',
          fontWeight: '500'
        }
      });
    }
  };

  const renderResourceIcons = offer => {
    // Use the correct field names from API response
    const hasVehicle = offer.assignedTruckId;
    const hasDriver = offer.assignedDriverId;
    const hasTrailer = offer.assignedTrailerId;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Truck Icon - Blue */}
        <Tooltip
          title={
            hasVehicle
              ? `Assigned Vehicle: ${offer.assignedTruckPlateNo || 'Unknown'}`
              : 'No vehicle assigned'
          }
        >
          <TruckIcon
            sx={{
              color: hasVehicle ? 'primary.main' : 'grey.400',
              fontSize: 20
            }}
          />
        </Tooltip>

        {/* Driver Icon - Green */}
        <Tooltip
          title={
            hasDriver
              ? `Assigned Driver: ${offer.assignedDriverName || 'Unknown'}`
              : 'No driver assigned'
          }
        >
          <DriverIcon
            sx={{
              color: hasDriver ? 'success.main' : 'grey.400',
              fontSize: 20
            }}
          />
        </Tooltip>

        {/* Trailer Icon - Orange */}
        <Tooltip
          title={
            hasTrailer
              ? `Assigned Trailer: ${offer.assignedTrailerNo || 'Unknown'}`
              : 'No trailer assigned'
          }
        >
          <TrailerIcon
            sx={{
              color: hasTrailer ? 'warning.main' : 'grey.400',
              fontSize: 20
            }}
          />
        </Tooltip>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
        Aktif İşler
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {offers.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toplam Teklif
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {offers.filter(o => {
                const status = o.tripStatus || o.status;
                return status === 'TEKLIF_ASAMASI';
              }).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Teklif Aşaması
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              {offers.filter(o => (o.tripStatus || o.status) === 'YOLA_CIKTI').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Yolda
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {offers.reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toplam Değer
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Resource Icons Legend - Always visible */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon sx={{ mr: 1 }} />
          Kaynak Durumu Açıklaması:
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TruckIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="caption">Araç Atanmış (Mavi)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DriverIcon color="success" sx={{ fontSize: 20 }} />
            <Typography variant="caption">Şoför Atanmış (Yeşil)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrailerIcon color="warning" sx={{ fontSize: 20 }} />
            <Typography variant="caption">Römork Atanmış (Turuncu)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TruckIcon color="disabled" sx={{ fontSize: 20 }} />
            <Typography variant="caption">Gri = Atanmamış</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
            <TextField
              size="small"
              label="Ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel shrink>Durum Filtresi</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Durum Filtresi"
                notched
              >
                <MenuItem value="all">
                  <Chip label="Tümü" size="small" sx={{ backgroundColor: 'white', color: 'black', border: '1px solid #ddd' }} />
                </MenuItem>
                {STATUS_OPTIONS.map(status => (
                  <MenuItem key={status.value} value={status.value}>
                    <Chip
                      label={status.label}
                      size="small"
                      color={status.color}
                      icon={status.icon}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      {/* Offers Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>
                  <strong>Teklif No</strong>
                </TableCell>
                <TableCell>
                  <strong>Müşteri</strong>
                </TableCell>
                <TableCell sx={{ minWidth: 180 }}>
                  <strong>Nereden</strong>
                </TableCell>
                <TableCell sx={{ minWidth: 180 }}>
                  <strong>Nereye</strong>
                </TableCell>
                <TableCell>
                  <strong>Yük Bilgisi</strong>
                </TableCell>
                <TableCell>
                  <strong>Kaynak Durumu</strong>
                </TableCell>
                <TableCell>
                  <strong>Durum</strong>
                </TableCell>
                <TableCell>
                  <strong>Atanma Tarihi</strong>
                </TableCell>
                <TableCell>
                  <strong>Tahmini Teslimat</strong>
                </TableCell>
                <TableCell>
                  <strong>Fiyat</strong>
                </TableCell>
                <TableCell>
                  <strong>Detay Görüntüle</strong>
                </TableCell>
                <TableCell>
                  <strong>Kaynak Yönetimi</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOffers.map(offer => (
                <TableRow key={offer.id} hover>
                  <TableCell>#{offer.id}</TableCell>
                  <TableCell>{offer.customerName || offer.customer?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {offer.departureCity}, {offer.departureCountry}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {offer.departureAddress}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {offer.arrivalCity}, {offer.arrivalCountry}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {offer.arrivalAddress}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{offer.cargoType || 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {offer.cargoWeightKg} kg
                      {offer.cargoWidth &&
                        offer.cargoLength &&
                        offer.cargoHeight &&
                        ` • ${offer.cargoWidth}x${offer.cargoLength}x${offer.cargoHeight}m`}
                    </Typography>
                  </TableCell>
                  <TableCell>{renderResourceIcons(offer)}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(offer.tripStatus || offer.status)}
                      label={getStatusLabel(offer.tripStatus || offer.status)}
                      color={getStatusColor(offer.tripStatus || offer.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {offer.createdAt
                        ? new Date(offer.createdAt).toLocaleDateString('tr-TR')
                        : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {offer.createdAt
                        ? new Date(offer.createdAt).toLocaleTimeString('tr-TR')
                        : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {offer.estimatedDeliveryDate
                      ? new Date(offer.estimatedDeliveryDate).toLocaleDateString('tr-TR')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <strong>{offer.price ? `${offer.price}` : 'N/A'}</strong>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      variant="outlined"
                      onClick={() => handleViewOffer(offer.id)}
                      fullWidth
                    >
                      Detay
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<AssignmentIcon />}
                      variant="contained"
                      color="primary"
                      onClick={() => handleAssignResources(offer)}
                      fullWidth
                    >
                      Kaynak Ata
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

            {filteredOffers.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Arama kriterlerinize uygun teklif bulunamadı.
        </Alert>
      )}

      {/* Fleet Resource Assignment Dialog */}
      <FleetResourceAssignment
        open={assignmentDialog.open}
        onClose={handleCloseAssignment}
        orderId={assignmentDialog.order?.id}
        orderInfo={assignmentDialog.order}
        onSuccess={handleAssignmentSuccess}
      />
    </Container>
  );
};

export default OfferList;
