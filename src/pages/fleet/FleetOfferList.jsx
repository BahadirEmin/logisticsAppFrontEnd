import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Grid,
  TablePagination,
  InputAdornment,
  Button
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { ordersAPI } from '../../api/orders';
import { STATUS_OPTIONS, getStatusColor, getStatusLabel, getStatusIcon } from '../../constants/statusConstants';
import FleetResourceAssignment from '../../components/FleetResourceAssignment';
import { useNavigate } from 'react-router-dom';

const OfferList = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignmentDialog, setAssignmentDialog] = useState({ open: false, order: null });
  const navigate = useNavigate();

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.getOrdersForFleet();
      console.log('Fleet offers API response:', response);
      console.log('Fleet offers data:', response.data);
      
      let offersData = response.data || [];
      
      // If no data from API, add test data to verify statistics logic
      if (!offersData || offersData.length === 0) {
        console.log('No data from API, using test data');
        offersData = [
          {
            id: 1,
            customerName: 'Test Customer 1',
            status: 'Quote',
            departureCity: 'Istanbul',
            arrivalCity: 'Ankara',
            price: 5000
          },
          {
            id: 2,
            customerName: 'Test Customer 2', 
            status: 'Quote',
            departureCity: 'Izmir',
            arrivalCity: 'Antalya',
            price: 6000
          }
        ];
      }
      
      if (offersData && Array.isArray(offersData) && offersData.length > 0) {
        console.log('Sample offer structure:', offersData[0]);
        console.log('Sample offer keys:', Object.keys(offersData[0]));
        console.log('Sample offer status fields:', {
          status: offersData[0].status,
          tripStatus: offersData[0].tripStatus,
          orderStatus: offersData[0].orderStatus,
          state: offersData[0].state
        });
      }
      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching fleet offers:', error);
      setError('Teklifler yüklenirken hata oluştu');
      
      // Use test data on error
      const testData = [
        {
          id: 1,
          customerName: 'Test Customer 1',
          status: 'Quote',
          departureCity: 'Istanbul',
          arrivalCity: 'Ankara',
          price: 5000
        },
        {
          id: 2,
          customerName: 'Test Customer 2', 
          status: 'Quote',
          departureCity: 'Izmir',
          arrivalCity: 'Antalya',
          price: 6000
        }
      ];
      setOffers(testData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleViewDetails = (id) => {
    navigate(`/fleet/detay/${id}`);
  };

  const handleAssignResources = order => {
    setAssignmentDialog({ open: true, order });
  };

  const handleCloseAssignment = () => {
    setAssignmentDialog({ open: false, order: null });
  };

  const handleAssignmentSuccess = () => {
    fetchOffers();
    handleCloseAssignment();
  };

  // Filter offers based on search term and status
  const filteredOffers = offers.filter(offer => {
    const matchesSearch =
      !searchTerm ||
      (offer.id && offer.id.toString().includes(searchTerm.toLowerCase())) ||
      (offer.customerName && offer.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (offer.customer && offer.customer.name && offer.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (offer.departureCity && offer.departureCity.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (offer.arrivalCity && offer.arrivalCity.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (offer.departureAddress && offer.departureAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (offer.arrivalAddress && offer.arrivalAddress.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || !statusFilter || 
      (offer.status === statusFilter || offer.tripStatus === statusFilter);

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalOffers = offers.length;
  const pendingOffers = offers.filter(offer => {
    const status = offer.status || offer.tripStatus;
    return status === 'TEKLIF_ASAMASI';
  }).length;
  const approvedOffers = offers.filter(offer => {
    const status = offer.status || offer.tripStatus;
    return status === 'ONAYLANAN_TEKLIF';
  }).length;
  const rejectedOffers = offers.filter(offer => {
    const status = offer.status || offer.tripStatus;
    return status === 'REDDEDILDI';
  }).length;

  console.log('Offers for statistics:', offers.map(o => ({ 
    id: o.id, 
    status: o.status, 
    tripStatus: o.tripStatus,
    orderStatus: o.orderStatus,
    state: o.state,
    allKeys: Object.keys(o)
  })));
  console.log('Statistics calculated:', { totalOffers, pendingOffers, approvedOffers, rejectedOffers });

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
        Filo Teklifleri
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {totalOffers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toplam Teklif
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {pendingOffers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Teklif Aşaması
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {approvedOffers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Onaylanan
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main" fontWeight="bold">
              {rejectedOffers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reddedilen
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                label="Ara"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                <InputLabel shrink>Durum</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  notched
                  label="Durum"
                >
                  <MenuItem value="all">
                    <Chip label="Tümü" size="small" sx={{ backgroundColor: 'white', color: 'black', border: '1px solid #ddd' }} />
                  </MenuItem>
                  {STATUS_OPTIONS.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        icon={status.icon}
                        sx={{ minWidth: 100 }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell>
                  <strong>Sipariş No</strong>
                </TableCell>
                <TableCell>
                  <strong>Müşteri</strong>
                </TableCell>
                <TableCell>
                  <strong>Nereden</strong>
                </TableCell>
                <TableCell>
                  <strong>Nereye</strong>
                </TableCell>
                <TableCell>
                  <strong>Tarih</strong>
                </TableCell>
                <TableCell>
                  <strong>Durum</strong>
                </TableCell>
                <TableCell>
                  <strong>Tutar</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>İşlemler</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOffers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      Teklif bulunamadı
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOffers.map(offer => (
                  <TableRow key={offer.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        #{offer.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{offer.customerName || offer.customer?.name || 'N/A'}</TableCell>
                    <TableCell>{offer.departureCity || offer.departureAddress || 'N/A'}</TableCell>
                    <TableCell>{offer.arrivalCity || offer.arrivalAddress || 'N/A'}</TableCell>
                    <TableCell>
                      {offer.pickupDate
                        ? new Date(offer.pickupDate).toLocaleDateString('tr-TR')
                        : offer.createdAt
                        ? new Date(offer.createdAt).toLocaleDateString('tr-TR')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(offer.status || offer.tripStatus)}
                        label={getStatusLabel(offer.status || offer.tripStatus)}
                        color={getStatusColor(offer.status || offer.tripStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {offer.actualPrice ? `₺${Number(offer.actualPrice).toLocaleString('tr-TR')}` : 
                         offer.quotePrice ? `₺${Number(offer.quotePrice).toLocaleString('tr-TR')}` :
                         offer.price ? `₺${Number(offer.price).toLocaleString('tr-TR')}` : 
                         offer.totalAmount ? `₺${Number(offer.totalAmount).toLocaleString('tr-TR')}` : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          variant="outlined"
                          onClick={() => handleViewDetails(offer.id)}
                        >
                          Detay
                        </Button>
                        {(offer.status === 'ONAYLANAN_TEKLIF' || offer.tripStatus === 'ONAYLANAN_TEKLIF') && (
                          <Button
                            size="small"
                            startIcon={<AssignmentIcon />}
                            variant="contained"
                            color="primary"
                            onClick={() => handleAssignResources(offer)}
                          >
                            Kaynak Ata
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Resource Assignment Dialog */}
      {assignmentDialog.open && (
        <FleetResourceAssignment
          open={assignmentDialog.open}
          onClose={handleCloseAssignment}
          orderId={assignmentDialog.order?.id}
          orderInfo={assignmentDialog.order}
          onSuccess={handleAssignmentSuccess}
        />
      )}
    </Container>
  );
};

export default OfferList;
