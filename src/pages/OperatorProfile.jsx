import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { Person, Save, Edit } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const OperatorProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || 'Operasyon',
    position: user?.position || 'Operatör'
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Here you would typically make an API call to update the user profile
      // For now, we'll just update the local state
      updateUser({ ...user, ...formData });
      setEditing(false);
      setMessage('Profil başarıyla güncellendi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Profil güncellenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: '#1976d2' }}>
            <Person sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Hesabım
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Operatör Profil Bilgileri
            </Typography>
          </Box>
        </Box>

        {message && (
          <Alert severity={message.includes('hata') ? 'error' : 'success'} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ad"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!editing}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Soyad"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!editing}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="E-posta"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editing}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefon"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!editing}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Departman"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              disabled={!editing}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pozisyon"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              disabled={!editing}
              size="small"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {editing ? (
            <>
              <Button
                variant="outlined"
                onClick={() => setEditing(false)}
                disabled={loading}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => setEditing(true)}
              startIcon={<Edit />}
            >
              Düzenle
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default OperatorProfile; 