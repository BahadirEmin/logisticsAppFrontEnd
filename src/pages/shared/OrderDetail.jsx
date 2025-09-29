import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  LocalShipping as CargoIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../api/orders';

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const tripStatusOptions = [
    { value: 'TEKLIF_ASAMASI', label: 'Teklif Aşaması', color: 'default' },
    { value: 'ONAYLANDI', label: 'Onaylandı', color: 'success' },
    { value: 'YOLA_CIKTI', label: 'Yola Çıktı', color: 'info' },
    { value: 'GUMRUKTE', label: 'Gümrükte', color: 'warning' },
    { value: 'TAMAMLANDI', label: 'Tamamlandı', color: 'success' },
    { value: 'IPTAL_EDILDI', label: 'İptal Edildi', color: 'error' }
  ];

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersAPI.getById(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Sipariş detayları yüklenirken hata:', err);
      setError('Sipariş detayları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusOption = tripStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'default';
  };

  const getStatusLabel = (status) => {
    const statusOption = tripStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const handleEdit = () => {
    navigate(`/sales/teklifler/${orderId}/duzenle`);
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

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/sales/tekliflerim')}
        >
          Geri Dön
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Sipariş bulunamadı.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/sales/tekliflerim')}
        >
          Geri Dön
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/sales/tekliflerim')}
          >
            Geri Dön
          </Button>
          <Typography variant="h4" component="h1">
            Sipariş Detayı #{order.id}
          </Typography>
        </Box>
        {order.tripStatus === 'TEKLIF_ASAMASI' && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            color="primary"
          >
            Düzenle
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Status Card */}
        <Grid item xs={12}>
          <Card sx={{ 
            height: '100%',
            background: `linear-gradient(135deg, ${
              order.tripStatus === 'TEKLIF_ASAMASI' ? '#f5f5f5, #e0e0e0' :
              order.tripStatus === 'ONAYLANDI' ? '#e8f5e8, #c8e6c9' :
              order.tripStatus === 'YOLA_CIKTI' ? '#e3f2fd, #bbdefb' :
              order.tripStatus === 'GUMRUKTE' ? '#fff3e0, #ffcc02' :
              order.tripStatus === 'TAMAMLANDI' ? '#e8f5e8, #4caf50' :
              '#ffebee, #f44336'
            })`
          }}>
            <CardHeader
              title="Sipariş Durumu ve Özet"
              avatar={<PersonIcon color="primary" />}
              action={
                <Chip
                  label={getStatusLabel(order.tripStatus)}
                  color={getStatusColor(order.tripStatus)}
                  variant="filled"
                  size="large"
                  sx={{ fontWeight: 'bold' }}
                />
              }
            />
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                {/* Sipariş Numarası ve Durum */}
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Sipariş #{order.id}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
                  {getStatusLabel(order.tripStatus)}
                </Typography>
                
                {/* Güzergah */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <strong>{order.departureCity}, {order.departureCountry}</strong> → <strong>{order.arrivalCity}, {order.arrivalCountry}</strong>
                </Typography>
                
                {/* Özet Bilgiler */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mb: 2 }}>
                  <Typography variant="body1">
                    <strong>Yük:</strong> {order.cargoType}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Ağırlık:</strong> {order.cargoWeightKg} kg
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Oluşturulma:</strong> {formatDate(order.createdAt)}
                  </Typography>
                </Box>
                
                {/* Tarih Bilgileri */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                  {order.loadingDate && (
                    <Typography variant="body2" color="warning.main" sx={{ fontWeight: 'medium' }}>
                      <strong>Yükleme:</strong> {formatDate(order.loadingDate)}
                    </Typography>
                  )}
                  {order.deadlineDate && (
                    <Typography variant="body2" color="error.main" sx={{ fontWeight: 'bold' }}>
                      <strong>Son Teslim:</strong> {formatDate(order.deadlineDate)}
                    </Typography>
                  )}
                  {order.estimatedArrivalDate && (
                    <Typography variant="body2" color="info.main" sx={{ fontWeight: 'medium' }}>
                      <strong>Tahmini Varış:</strong> {formatDate(order.estimatedArrivalDate)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Location Information Row */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 380 }}>
            <CardHeader
              title="Kalkış Bilgileri"
              avatar={<LocationIcon color="primary" />}
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Typography variant="h6" gutterBottom color="primary">
                {order.departureCity}, {order.departureCountry}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph sx={{ minHeight: 40 }}>
                {order.departureAddress}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>İlçe:</strong> {order.departureDistrict || 'Belirtilmemiş'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Posta Kodu:</strong> {order.departurePostalCode || 'Belirtilmemiş'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom color="primary">
                İletişim Bilgileri
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Ad Soyad:</strong> {order.departureContactName || 'Belirtilmemiş'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Telefon:</strong> {order.departureContactPhone || 'Belirtilmemiş'}
              </Typography>
              <Typography variant="body2">
                <strong>E-posta:</strong> {order.departureContactEmail || 'Belirtilmemiş'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 380 }}>
            <CardHeader
              title="Varış Bilgileri"
              avatar={<LocationIcon color="secondary" />}
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Typography variant="h6" gutterBottom color="secondary">
                {order.arrivalCity}, {order.arrivalCountry}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph sx={{ minHeight: 40 }}>
                {order.arrivalAddress}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>İlçe:</strong> {order.arrivalDistrict || 'Belirtilmemiş'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Posta Kodu:</strong> {order.arrivalPostalCode || 'Belirtilmemiş'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom color="secondary">
                İletişim Bilgileri
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Ad Soyad:</strong> {order.arrivalContactName || 'Belirtilmemiş'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Telefon:</strong> {order.arrivalContactPhone || 'Belirtilmemiş'}
              </Typography>
              <Typography variant="body2">
                <strong>E-posta:</strong> {order.arrivalContactEmail || 'Belirtilmemiş'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Cargo and Date Information Row */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 280 }}>
            <CardHeader
              title="Yük Bilgileri"
              avatar={<CargoIcon color="info" />}
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Typography variant="h6" gutterBottom color="info.main">
                {order.cargoType}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, mt: 2 }}>
                <strong>Ağırlık:</strong> {order.cargoWeightKg} kg
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Genişlik:</strong> {order.cargoWidth} m
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Uzunluk:</strong> {order.cargoLength} m
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Yükseklik:</strong> {order.cargoHeight} m
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Transfer Edilebilir:</strong> 
                <Chip 
                  label={order.canTransfer ? 'Evet' : 'Hayır'} 
                  color={order.canTransfer ? 'success' : 'error'} 
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 280 }}>
            <CardHeader
              title="Tarih Bilgileri"
              avatar={<ScheduleIcon color="warning" />}
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Typography variant="body2" sx={{ mb: 1, mt: 2 }}>
                <strong>Yükleme Tarihi:</strong> 
                <Box component="span" sx={{ ml: 1, color: 'warning.main' }}>
                  {formatDate(order.loadingDate)}
                </Box>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Son Teslim Tarihi:</strong> 
                <Box component="span" sx={{ ml: 1, color: 'error.main' }}>
                  {formatDate(order.deadlineDate)}
                </Box>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Tahmini Varış Tarihi:</strong> 
                <Box component="span" sx={{ ml: 1, color: 'info.main' }}>
                  {formatDate(order.estimatedArrivalDate)}
                </Box>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Oluşturulma Tarihi:</strong> 
                <Box component="span" sx={{ ml: 1, color: 'text.secondary' }}>
                  {formatDate(order.createdAt)}
                </Box>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Personnel Assignment Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 240 }}>
            <CardHeader 
              title="Personel Atamaları" 
              avatar={<PersonIcon color="primary" />}
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Typography variant="body2" sx={{ mb: 1, mt: 1 }}>
                <strong>Müşteri ID:</strong> {order.customerId}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Satış Personeli ID:</strong> {order.salesPersonId}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Operasyon Personeli:</strong> 
                <Chip 
                  label={order.operationPersonId || 'Atanmamış'} 
                  color={order.operationPersonId ? 'success' : 'default'} 
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Filo Personeli:</strong> 
                <Chip 
                  label={order.fleetPersonId || 'Atanmamış'} 
                  color={order.fleetPersonId ? 'success' : 'default'} 
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body2">
                <strong>Gümrük Personeli:</strong> 
                <Chip 
                  label={order.customsPersonId || 'Atanmamış'} 
                  color={order.customsPersonId ? 'success' : 'default'} 
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Vehicle Assignment Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 240 }}>
            <CardHeader 
              title="Araç Atamaları" 
              avatar={<CargoIcon color="secondary" />}
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Typography variant="body2" sx={{ mb: 1, mt: 1 }}>
                <strong>Atanan Tır:</strong> 
                <Chip 
                  label={order.assignedTruckId || 'Atanmamış'} 
                  color={order.assignedTruckId ? 'success' : 'default'} 
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Atanan Romork:</strong> 
                <Chip 
                  label={order.assignedTrailerId || 'Atanmamış'} 
                  color={order.assignedTrailerId ? 'success' : 'default'} 
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom color="secondary">
                Gümrük Bilgileri
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                <strong>Gümrük Adresi:</strong> {order.customsAddress || 'Belirtilmemiş'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetail;
