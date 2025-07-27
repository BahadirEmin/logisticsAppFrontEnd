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
  Alert,
  Divider
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

const countries = [
  'Türkiye',
  'Almanya',
  'Fransa',
  'İtalya',
  'Hollanda',
  'Belçika',
  'Avusturya',
  'İsviçre',
  'Polonya',
  'Çek Cumhuriyeti',
  'Macaristan',
  'Slovakya',
  'Slovenya',
  'Hırvatistan',
  'Sırbistan',
  'Bulgaristan',
  'Romanya',
  'Yunanistan',
  'Makedonya',
  'Arnavutluk',
  'Kosova',
  'Bosna Hersek',
  'Karadağ',
  'Diğer'
];

const OfferForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Route and Cargo Info
    fromAddress: {
      country: '',
      city: '',
      district: '',
      address: '',
      zipCode: '',
      contactPerson: '',
      phone: '',
      email: ''
    },
    toAddress: {
      country: '',
      city: '',
      district: '',
      address: '',
      zipCode: '',
      contactPerson: '',
      phone: '',
      email: ''
    },
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
    
    // Validate from address
    if (!formData.fromAddress.country.trim()) {
      newErrors['fromAddress.country'] = 'Ülke seçimi zorunludur';
    }
    if (!formData.fromAddress.city.trim()) {
      newErrors['fromAddress.city'] = 'Şehir alanı zorunludur';
    }
    if (!formData.fromAddress.address.trim()) {
      newErrors['fromAddress.address'] = 'Adres alanı zorunludur';
    }
    if (!formData.fromAddress.contactPerson.trim()) {
      newErrors['fromAddress.contactPerson'] = 'İletişim kişisi zorunludur';
    }
    if (!formData.fromAddress.phone.trim()) {
      newErrors['fromAddress.phone'] = 'Telefon alanı zorunludur';
    }
    
    // Validate to address
    if (!formData.toAddress.country.trim()) {
      newErrors['toAddress.country'] = 'Ülke seçimi zorunludur';
    }
    if (!formData.toAddress.city.trim()) {
      newErrors['toAddress.city'] = 'Şehir alanı zorunludur';
    }
    if (!formData.toAddress.address.trim()) {
      newErrors['toAddress.address'] = 'Adres alanı zorunludur';
    }
    if (!formData.toAddress.contactPerson.trim()) {
      newErrors['toAddress.contactPerson'] = 'İletişim kişisi zorunludur';
    }
    if (!formData.toAddress.phone.trim()) {
      newErrors['toAddress.phone'] = 'Telefon alanı zorunludur';
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
      
      {/* From Address */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#1976d2' }}>
          Nereden (Alış Adresi)
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth error={!!errors['fromAddress.country']} size="small">
              <InputLabel>Ülke</InputLabel>
              <Select
                name="fromAddress.country"
                value={formData.fromAddress.country}
                onChange={handleInputChange}
                label="Ülke"
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
              {errors['fromAddress.country'] && (
                <Typography variant="caption" color="error">
                  {errors['fromAddress.country']}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Şehir"
              name="fromAddress.city"
              value={formData.fromAddress.city}
              onChange={handleInputChange}
              error={!!errors['fromAddress.city']}
              helperText={errors['fromAddress.city']}
              placeholder="İstanbul"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="İlçe"
              name="fromAddress.district"
              value={formData.fromAddress.district}
              onChange={handleInputChange}
              placeholder="Kadıköy"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Posta Kodu"
              name="fromAddress.zipCode"
              value={formData.fromAddress.zipCode}
              onChange={handleInputChange}
              placeholder="34700"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Açık Adres"
              name="fromAddress.address"
              value={formData.fromAddress.address}
              onChange={handleInputChange}
              error={!!errors['fromAddress.address']}
              helperText={errors['fromAddress.address']}
              placeholder="Sokak, mahalle, bina no, kat, daire no"
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="İletişim Kişisi"
              name="fromAddress.contactPerson"
              value={formData.fromAddress.contactPerson}
              onChange={handleInputChange}
              error={!!errors['fromAddress.contactPerson']}
              helperText={errors['fromAddress.contactPerson']}
              placeholder="Ahmet Yılmaz"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Telefon"
              name="fromAddress.phone"
              value={formData.fromAddress.phone}
              onChange={handleInputChange}
              error={!!errors['fromAddress.phone']}
              helperText={errors['fromAddress.phone']}
              placeholder="+90 555 123 45 67"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="E-posta"
              name="fromAddress.email"
              type="email"
              value={formData.fromAddress.email}
              onChange={handleInputChange}
              placeholder="ornek@email.com"
            />
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      {/* To Address */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#1976d2' }}>
          Nereye (Teslimat Adresi)
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth error={!!errors['toAddress.country']} size="small">
              <InputLabel>Ülke</InputLabel>
              <Select
                name="toAddress.country"
                value={formData.toAddress.country}
                onChange={handleInputChange}
                label="Ülke"
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
              {errors['toAddress.country'] && (
                <Typography variant="caption" color="error">
                  {errors['toAddress.country']}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Şehir"
              name="toAddress.city"
              value={formData.toAddress.city}
              onChange={handleInputChange}
              error={!!errors['toAddress.city']}
              helperText={errors['toAddress.city']}
              placeholder="Ankara"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="İlçe"
              name="toAddress.district"
              value={formData.toAddress.district}
              onChange={handleInputChange}
              placeholder="Çankaya"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Posta Kodu"
              name="toAddress.zipCode"
              value={formData.toAddress.zipCode}
              onChange={handleInputChange}
              placeholder="06690"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Açık Adres"
              name="toAddress.address"
              value={formData.toAddress.address}
              onChange={handleInputChange}
              error={!!errors['toAddress.address']}
              helperText={errors['toAddress.address']}
              placeholder="Sokak, mahalle, bina no, kat, daire no"
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="İletişim Kişisi"
              name="toAddress.contactPerson"
              value={formData.toAddress.contactPerson}
              onChange={handleInputChange}
              error={!!errors['toAddress.contactPerson']}
              helperText={errors['toAddress.contactPerson']}
              placeholder="Mehmet Demir"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Telefon"
              name="toAddress.phone"
              value={formData.toAddress.phone}
              onChange={handleInputChange}
              error={!!errors['toAddress.phone']}
              helperText={errors['toAddress.phone']}
              placeholder="+90 555 987 65 43"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="E-posta"
              name="toAddress.email"
              type="email"
              value={formData.toAddress.email}
              onChange={handleInputChange}
              placeholder="ornek@email.com"
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* Dimensions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#1976d2' }}>
          Yük Ölçüleri
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
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
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Genişlik (cm)"
              name="dimensions.width"
              type="number"
              value={formData.dimensions.width}
              onChange={handleInputChange}
              error={!!errors.dimensions}
              placeholder="0"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth error={!!errors.cargoType} size="small">
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
          
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              size="small"
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
          Alış Adresi (Nereden)
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Ülke:</Typography>
            <Typography variant="body1">{formData.fromAddress.country}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Şehir:</Typography>
            <Typography variant="body1">{formData.fromAddress.city}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">İlçe:</Typography>
            <Typography variant="body1">{formData.fromAddress.district || '-'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Posta Kodu:</Typography>
            <Typography variant="body1">{formData.fromAddress.zipCode || '-'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Açık Adres:</Typography>
            <Typography variant="body1">{formData.fromAddress.address}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">İletişim Kişisi:</Typography>
            <Typography variant="body1">{formData.fromAddress.contactPerson}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Telefon:</Typography>
            <Typography variant="body1">{formData.fromAddress.phone}</Typography>
          </Grid>
          {formData.fromAddress.email && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">E-posta:</Typography>
              <Typography variant="body1">{formData.fromAddress.email}</Typography>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom color="primary">
          Teslimat Adresi (Nereye)
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Ülke:</Typography>
            <Typography variant="body1">{formData.toAddress.country}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Şehir:</Typography>
            <Typography variant="body1">{formData.toAddress.city}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">İlçe:</Typography>
            <Typography variant="body1">{formData.toAddress.district || '-'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Posta Kodu:</Typography>
            <Typography variant="body1">{formData.toAddress.zipCode || '-'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Açık Adres:</Typography>
            <Typography variant="body1">{formData.toAddress.address}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">İletişim Kişisi:</Typography>
            <Typography variant="body1">{formData.toAddress.contactPerson}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Telefon:</Typography>
            <Typography variant="body1">{formData.toAddress.phone}</Typography>
          </Grid>
          {formData.toAddress.email && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">E-posta:</Typography>
              <Typography variant="body1">{formData.toAddress.email}</Typography>
            </Grid>
          )}
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