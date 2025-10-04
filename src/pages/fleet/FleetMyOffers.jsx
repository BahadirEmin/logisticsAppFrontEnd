import React, { useState, useEffect, useCallback } from 'react';
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
  Button
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
  LocalShipping as TrailerIcon
} from '@mui/icons-material';
import { ordersAPI } from '../../api/orders';
import { useAuth } from '../../contexts/AuthContext';
import FleetResourceAssignment from '../../components/FleetResourceAssignment';
import { STATUS_OPTIONS, getStatusColor, getStatusLabel, getStatusIcon } from '../../constants/statusConstants';
import { useNavigate } from 'react-router-dom';

const FleetMyOffers = () => {
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
      setLoading(true);
      setError(null);

      // Get orders assigned to fleet user
      console.log('Fetching orders for fleet person ID:', user.id);
      const data = await ordersAPI.getByFleetPersonId(user.id);
      console.log('Fleet My Offers API Response:', data);
      
      // Ensure data is an array and has proper structure
      const processedOffers = Array.isArray(data) ? data : [];
      setOffers(processedOffers);
    } catch (err) {
      console.error('Fleet teklifleri yüklenirken hata:', err);
      setError('Teklifler yüklenirken bir hata oluştu.');
      setOffers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadFleetOffers();
  }, [loadFleetOffers]);

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

  const handleViewOffer = (offerId) => {
    navigate(`/fleet/detay/${offerId}`);
  };

  const handleAssignResources = order => {
    setAssignmentDialog({ open: true, order });
  };

  const handleCloseAssignment = () => {
    setAssignmentDialog({ open: false, order: null });
  };

  const handleAssignmentSuccess = () => {
    // Reload offers after successful assignment
    loadFleetOffers();
  };

  const renderResourceIcons = offer => {
    const hasVehicle = offer.vehicleId || offer.vehicle || offer.assignedTruckId;
    const hasDriver = offer.driverId || offer.driver || offer.assignedDriverId;
    const hasTrailer = offer.trailerId || offer.trailer || offer.assignedTrailerId;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Truck Icon */}
        <Tooltip
          title={
            hasVehicle
              ? `Araç: ${offer.vehicle?.plateNumber || offer.vehicleId || offer.assignedTruckId}`
              : 'Araç atanmamış'
          }
        >
          <TruckIcon color={hasVehicle ? 'primary' : 'disabled'} sx={{ fontSize: 24 }} />
        </Tooltip>

        {/* Driver Icon */}
        <Tooltip
          title={
            hasDriver
              ? `Şoför: ${offer.driver?.name || offer.driverId || offer.assignedDriverId}`
              : 'Şoför atanmamış'
          }
        >
          <DriverIcon color={hasDriver ? 'success' : 'disabled'} sx={{ fontSize: 24 }} />
        </Tooltip>

        {/* Trailer Icon */}
        <Tooltip
          title={
            hasTrailer
              ? `Römork: ${offer.trailer?.plateNumber || offer.trailerId || offer.assignedTrailerId}`
              : 'Römork atanmamış'
          }
        >
          <TrailerIcon color={hasTrailer ? 'warning' : 'disabled'} sx={{ fontSize: 24 }} />
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
        Filo Tekliflerim
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
              ₺{offers.reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0).toLocaleString()}
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

      {/* Resource Icons Legend */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon sx={{ mr: 1 }} />
          Kaynak Durumu Açıklaması:
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TruckIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="caption">Araç Atanmış</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DriverIcon color="success" sx={{ fontSize: 20 }} />
            <Typography variant="caption">Şoför Atanmış</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrailerIcon color="warning" sx={{ fontSize: 20 }} />
            <Typography variant="caption">Römork Atanmış</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TruckIcon color="disabled" sx={{ fontSize: 20 }} />
            <Typography variant="caption">Gri = Atanmamış</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              size="small"
              label="Ara"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
              <InputLabel shrink>Durum Filtresi</InputLabel>
              <Select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
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
          </Grid>
        </Grid>
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
                <TableCell>
                  <strong>Rota</strong>
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
                  <strong>İşlemler</strong>
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
                      {offer.departureCity || offer.departureAddress || 'N/A'} →{' '}
                      {offer.arrivalCity || offer.arrivalAddress || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{offer.cargoType || 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {offer.cargoWeightKg ? `${offer.cargoWeightKg} kg` : 'N/A'}
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
                    {offer.createdAt
                      ? new Date(offer.createdAt).toLocaleDateString('tr-TR')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {offer.estimatedDeliveryDate
                      ? new Date(offer.estimatedDeliveryDate).toLocaleDateString('tr-TR')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <strong>{offer.price ? `₺${offer.price}` : 'N/A'}</strong>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        variant="outlined"
                        onClick={() => handleViewOffer(offer.id)}
                      >
                        Detay
                      </Button>
                      <Button
                        size="small"
                        startIcon={<AssignmentIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => handleAssignResources(offer)}
                      >
                        Kaynak Ata
                      </Button>
                    </Box>
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

export default FleetMyOffers;
