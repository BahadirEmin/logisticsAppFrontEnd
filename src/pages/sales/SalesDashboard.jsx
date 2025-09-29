import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  CircularProgress,
  Alert,
  AlertTitle,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Add, 
  ListAlt, 
  TrendingUp,
  AttachMoney,
  CheckCircle,
  Pending,
  Cancel,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../api/orders';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    thisMonthOffers: 0,
    approvedOffers: 0,
    pendingOffers: 0,
    totalValue: 0
  });
  const [approvedOffersNeedingOperator, setApprovedOffersNeedingOperator] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const orders = await ordersAPI.getAll();
      
      // Bu ayın teklifleri (örnek: Son 30 gün)
      const currentDate = new Date();
      const thirtyDaysAgo = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
      
      const thisMonthOffers = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= thirtyDaysAgo;
      }).length;
      
      const approvedOffers = orders.filter(o => o.tripStatus === 'ONAYLANDI').length;
      const pendingOffers = orders.filter(o => o.tripStatus === 'TEKLIF_ASAMASI').length;
      
      // Operatör atanmamış onaylanan teklifler
      const needsOperator = orders.filter(o => 
        o.tripStatus === 'ONAYLANDI' && 
        (!o.operationPersonId && !o.fleetPersonId)
      );

      setApprovedOffersNeedingOperator(needsOperator);
      
      // Toplam değer hesaplama (quotePrice alanından)
      const totalValue = orders.reduce((sum, order) => {
        return sum + (parseFloat(order.quotePrice) || 0);
      }, 0);

      setDashboardData({
        thisMonthOffers,
        approvedOffers,
        pendingOffers,
        totalValue
      });
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffer = () => {
    navigate('/sales/teklif-ver');
  };

  const handleViewOffers = () => {
    navigate('/sales/tekliflerim');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, ml: 0 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2' }}>
          Satışçı Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Teklif yönetimi ve satış takip sistemi
        </Typography>
      </Box>

      {/* Quick Stats */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Add sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {dashboardData.thisMonthOffers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bu Ay Teklif
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {dashboardData.approvedOffers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Onaylanan
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Pending sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {dashboardData.pendingOffers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bekleyen
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                {dashboardData.totalValue > 1000 
                  ? `${Math.round(dashboardData.totalValue / 1000)}K` 
                  : dashboardData.totalValue
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Değer (₺)
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Operasyon Atama Uyarısı */}
      {!loading && approvedOffersNeedingOperator.length > 0 && (
        <Alert severity="warning" sx={{ mb: 4 }} icon={<WarningIcon />}>
          <AlertTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentIcon />
              Operatör Atama Gerekiyor
            </Box>
          </AlertTitle>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {approvedOffersNeedingOperator.length} adet onaylanan teklif için operatör atanması gerekiyor.
          </Typography>
          
          <List dense sx={{ mt: 1 }}>
            {approvedOffersNeedingOperator.slice(0, 3).map((offer) => (
              <ListItem key={offer.id} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <PersonIcon color="warning" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Teklif #{offer.id}
                      </Typography>
                      <Chip 
                        label={`${offer.estimatedPrice || 0} ${offer.currency || 'TRY'}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {offer.departureCity} → {offer.arrivalCity} | {offer.customerName}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            {approvedOffersNeedingOperator.length > 3 && (
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="warning.main" fontWeight="bold">
                      ... ve {approvedOffersNeedingOperator.length - 3} teklif daha
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="warning"
              size="small"
              startIcon={<AssignmentIcon />}
              onClick={() => navigate('/sales/tekliflerim?filter=approved')}
            >
              Operatör Ataması Yap
            </Button>
          </Box>
        </Alert>
      )}

      {/* Quick Actions */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Add sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                <Box>
                  <Typography variant="h6" component="h2">
                    Teklif Ver
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Yeni müşteri teklifi oluşturun
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Müşteri bilgileri, rota detayları ve fiyatlandırma ile yeni teklif oluşturun.
                Teklifinizi müşteriye gönderin ve takip edin.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={handleCreateOffer}>
                Yeni Teklif Oluştur
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ListAlt sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                <Box>
                  <Typography variant="h6" component="h2">
                    Tekliflerim
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tüm tekliflerinizi görüntüleyin ve yönetin
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Gönderdiğiniz tüm teklifleri görüntüleyin, durumlarını takip edin ve gerekirse güncelleyin.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={handleViewOffers}>
                Tekliflerimi Görüntüle
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Offers */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
          Son Teklifler
        </Typography>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <CheckCircle sx={{ mr: 2, color: '#4caf50' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    #TK-2024-001 - İstanbul-Ankara
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Müşteri: ABC Şirketi
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Değer: ₺15,000 | Durum: Onaylandı
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Pending sx={{ mr: 2, color: '#ff9800' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    #TK-2024-002 - İzmir-Bursa
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Müşteri: XYZ Lojistik
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Değer: ₺22,500 | Durum: Beklemede
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Cancel sx={{ mr: 2, color: '#f44336' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    #TK-2024-003 - Ankara-İstanbul
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Müşteri: DEF Nakliyat
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Değer: ₺18,000 | Durum: Reddedildi
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <CheckCircle sx={{ mr: 2, color: '#4caf50' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    #TK-2024-004 - Bursa-İzmir
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Müşteri: GHI Transport
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Değer: ₺12,500 | Durum: Onaylandı
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Performance Chart Placeholder */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
          Performans Özeti
        </Typography>
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <TrendingUp sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Bu Ay Başarı Oranı: %53
          </Typography>
          <Typography variant="body2" color="text.secondary">
            15 tekliften 8'i onaylandı
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default SalesDashboard; 