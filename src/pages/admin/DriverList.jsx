import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { driversAPI } from '../../api/drivers';

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    licenseNo: '',
    licenseClass: 'CDL-A', // Default value
    passportExpiry: '',
    visaExpiry: '',
    residencePermitExpiry: '',
    phoneNumber: '',
    email: '',
    isActive: true,
  });

  // License class options
  const licenseClassOptions = [
    'CDL-A',
    'CDL-B',
    'CDL-C',
    'CDL-D',
    'CDL-E',
    'CDL-F',
    'Class A',
    'Class B',
    'Class C',
    'Class D',
    'Class E',
  ];

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await driversAPI.getAll();
      console.log('Drivers loaded successfully:', data);
      setDrivers(data);
    } catch (err) {
      console.error('Drivers yüklenirken hata:', err);
      console.error('Error details:', err.response?.data);
      setError('Sürücüler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (driver = null) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        firstName: driver.firstName || '',
        lastName: driver.lastName || '',
        licenseNo: driver.licenseNo || '',
        licenseClass: driver.licenseClass || '',
        passportExpiry: driver.passportExpiry ? driver.passportExpiry.split('T')[0] : '',
        visaExpiry: driver.visaExpiry ? driver.visaExpiry.split('T')[0] : '',
        residencePermitExpiry: driver.residencePermitExpiry
          ? driver.residencePermitExpiry.split('T')[0]
          : '',
        phoneNumber: driver.phoneNumber || '',
        email: driver.email || '',
        isActive: driver.isActive !== undefined ? driver.isActive : true,
      });
    } else {
      setEditingDriver(null);
      setFormData({
        firstName: '',
        lastName: '',
        licenseNo: '',
        licenseClass: '',
        passportExpiry: '',
        visaExpiry: '',
        residencePermitExpiry: '',
        phoneNumber: '',
        email: '',
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDriver(null);
    setFormData({
      firstName: '',
      lastName: '',
      licenseNo: '',
      licenseClass: '',
      passportExpiry: '',
      visaExpiry: '',
      residencePermitExpiry: '',
      phoneNumber: '',
      email: '',
      isActive: true,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Form validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.licenseNo ||
      !formData.licenseClass ||
      !formData.phoneNumber ||
      !formData.email
    ) {
      setSnackbar({
        open: true,
        message: 'Lütfen tüm zorunlu alanları doldurun!',
        severity: 'error',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSnackbar({ open: true, message: 'Geçerli bir e-posta adresi girin!', severity: 'error' });
      return;
    }

    // Show loading state
    setSnackbar({ open: true, message: 'Kaydediliyor...', severity: 'info' });

    try {
      console.log('Submitting driver data:', formData);

      if (editingDriver) {
        const result = await driversAPI.update(editingDriver.id, formData);
        console.log('Driver updated successfully:', result);
        setSnackbar({ open: true, message: 'Sürücü başarıyla güncellendi!', severity: 'success' });
      } else {
        const result = await driversAPI.create(formData);
        console.log('Driver created successfully:', result);
        setSnackbar({ open: true, message: 'Sürücü başarıyla oluşturuldu!', severity: 'success' });
      }
      handleCloseDialog();
      loadDrivers();
    } catch (err) {
      console.error('Sürücü kaydedilirken hata:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || 'Bir hata oluştu!';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDelete = async driverId => {
    if (window.confirm('Bu sürücüyü silmek istediğinizden emin misiniz?')) {
      try {
        await driversAPI.delete(driverId);
        setSnackbar({ open: true, message: 'Sürücü başarıyla silindi!', severity: 'success' });
        loadDrivers();
      } catch (err) {
        console.error('Sürücü silinirken hata:', err);
        setSnackbar({ open: true, message: 'Silme işlemi başarısız!', severity: 'error' });
      }
    }
  };

  // Test function to debug API calls
  const testAPICall = async () => {
    try {
      console.log('Testing API call...');
      const testData = {
        firstName: 'Test',
        lastName: 'Driver',
        licenseNo: 'TEST123',
        licenseClass: 'CDL-A',
        phoneNumber: '5551234567',
        email: 'test@example.com',
        isActive: true,
      };
      console.log('Test data:', testData);
      const result = await driversAPI.create(testData);
      console.log('Test API result:', result);
      setSnackbar({ open: true, message: 'Test API call successful!', severity: 'success' });
      loadDrivers();
    } catch (err) {
      console.error('Test API call failed:', err);
      setSnackbar({ open: true, message: `Test failed: ${err.message}`, severity: 'error' });
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch =
      (driver.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver.licenseNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver.phoneNumber || '').includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || driver.isActive === (statusFilter === 'active');

    return matchesSearch && matchesStatus;
  });

  const getExpiryStatus = expiryDate => {
    if (!expiryDate) return 'unknown';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'warning';
    return 'valid';
  };

  const getExpiryColor = status => {
    switch (status) {
      case 'expired':
        return 'error';
      case 'warning':
        return 'warning';
      case 'valid':
        return 'success';
      default:
        return 'default';
    }
  };

  const getExpiryLabel = status => {
    switch (status) {
      case 'expired':
        return 'Süresi Dolmuş';
      case 'warning':
        return 'Yakında Dolacak';
      case 'valid':
        return 'Geçerli';
      default:
        return 'Bilinmiyor';
    }
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2' }}>
        Sürücü Yönetimi
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Fleet ve Admin kullanıcıları için sürücü yönetim sistemi
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toplam Sürücü
              </Typography>
              <Typography variant="h4" component="div">
                {drivers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Aktif Sürücü
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {drivers.filter(d => d.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pasaport Süresi Dolan
              </Typography>
              <Typography variant="h4" component="div" color="error.main">
                {drivers.filter(d => getExpiryStatus(d.passportExpiry) === 'expired').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Vize Süresi Dolan
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {drivers.filter(d => getExpiryStatus(d.visaExpiry) === 'expired').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Sürücü Ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
              <InputLabel shrink>Durum Filtresi</InputLabel>
              <Select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                label="Durum Filtresi"
                notched
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="active">Aktif</MenuItem>
                <MenuItem value="inactive">Pasif</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              fullWidth
            >
              Yeni Sürücü
            </Button>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button variant="outlined" onClick={testAPICall} fullWidth size="small">
              Test API
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box display="flex" justifyContent="flex-end">
              <Tooltip title="Filtreleri Temizle">
                <IconButton
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Drivers Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>
                  <strong>Ad Soyad</strong>
                </TableCell>
                <TableCell>
                  <strong>Lisans No</strong>
                </TableCell>
                <TableCell>
                  <strong>Lisans Sınıfı</strong>
                </TableCell>
                <TableCell>
                  <strong>İletişim</strong>
                </TableCell>
                <TableCell>
                  <strong>Pasaport</strong>
                </TableCell>
                <TableCell>
                  <strong>Vize</strong>
                </TableCell>
                <TableCell>
                  <strong>İkamet</strong>
                </TableCell>
                <TableCell>
                  <strong>Durum</strong>
                </TableCell>
                <TableCell>
                  <strong>İşlemler</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDrivers.map(driver => (
                <TableRow key={driver.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {driver.firstName} {driver.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: #{driver.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{driver.licenseNo}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={driver.licenseClass}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <PhoneIcon sx={{ mr: 0.5, fontSize: 'small', color: 'text.secondary' }} />
                        <Typography variant="caption">{driver.phoneNumber}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ mr: 0.5, fontSize: 'small', color: 'text.secondary' }} />
                        <Typography variant="caption">{driver.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getExpiryLabel(getExpiryStatus(driver.passportExpiry))}
                      color={getExpiryColor(getExpiryStatus(driver.passportExpiry))}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getExpiryLabel(getExpiryStatus(driver.visaExpiry))}
                      color={getExpiryColor(getExpiryStatus(driver.visaExpiry))}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getExpiryLabel(getExpiryStatus(driver.residencePermitExpiry))}
                      color={getExpiryColor(getExpiryStatus(driver.residencePermitExpiry))}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={driver.isActive ? 'Aktif' : 'Pasif'}
                      color={driver.isActive ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Düzenle">
                        <IconButton size="small" onClick={() => handleOpenDialog(driver)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sil">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(driver.id)}
                        >
                          <DeleteIcon />
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

      {filteredDrivers.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Arama kriterlerinize uygun sürücü bulunamadı.
        </Alert>
      )}

      {/* Add/Edit Driver Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingDriver ? 'Sürücü Düzenle' : 'Yeni Sürücü Ekle'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ad"
                value={formData.firstName}
                onChange={e => handleInputChange('firstName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Soyad"
                value={formData.lastName}
                onChange={e => handleInputChange('lastName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lisans Numarası"
                value={formData.licenseNo}
                onChange={e => handleInputChange('licenseNo', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required size="small" sx={{ minWidth: 200 }}>
                <InputLabel shrink>Lisans Sınıfı *</InputLabel>
                <Select
                  value={formData.licenseClass}
                  onChange={e => handleInputChange('licenseClass', e.target.value)}
                  label="Lisans Sınıfı *"
                  error={!formData.licenseClass}
                  notched
                >
                  <MenuItem value="">
                    <em>Lisans sınıfı seçin</em>
                  </MenuItem>
                  {licenseClassOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {!formData.licenseClass && (
                  <FormHelperText error>Lisans sınıfı seçimi zorunludur</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pasaport Bitiş Tarihi"
                type="date"
                value={formData.passportExpiry}
                onChange={e => handleInputChange('passportExpiry', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vize Bitiş Tarihi"
                type="date"
                value={formData.visaExpiry}
                onChange={e => handleInputChange('visaExpiry', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="İkamet İzni Bitiş Tarihi"
                type="date"
                value={formData.residencePermitExpiry}
                onChange={e => handleInputChange('residencePermitExpiry', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefon Numarası"
                value={formData.phoneNumber}
                onChange={e => handleInputChange('phoneNumber', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="E-posta"
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>
            {editingDriver && (
              <Grid item xs={12}>
                <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                  <InputLabel shrink>Durum</InputLabel>
                  <Select
                    value={formData.isActive}
                    onChange={e => handleInputChange('isActive', e.target.value)}
                    label="Durum"
                    notched
                  >
                    <MenuItem value={true}>Aktif</MenuItem>
                    <MenuItem value={false}>Pasif</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingDriver ? 'Güncelle' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DriverList;
