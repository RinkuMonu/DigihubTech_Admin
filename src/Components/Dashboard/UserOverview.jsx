import {
  Box,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  Chip,
} from '@mui/material';
import CountUp from 'react-countup';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

import { useUser } from '../../Context/UserContext';

// Mock icon map, expand this if needed for other types
const iconMap = {
  Orders: <ShoppingBagIcon sx={{ fontSize: 16 }} />,
};

const UserOverview = ({ users }) => {
  const { user } = useUser();

  const cardStyles = {
    borderRadius: '0.5rem',
    backgroundColor: '#ffffff',
    boxShadow: 'rgba(143, 155, 166, 0.08) 0px 12px 24px -4px',
    position: 'relative',
    marginBottom: '1.5rem',
    width: '100%',
    padding: 2,
    textAlign: 'left',
    color: '#000',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  };

  const titleStyles = {
    textTransform: 'uppercase',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#2a4172',
  };

  const valueStyles = {
    fontWeight: '700',
    color: '#2a4172',
    fontSize: '1.75rem',
  };

  const totalUsers = users?.reduce((sum, user) => sum + (user.totalUsers || 0), 0);

  return (
    <Box sx={{ flexGrow: 1, mt: 0 }}>
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          borderRadius: '12px',
          background: 'transparent',
          boxShadow: 'none',
          mb: 3,
          p: 0,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            p: 0,
            fontSize: '14px',
            color: '#000',
            minHeight: '10px !important',
          }}
        >
          <Typography variant="h6"  sx={{
              flexGrow: 1,
              color: '#2a4172',
              fontWeight: '700',
              p: 0,
              color: "#000",
              mb: 0,
              fontSize: "16px",
              fontWeight:"500"
            }}>
            User Overview
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Total Users Summary (for super-admin only) */}
      {user?.role === 'super-admin' && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={cardStyles}>
              <Typography sx={titleStyles}>Total Users</Typography>
              <Typography sx={valueStyles}>
                <CountUp end={totalUsers || 0} duration={2} />
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Users by Reference Website */}
      <Grid container spacing={3}>
        {users?.map((userItem, index) => {
          // Mock trend logic for now (you can replace this)
          const trend = {
            direction: userItem.totalUsers % 2 === 0 ? 'up' : 'down',
            percent: userItem.totalUsers % 2 === 0 ? 12.5 : -7.8,
            icon:
              userItem.totalUsers % 2 === 0 ? (
                <TrendingUpIcon sx={{ fontSize: 16 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16 }} />
              ),
          };

          return (
            <Grid key={index} item xs={12} md={4} lg={3}>
              <Paper sx={cardStyles}>
              <Box sx={{display:"flex", justifyContent:"space-between"}}>
                <Avatar
                  sx={{
                    bgcolor: '#f1f3ff',
                    color: '#4f46e5',
                    width: 32,
                    height: 32,
                    mb: 1,
                  }}
                >
                  {iconMap.Orders}
                </Avatar>
                <Chip
                  icon={trend.icon}
                  label={`${trend.percent}%`}
                  size="small"
                  sx={{
                    backgroundColor: trend.direction === 'up' ? '#e8f5e9' : '#ffebee',
                    color: trend.direction === 'up' ? '#388e3c' : '#d32f2f',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    px: 1,
                  }}
                />
               </Box>
               <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 500, color: '#666' }}
                    >
               Total Users: </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                  <CountUp  end={userItem.totalUsers || 0} duration={1.5} />
                </Typography>
                
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default UserOverview;
