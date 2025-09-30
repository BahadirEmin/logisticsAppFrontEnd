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
  ListItemIcon,
} from '@mui/material';
import {
  Add,
  ListAlt,
  TrendingUp,
  AttachMoney,
  CheckCircle,
  Pending,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { statisticsAPI, statisticsUtils } from '../../api/statistics';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    monthlyStats: {
      thisMonth: 0,
      lastMonth: 0,
      growth: 0,
    },
    totalStats: {
      totalOffers: 0,
      thisMonth: 0,
    },
    statusBreakdown: {
      approved: 0,
      pending: 0,
      rejected: 0,
    },
    financial: {
      totalValue: 0,
      monthlyValue: 0,
      successRate: 0,
    },
    needsOperatorAssignment: 0,
  });
  const [approvedOffersNeedingOperator, setApprovedOffersNeedingOperator] = useState([]);
  const [recentOffers, setRecentOffers] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Her API çağrısını ayrı ayrı yap ve hataları yakala
      let salesStats, offerPerformance, recentOffersData;

      try {
        salesStats = await statisticsAPI.getSalesDashboardStats();
      } catch (error) {
        console.error('❌ Sales Stats Error:', error);
        salesStats = { 
          totalStats: { totalOffers: 0, thisMonth: 0 },
          monthlyStats: { thisMonth: 0, lastMonth: 0, growth: 0 },
          statusBreakdown: { approved: 0, pending: 0, rejected: 0 },
          financial: { totalValue: 0, monthlyValue: 0, successRate: 0 },
          needsOperatorAssignment: 0
        };
      }

      try {
        offerPerformance = await statisticsAPI.getOfferPerformance();
      } catch (error) {
        console.error('❌ Offer Performance Error:', error);
        offerPerformance = { needsAction: { needsOperatorAssignment: [] } };
      }

      try {
        recentOffersData = await statisticsAPI.getRecentOffers();
      } catch (error) {
        console.error('❌ Recent Offers Error:', error);
        recentOffersData = { offers: [] };
      }

      setDashboardData(salesStats);
      setRecentOffers(recentOffersData.offers || []);
      
      // Operatör atanmamış teklifler için offer performance'dan veri al
      setApprovedOffersNeedingOperator(
        offerPerformance.needsAction?.needsOperatorAssignment || []
      );
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
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
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Add sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: 'bold', color: '#2196f3' }}
              >
                {dashboardData.totalStats?.totalOffers !== undefined ? dashboardData.totalStats.totalOffers : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Teklif
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Add sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: 'bold', color: '#1976d2' }}
              >
                {dashboardData.totalStats?.thisMonth !== undefined ? dashboardData.totalStats.thisMonth : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bu Ay Teklif
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: 'bold', color: '#4caf50' }}
              >
                {dashboardData.statusBreakdown.approved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Onaylanan
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Pending sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: 'bold', color: '#ff9800' }}
              >
                {dashboardData.statusBreakdown.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bekleyen
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: 'bold', color: '#9c27b0' }}
              >
                {statisticsUtils.formatLargeNumber(dashboardData.financial.totalValue)}
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
            {approvedOffersNeedingOperator.length} adet onaylanan teklif için operatör atanması
            gerekiyor.
          </Typography>

          <List dense sx={{ mt: 1 }}>
            {approvedOffersNeedingOperator.slice(0, 3).map(offer => (
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
                Gönderdiğiniz tüm teklifleri görüntüleyin, durumlarını takip edin ve gerekirse
                güncelleyin.
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

      {/* Son Teklifler */}
      {!loading && (
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
            Son Teklifler
          </Typography>
          <Paper elevation={2} sx={{ p: 3 }}>
            {recentOffers.length > 0 ? (
              <>
                <List>
                  {recentOffers.map((offer, index) => (
                <ListItem 
                  key={offer.id} 
                  divider={index !== recentOffers.length - 1}
                  sx={{ px: 0 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: offer.status === 'approved' ? '#4caf50' : 
                               offer.status === 'pending' ? '#ff9800' : '#f44336',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }}
                    >
                      #{offer.id}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {offer.customerName}
                        </Typography>
                        <Chip
                          label={offer.status === 'approved' ? 'Onaylandı' : 
                               offer.status === 'pending' ? 'Bekliyor' : 'Reddedildi'}
                          size="small"
                          color={offer.status === 'approved' ? 'success' : 
                               offer.status === 'pending' ? 'warning' : 'error'}
                          variant="outlined"
                        />
                        <Chip
                          label={`${offer.estimatedPrice ? statisticsUtils.formatCurrency(offer.estimatedPrice) : '0 TRY'}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {offer.departureCity} → {offer.arrivalCity}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {offer.createdAt ? statisticsUtils.formatRelativeTime(offer.createdAt) : 'Bilinmiyor'}
                        </Typography>
                      </Box>
                    }
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/sales/teklif-detay/${offer.id}`)}
                  >
                    Detay
                  </Button>
                </ListItem>
                ))}
            </List>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate('/sales/tekliflerim')}
              >
                Tüm Teklifleri Görüntüle
              </Button>
            </Box>
            </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Henüz teklif bulunmuyor
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/sales/teklif-ver')}
                >
                  İlk Teklifinizi Oluşturun
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      )}      {/* Performance Chart Placeholder */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
          Performans Özeti
        </Typography>
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <TrendingUp sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Bu Ay Başarı Oranı: %{Math.round(dashboardData.financial.successRate * 100)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dashboardData.totalStats?.thisMonth !== undefined ? dashboardData.totalStats.thisMonth : 0} tekliften {dashboardData.statusBreakdown?.approved || 0}'i onaylandı
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default SalesDashboard;
