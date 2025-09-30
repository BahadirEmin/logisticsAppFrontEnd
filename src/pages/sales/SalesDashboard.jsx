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
      
      // Recent offers'dan gerçek status breakdown hesapla
      const actualStatusBreakdown = {
        approved: 0,
        pending: 0,
        rejected: 0
      };
      
      (recentOffersData.offers || []).forEach(offer => {
        if (offer.status === 'approved') actualStatusBreakdown.approved++;
        else if (offer.status === 'pending') actualStatusBreakdown.pending++;
        else if (offer.status === 'rejected') actualStatusBreakdown.rejected++;
      });
      
      // Dashboard data'yı gerçek değerlerle güncelle
      setDashboardData(prev => ({
        ...prev,
        statusBreakdown: actualStatusBreakdown,
        financial: {
          ...prev.financial,
          successRate: actualStatusBreakdown.approved + actualStatusBreakdown.pending + actualStatusBreakdown.rejected > 0 
            ? actualStatusBreakdown.approved / (actualStatusBreakdown.approved + actualStatusBreakdown.pending + actualStatusBreakdown.rejected)
            : 0
        }
      }));
      
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
                          {offer.createdAt ? 
                            (() => {
                              try {
                                const date = new Date(offer.createdAt);
                                if (isNaN(date.getTime())) {
                                  return 'Tarih bilinmiyor';
                                }
                                return statisticsUtils.formatRelativeTime(offer.createdAt);
                              } catch (error) {
                                return 'Tarih bilinmiyor';
                              }
                            })() 
                            : 'Tarih bilinmiyor'
                          }
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
      )}      {/* Performance Analytics */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
          Performans Analytics
        </Typography>
        
        {/* Single Paper Container for All Charts */}
        <Paper elevation={2} sx={{ p: 4 }}>
          {/* Success Rate Chart - Full Width */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 4 }}>
              <TrendingUp color="primary" />
              Genel Başarı Oranı
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={220}
                  thickness={6}
                  sx={{ color: '#e0e0e0', position: 'absolute' }}
                />
                <CircularProgress
                  variant="determinate"
                  value={dashboardData.financial.successRate * 100}
                  size={220}
                  thickness={6}
                  sx={{ 
                    color: dashboardData.financial.successRate >= 0.7 ? '#4caf50' : 
                           dashboardData.financial.successRate >= 0.4 ? '#ff9800' : '#f44336',
                    transform: 'rotate(-90deg) !important'
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="h2" component="div" color="text.primary" fontWeight="bold">
                    %{Math.round(dashboardData.financial.successRate * 100)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Başarı Oranı
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {dashboardData.statusBreakdown.approved} onaylanan / {' '}
                {dashboardData.statusBreakdown.approved + dashboardData.statusBreakdown.pending + dashboardData.statusBreakdown.rejected} toplam teklif
              </Typography>
            </Box>
          </Box>

          {/* Other Charts in Single Row */}
          <Grid container spacing={4} sx={{ justifyContent: 'space-between' }}>
            {/* Status Breakdown - Left */}
            <Grid item xs={12} md={3.8}>
              <Box sx={{ height: '300px', textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1, mb: 3 }}>
                  <AssignmentIcon color="primary" />
                  Teklif Durumu Dağılımı
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  {/* Approved */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                        <Typography variant="body1">Onaylanan</Typography>
                      </Box>
                      <Typography variant="h6" color="#4caf50" fontWeight="bold">
                        {dashboardData.statusBreakdown.approved}
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: '#e8f5e8', borderRadius: 1, height: 12, overflow: 'hidden' }}>
                      <Box 
                        sx={{ 
                          bgcolor: '#4caf50', 
                          height: '100%', 
                          width: `${(dashboardData.statusBreakdown.approved / Math.max(1, dashboardData.statusBreakdown.approved + dashboardData.statusBreakdown.pending + dashboardData.statusBreakdown.rejected)) * 100}%`,
                          transition: 'width 0.5s ease-in-out'
                        }} 
                      />
                    </Box>
                  </Box>

                  {/* Pending */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Pending sx={{ color: '#ff9800', fontSize: 20 }} />
                        <Typography variant="body1">Bekleyen</Typography>
                      </Box>
                      <Typography variant="h6" color="#ff9800" fontWeight="bold">
                        {dashboardData.statusBreakdown.pending}
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: '#fff3e0', borderRadius: 1, height: 12, overflow: 'hidden' }}>
                      <Box 
                        sx={{ 
                          bgcolor: '#ff9800', 
                          height: '100%', 
                          width: `${(dashboardData.statusBreakdown.pending / Math.max(1, dashboardData.statusBreakdown.approved + dashboardData.statusBreakdown.pending + dashboardData.statusBreakdown.rejected)) * 100}%`,
                          transition: 'width 0.5s ease-in-out'
                        }} 
                      />
                    </Box>
                  </Box>

                  {/* Rejected */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningIcon sx={{ color: '#f44336', fontSize: 20 }} />
                        <Typography variant="body1">Reddedilen</Typography>
                      </Box>
                      <Typography variant="h6" color="#f44336" fontWeight="bold">
                        {dashboardData.statusBreakdown.rejected}
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: '#ffebee', borderRadius: 1, height: 12, overflow: 'hidden' }}>
                      <Box 
                        sx={{ 
                          bgcolor: '#f44336', 
                          height: '100%', 
                          width: `${(dashboardData.statusBreakdown.rejected / Math.max(1, dashboardData.statusBreakdown.approved + dashboardData.statusBreakdown.pending + dashboardData.statusBreakdown.rejected)) * 100}%`,
                          transition: 'width 0.5s ease-in-out'
                        }} 
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Financial Performance - Center */}
            <Grid item xs={12} md={3.8}>
              <Box sx={{ height: '300px', textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
                  <AttachMoney color="primary" />
                  Finansal Performans
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f3e5f5', borderRadius: 2, mb: 2 }}>
                      <Typography variant="h5" color="#9c27b0" fontWeight="bold">
                        {statisticsUtils.formatLargeNumber(dashboardData.financial.totalValue)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Toplam Değer (₺)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 2, mb: 2 }}>
                      <Typography variant="h5" color="#1976d2" fontWeight="bold">
                        {statisticsUtils.formatLargeNumber(dashboardData.financial.monthlyValue)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bu Ay (₺)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ortalama Teklif Değeri
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {dashboardData.totalStats?.totalOffers > 0 
                      ? statisticsUtils.formatCurrency(dashboardData.financial.totalValue / dashboardData.totalStats.totalOffers)
                      : '0 ₺'
                    }
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Quick Insights - Right */}
            <Grid item xs={12} md={3.8}>
              <Box sx={{ height: '300px', textAlign: 'right' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1, mb: 3 }}>
                  <TrendingUp color="primary" />
                  Hızlı İçgörüler
                </Typography>
                
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: dashboardData.financial.successRate >= 0.7 ? '#4caf50' : 
                                 dashboardData.financial.successRate >= 0.4 ? '#ff9800' : '#f44336'
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          Genel başarı oranınız{' '}
                          <strong>
                            {dashboardData.financial.successRate >= 0.7 ? 'mükemmel' : 
                             dashboardData.financial.successRate >= 0.4 ? 'orta' : 'geliştirilmeli'}
                          </strong>{' '}
                          seviyede
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: dashboardData.statusBreakdown.pending > 5 ? '#ff9800' : '#4caf50'
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          {dashboardData.statusBreakdown.pending > 5 
                            ? `${dashboardData.statusBreakdown.pending} bekleyen teklif takip edilmeli`
                            : 'Bekleyen teklifler kontrol altında'
                          }
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: approvedOffersNeedingOperator.length > 0 ? '#ff9800' : '#4caf50'
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          {approvedOffersNeedingOperator.length > 0 
                            ? `${approvedOffersNeedingOperator.length} teklif operatör ataması bekliyor`
                            : 'Tüm onaylanan teklifler operatör atanmış'
                          }
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#2196f3'
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          Bu ay {dashboardData.totalStats?.thisMonth || 0} yeni teklif oluşturdunuz
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default SalesDashboard;
