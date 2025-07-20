import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward, ArrowBack } from '@mui/icons-material';

const steps = ['Rota ve Yük Bilgileri', 'Bilgileri Onayla', 'Teklif Gönder'];

const cargoTypes = [
  'Genel Kargo',
  'Soğuk Zincir',
  'Tehlikeli Madde',
  'Konteyner',
  'Proje Yükü',
  'Ağır Nakliye',
  'Ekspres Kargo',
  'Parça Eşya'
];

const OfferForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Route and Cargo Info
    fromLocation: '',
    toLocation: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    cargoType: '',
    weight: '',
    transferable: false,
    
    // Step 2: Additional Info (will be added)
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    specialRequirements: '',
    
    // Step 3: Pricing (will be added)
    estimatedPrice: '',
    currency: 'TRY'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'transferable' ? checked : value
      }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.fromLocation.trim()) {
      newErrors.fromLocation = 'Nereden alanı zorunludur';
    }
    if (!formData.toLocation.trim()) {
      newErrors.toLocation = 'Nereye alanı zorunludur';
    }
    if (!formData.dimensions.length || !formData.dimensions.width || !formData.dimensions.height) {
      newErrors.dimensions = 'Tüm ölçü alanları zorunludur';
    }
    if (!formData.cargoType) {
      newErrors.cargoType = 'Yük tipi seçimi zorunludur';
    }
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Geçerli bir ağırlık giriniz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateStep1()) {
      return;
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Mock API call
      console.log('Teklif gönderiliyor:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to offers list
      navigate('/sales/tekliflerim');
    } catch (error) {
      console.error('Teklif gönderme hatası:', error);
    }
  };

  const renderStep1 = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
        Rota ve Yük Bilgileri
      </Typography>
      
      {/* Route Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#1976d2' }}>
          Rota Bilgileri
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nereden"
              name="fromLocation"
              value={formData.fromLocation}
              onChange={handleInputChange}
              error={!!errors.fromLocation}
              helperText={errors.fromLocation}
              placeholder="Örn: İstanbul"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nereye"
              name="toLocation"
              value={formData.toLocation}
              onChange={handleInputChange}
              error={!!errors.toLocation}
              helperText={errors.toLocation}
              placeholder="Örn: Ankara"
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* Dimensions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#1976d2' }}>
          Yük Ölçüleri
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Uzunluk (cm)"
              name="dimensions.length"
              type="number"
              value={formData.dimensions.length}
              onChange={handleInputChange}
              error={!!errors.dimensions}
              helperText={errors.dimensions}
              placeholder="0"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Genişlik (cm)"
              name="dimensions.width"
              type="number"
              value={formData.dimensions.width}
              onChange={handleInputChange}
              error={!!errors.dimensions}
              placeholder="0"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Yükseklik (cm)"
              name="dimensions.height"
              type="number"
              value={formData.dimensions.height}
              onChange={handleInputChange}
              error={!!errors.dimensions}
              placeholder="0"
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* Cargo Details */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#1976d2' }}>
          Yük Detayları
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.cargoType}>
              <InputLabel>Yük Tipi</InputLabel>
              <Select
                name="cargoType"
                value={formData.cargoType}
                onChange={handleInputChange}
                label="Yük Tipi"
              >
                {cargoTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.cargoType && (
                <Typography variant="caption" color="error">
                  {errors.cargoType}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ağırlık (kg)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleInputChange}
              error={!!errors.weight}
              helperText={errors.weight}
              placeholder="0"
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* Transfer Option */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#1976d2' }}>
          Aktarma Seçenekleri
        </Typography>
        <FormControlLabel
          control={
            <Switch
              name="transferable"
              checked={formData.transferable}
              onChange={handleInputChange}
              color="primary"
            />
          }
          label="Aktarma Yapılabilir mi?"
        />
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
          Yük aktarma noktalarında başka araçlara aktarılabilir mi?
        </Typography>
      </Box>
    </Box>
  );

  const renderStep2 = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Bilgileri Onayla
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Rota Bilgileri
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Nereden:</Typography>
            <Typography variant="body1">{formData.fromLocation}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Nereye:</Typography>
            <Typography variant="body1">{formData.toLocation}</Typography>
          </Grid>
        </Grid>
        
        <Typography variant="h6" gutterBottom color="primary">
          Yük Bilgileri
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Ölçüler:</Typography>
            <Typography variant="body1">
              {formData.dimensions.length} x {formData.dimensions.width} x {formData.dimensions.height} cm
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Ağırlık:</Typography>
            <Typography variant="body1">{formData.weight} kg</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Yük Tipi:</Typography>
            <Typography variant="body1">{formData.cargoType}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Aktarma:</Typography>
            <Typography variant="body1">
              {formData.transferable ? 'Evet' : 'Hayır'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Bilgileri kontrol edin. Bir sonraki adımda teklif gönderilecektir.
      </Alert>
    </Box>
  );

  const renderStep3 = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Teklif Gönder
      </Typography>
      
      <Alert severity="success" sx={{ mb: 3 }}>
        Teklifiniz başarıyla oluşturuldu! Şimdi operasyon ekibine gönderiliyor.
      </Alert>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Teklif detayları operasyon ekibine iletildi. En kısa sürede size dönüş yapılacaktır.
        </Typography>
      </Paper>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, ml: 0 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2', mb: 4 }}>
          Yeni Teklif Oluştur
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 4, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
          >
            Geri
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                endIcon={<ArrowForward />}
              >
                Teklifi Gönder
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
              >
                İleri
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default OfferForm; 