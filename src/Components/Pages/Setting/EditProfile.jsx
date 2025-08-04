import { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Alert,
  Box,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import { Email, Phone, LocationOn, Person } from '@mui/icons-material';
import Profile from './Profile';
import { apiPost } from '../../../api/apiMethods';
import { useUser } from '../../../Context/UserContext';

const EditProfile = () => {
  const { user, initializeUser } = useUser();
  const [formData, setFormData] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        mobile: user.mobile || '',
        email: user.email || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiPost('api/auth/update', formData);
      if (response.status === 200) {
        setAlertMessage('✅ Profile updated successfully!');
        setAlertType('success');
        initializeUser();
        setTimeout(() => setShowEditProfile(true), 1000);
      } else {
        setAlertMessage('❌ Failed to update profile.');
        setAlertType('error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlertMessage('An unexpected error occurred.');
      setAlertType('error');
    }
  };

  if (showEditProfile) return <Profile />;
  if (!user) return <Typography>Loading user...</Typography>;

  const initials =
    user.firstName?.[0]?.toUpperCase() + user.lastName?.[0]?.toUpperCase();

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#384d89', mb: 3 }}>
        Edit Your Profile
      </Typography>

      {alertMessage && (
        <Alert severity={alertType} sx={{ mb: 3 }}>
          {alertMessage}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Panel */}
        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: '#7B6ED6',
                fontSize: 36,
                mx: 'auto',
              }}
            >
              {initials}
            </Avatar>
            <Typography variant="h6" mt={2}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {user.role?.toUpperCase()}
            </Typography>
          </Box>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} md={8}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1 }} fontSize="small" />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1 }} fontSize="small" />,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1 }} fontSize="small" />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1 }} fontSize="small" />,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1 }} fontSize="small" />,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                {/* <Divider sx={{ my: 2 }} /> */}
                <Box textAlign="right">
                  <Button color="primary" type="submit">
                     Save Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EditProfile;
