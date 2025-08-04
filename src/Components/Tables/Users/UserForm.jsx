import { useEffect, useState } from 'react';
import {
  Dialog,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Stack,
} from '@mui/material';
import { EditNoteOutlined } from '@mui/icons-material';
import { apiPut } from '../../../api/apiMethods';

const UserRoleForm = ({ userId, currentRole, userDetails, onRoleChange }) => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(currentRole || 'user');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    setRole(currentRole || 'user');
  }, [currentRole]);

  const handleSubmit = async () => {
    try {
      const response = await apiPut(`api/auth/updateRole/${userId}`, { role });
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: 'User role updated successfully',
          severity: 'success',
        });
        setOpen(false);
        onRoleChange();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update user role',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} color="primary">
        <EditNoteOutlined />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 600 }}>Update User Role</DialogTitle>

        <DialogContent dividers>
          {/* User Info Card */}
          <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {userDetails.firstName[0]}
                  {userDetails.lastName[0]}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {userDetails.firstName} {userDetails.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userDetails.email}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Role Dropdown */}
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel id="role-label">Select Role</InputLabel>
            <Select
              labelId="role-label"
              label="Select Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              {['user', 'admin', 'vendor'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}  color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit}  color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserRoleForm;
