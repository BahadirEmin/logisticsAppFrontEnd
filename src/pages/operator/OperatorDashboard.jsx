import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, CardActions, Button, CircularProgress } from '@mui/material';
import { 
  Timeline, 
  CheckCircle, 
  AccountCircle, 
  TrendingUp,
  LocalShipping,
  Person,
  Assignment
} from '@mui/icons-material';
import { vehicleAPI } from '../../api/vehicles';
import { driversAPI } from '../../api/drivers';
import { ordersAPI } from '../../api/orders';

const OperatorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    activeTrips: 0,
    approvedOffers: 0,
    activeVehicles: 0,
    activeDrivers: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Paralel olarak tüm verileri çek
      const [vehicles, drivers, orders] = await Promise.all([
        vehicleAPI.getAll(),
        driversAPI.getAll(),
        ordersAPI.getAll()
      ]);

      // İstatistikleri hesapla
      const activeTrips = orders.filter(o => 
        o.tripStatus === 'YOLA_CIKTI' || o.tripStatus === 'GUMRUKTE'
      ).length;
      
      const approvedOffers = orders.filter(o => 
        o.tripStatus === 'ONAYLANDI'
      ).length;
      
      const activeVehicles = vehicles.filter(v => v.isActive).length;
      const activeDrivers = drivers.filter(d => d.isActive).length;

      setDashboardData({
        activeTrips,
        approvedOffers,
        activeVehicles,
        activeDrivers
      });
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, ml: 0 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2' }}>
          Operasyoncu Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Operasyon yönetimi ve takip sistemi
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
              <Timeline sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {dashboardData.activeTrips}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aktif Seferler
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
                Onaylanan Teklifler
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <LocalShipping sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {dashboardData.activeVehicles}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aktif Araçlar
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Person sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                {dashboardData.activeDrivers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aktif Sürücüler
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Quick Actions */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountCircle sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                <Box>
                  <Typography variant="h6" component="h2">
                    Hesabım
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Profil bilgilerinizi görüntüleyin ve güncelleyin
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Kişisel bilgilerinizi, iletişim detaylarınızı ve hesap ayarlarınızı yönetin.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Hesabıma Git
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                <Box>
                  <Typography variant="h6" component="h2">
                    Onaylanan Teklifler
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Onaylanan teklifleri görüntüleyin ve takip edin
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Satış ekibinden gelen onaylanan teklifleri inceleyin ve operasyon planlaması yapın.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Teklifleri Görüntüle
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />
                <Box>
                  <Typography variant="h6" component="h2">
                    Sefer Takip Ekranı
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aktif seferleri gerçek zamanlı olarak takip edin
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tüm aktif seferlerin durumunu, konumunu ve ilerlemesini gerçek zamanlı olarak izleyin.
                Sürücü iletişimi ve rota optimizasyonu için gerekli araçları kullanın.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Seferleri Takip Et
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
          Son Aktiviteler
        </Typography>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Assignment sx={{ mr: 2, color: '#1976d2' }} />
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Yeni sefer atandı - İstanbul-Ankara
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2 saat önce
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <CheckCircle sx={{ mr: 2, color: '#4caf50' }} />
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Teklif onaylandı - #TK-2024-001
              </Typography>
              <Typography variant="body2" color="text.secondary">
                4 saat önce
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <TrendingUp sx={{ mr: 2, color: '#ff9800' }} />
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Sefer tamamlandı - İzmir-Bursa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                6 saat önce
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default OperatorDashboard; 