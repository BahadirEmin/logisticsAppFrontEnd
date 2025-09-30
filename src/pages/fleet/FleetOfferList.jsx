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
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../api/orders';
import FleetResourceAssignment from '../../components/FleetResourceAssignment';

const OfferList = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignmentDialog, setAssignmentDialog] = useState({ open: false, order: null });
  const navigate = useNavigate();

  // Offer status translation
  const getStatusTranslation = status => {
    const translations = {
      Pending: 'Beklemede',
      Approved: 'Onaylandı',
      Rejected: 'Reddedildi',
      Quote: 'Teklif Aşamasında',
      Negotiation: 'Müzakere',
      Finalized: 'Kesinleşmiş',
    };
    return translations[status] || status;
  };

  const getStatusColor = status => {
    const colors = {
      Pending: 'warning',
      Approved: 'success',
      Rejected: 'error',
      Quote: 'info',
      Negotiation: 'primary',
      Finalized: 'success',
    };
    return colors[status] || 'default';
  };

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrdersForFleet();
      setOffers(response.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setError('Teklifler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleViewDetails = id => {
    navigate(`/fleet/offers/${id}`);
  };

  const handleEditOffer = id => {
    navigate(`/fleet/offers/${id}/edit`);
  };

  const handleDeleteOffer = async id => {
    if (!window.confirm('Bu teklifi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await ordersAPI.deleteOrder(id);
      setOffers(offers.filter(offer => offer.id !== id));
    } catch (error) {
      console.error('Error deleting offer:', error);
      setError('Teklif silinirken hata oluştu');
    }
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
      offer.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.deliveryLocation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || offer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalOffers = offers.length;
  const pendingOffers = offers.filter(offer => offer.status === 'Quote').length;
  const approvedOffers = offers.filter(offer => offer.status === 'Approved').length;
  const rejectedOffers = offers.filter(offer => offer.status === 'Rejected').length;

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
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {pendingOffers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Teklif Aşamasında
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
                label="Arama"
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
                  <MenuItem value="">Tümü</MenuItem>
                  <MenuItem value="Quote">Teklif Aşamasında</MenuItem>
                  <MenuItem value="Approved">Onaylandı</MenuItem>
                  <MenuItem value="Rejected">Reddedildi</MenuItem>
                  <MenuItem value="Pending">Beklemede</MenuItem>
                  <MenuItem value="Negotiation">Müzakere</MenuItem>
                  <MenuItem value="Finalized">Kesinleşmiş</MenuItem>
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
                        {offer.orderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{offer.customerName}</TableCell>
                    <TableCell>{offer.pickupLocation}</TableCell>
                    <TableCell>{offer.deliveryLocation}</TableCell>
                    <TableCell>
                      {offer.pickupDate
                        ? new Date(offer.pickupDate).toLocaleDateString('tr-TR')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusTranslation(offer.status)}
                        color={getStatusColor(offer.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {offer.totalAmount ? `₺${offer.totalAmount.toLocaleString('tr-TR')}` : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Detayları Görüntüle">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(offer.id)}
                            color="primary"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Düzenle">
                          <IconButton
                            size="small"
                            onClick={() => handleEditOffer(offer.id)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {offer.status === 'Approved' && (
                          <Tooltip title="Kaynak Ata">
                            <IconButton
                              size="small"
                              onClick={() => handleAssignResources(offer)}
                              color="success"
                            >
                              <AssignmentIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Sil">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteOffer(offer.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
          order={assignmentDialog.order}
          onSuccess={handleAssignmentSuccess}
        />
      )}
    </Container>
  );
};

export default OfferList;
