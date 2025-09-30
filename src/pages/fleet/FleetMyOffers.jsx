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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
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
  LocalShipping as TrailerIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { ordersAPI } from '../../api/orders';
import { useAuth } from '../../contexts/AuthContext';
import FleetResourceAssignment from '../../components/FleetResourceAssignment';
import { STATUS_OPTIONS, getStatusColor, getStatusLabel, getStatusIcon } from '../../constants/statusConstants';

const FleetMyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignmentDialog, setAssignmentDialog] = useState({ open: false, order: null });
  const [orderDetailsDialog, setOrderDetailsDialog] = useState({
    open: false,
    order: null,
    loading: false,
  });
  const { user } = useAuth();

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

  const handleViewOffer = async offerId => {
    try {
      setOrderDetailsDialog({ open: true, order: null, loading: true });
      const orderDetails = await ordersAPI.getById(offerId);
      setOrderDetailsDialog({ open: true, order: orderDetails, loading: false });
    } catch (err) {
      console.error('Order details yüklenirken hata:', err);
      setOrderDetailsDialog({ open: false, order: null, loading: false });
      setError('Sipariş detayları yüklenirken bir hata oluştu.');
    }
  };

  const handleAssignResources = order => {
    setAssignmentDialog({ open: true, order });
  };

  const handleCloseAssignment = () => {
    setAssignmentDialog({ open: false, order: null });
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsDialog({ open: false, order: null, loading: false });
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
                  <Chip label="Tümü" size="small" variant="outlined" />
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
                      variant="outlined"
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
                      <Tooltip title="Detay Görüntüle">
                        <IconButton size="small" onClick={() => handleViewOffer(offer.id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Kaynak Ata">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleAssignResources(offer)}
                        >
                          <AssignmentIcon />
                        </IconButton>
                      </Tooltip>
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

      {/* Order Details Dialog */}
      <Dialog
        open={orderDetailsDialog.open}
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '60vh' },
        }}
      >
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant="h6" component="div">
            Sipariş Detayları
          </Typography>
          <IconButton onClick={handleCloseOrderDetails} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {orderDetailsDialog.loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : orderDetailsDialog.order ? (
            <Box>
              {/* Order Basic Info */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <BusinessIcon sx={{ mr: 1 }} />
                        Sipariş Bilgileri
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Sipariş No"
                            secondary={`#${orderDetailsDialog.order.id}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Müşteri"
                            secondary={
                              orderDetailsDialog.order.customerName ||
                              orderDetailsDialog.order.customer?.name ||
                              'N/A'
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Durum"
                            secondary={
                              <Chip
                                icon={getStatusIcon(
                                  orderDetailsDialog.order.tripStatus ||
                                    orderDetailsDialog.order.status
                                )}
                                label={getStatusLabel(
                                  orderDetailsDialog.order.tripStatus ||
                                    orderDetailsDialog.order.status
                                )}
                                color={getStatusColor(
                                  orderDetailsDialog.order.tripStatus ||
                                    orderDetailsDialog.order.status
                                )}
                                size="small"
                              />
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Fiyat"
                            secondary={
                              <Typography variant="h6" color="success.main">
                                ₺{orderDetailsDialog.order.price || 'N/A'}
                              </Typography>
                            }
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <LocationIcon sx={{ mr: 1 }} />
                        Rota Bilgileri
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Kalkış"
                            secondary={
                              orderDetailsDialog.order.departureCity ||
                              orderDetailsDialog.order.departureAddress ||
                              'N/A'
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Varış"
                            secondary={
                              orderDetailsDialog.order.arrivalCity ||
                              orderDetailsDialog.order.arrivalAddress ||
                              'N/A'
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Yük Türü"
                            secondary={orderDetailsDialog.order.cargoType || 'N/A'}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Yük Ağırlığı"
                            secondary={
                              orderDetailsDialog.order.cargoWeightKg
                                ? `${orderDetailsDialog.order.cargoWeightKg} kg`
                                : 'N/A'
                            }
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Assigned Resources */}
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <AssignmentIcon sx={{ mr: 1 }} />
                    Atanan Kaynaklar
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                        }}
                      >
                        <TruckIcon color="primary" sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle2">Araç</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {orderDetailsDialog.order.vehicle?.plateNumber ||
                              orderDetailsDialog.order.vehicleId ||
                              'Atanmamış'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                        }}
                      >
                        <DriverIcon color="success" sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle2">Şoför</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {orderDetailsDialog.order.driver?.name ||
                              orderDetailsDialog.order.driverId ||
                              'Atanmamış'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                        }}
                      >
                        <TrailerIcon color="warning" sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle2">Römork</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {orderDetailsDialog.order.trailer?.plateNumber ||
                              orderDetailsDialog.order.trailerId ||
                              'Atanmamış'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Additional Details */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <CalendarIcon sx={{ mr: 1 }} />
                    Tarih Bilgileri
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Oluşturulma Tarihi
                      </Typography>
                      <Typography variant="body1">
                        {orderDetailsDialog.order.createdAt
                          ? new Date(orderDetailsDialog.order.createdAt).toLocaleDateString('tr-TR')
                          : 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Tahmini Teslimat
                      </Typography>
                      <Typography variant="body1">
                        {orderDetailsDialog.order.estimatedDeliveryDate
                          ? new Date(
                              orderDetailsDialog.order.estimatedDeliveryDate
                            ).toLocaleDateString('tr-TR')
                          : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDetails} variant="outlined">
            Kapat
          </Button>
          {orderDetailsDialog.order && (
            <Button
              onClick={() => {
                handleCloseOrderDetails();
                handleAssignResources(orderDetailsDialog.order);
              }}
              variant="contained"
              startIcon={<AssignmentIcon />}
            >
              Kaynak Ata
            </Button>
          )}
        </DialogActions>
      </Dialog>

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
