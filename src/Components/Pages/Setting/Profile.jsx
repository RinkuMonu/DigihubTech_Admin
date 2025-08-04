import { useState } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import EditProfile from './EditProfile';
import { useUser } from '../../../Context/UserContext';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();

  const userInitial = user ? user.firstName.charAt(0).toUpperCase() : '';

  if (isEditing) return <EditProfile />;
  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Grid container spacing={3} sx={{ paddingTop: '20px' }}>
      {/* Profile Card */}
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            alt={user.firstName}
            sx={{ width: 100, height: 100, mx: 'auto', bgcolor: '#C47CAA', color: '#fff', mb: 2 }}
          >
            {userInitial}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#384d89' }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" sx={{ textTransform: 'capitalize', mb: 2, color: 'gray' }}>
            {user.role}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        </Paper>
      </Grid>

      {/* Contact Info */}
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#384d89' }}>
            Contact Information
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor:"#fbe5ec" }}>Mobile</TableCell>
                  <TableCell sx={{backgroundColor:"#fbe5ec"}}>{user.mobile}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      {/* Other Info */}
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#384d89' }}>
            Other Details
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
                  <TableCell>{user.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor:"#fbe5ec" }}>Member Type</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize', backgroundColor:"#fbe5ec" }}>{user.role}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;
