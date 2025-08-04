import Payinout from './Payinamout';
import { useUser } from '../../Context/UserContext';
import { apiGet } from '../../api/apiMethods';
import { useEffect, useState } from 'react';
import ProductOverview from './ProductOverview';
import UserOverview from './UserOverview';
import Linegraph from './Linegraph';
import Chancechart from './Chancechart';
import { Box, Grid, Typography } from '@mui/material';
import CountUp from 'react-countup'; import {
  Chip,
  Avatar,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';


import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const iconMap = {
  Orders: <ShoppingBagIcon sx={{ fontSize: 16 }} />,
};
function Dashboard() {
  const icon = iconMap["Orders"];
  const { user } = useUser();
  const [data, setData] = useState();

  const API_ENDPOINT = `api/dashboard`;

  const fetchData = async () => {
    try {
      const response = await apiGet(API_ENDPOINT);
      if (response.status === 200) {
        setData(response.data?.data);
      }
    } catch (error) {
      console.error(error.message);
      setData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate total products
  const totalProducts = data?.productStats?.reduce(
    (sum, product) => sum + (product.totalProducts || 0),
    0
  );
  const getRandomTrend = () => {
    const trends = ['up', 'down'];
    const randomTrend = trends[Math.floor(Math.random() * trends.length)];
    const randomPercent = (Math.random() * 10).toFixed(2);
    return {
      direction: randomTrend,
      percent: randomPercent,
      icon:
        randomTrend === 'up' ? (
          <TrendingUpIcon fontSize="small" />
        ) : (
          <TrendingDownIcon fontSize="small" />
        ),
    };
  };
  const trend = getRandomTrend();
  return (
    <div style={{ padding: '10px' }}>
      {/* Total Products Summary Card */}
      <Box
        sx={{
          padding: 2,
          border: 0,
          borderRadius: '0.5rem',
          // backgroundColor: '#f1f8fe',
          boxShadow: 'rgba(143, 155, 166, 0.08) 0px 12px 24px -4px',
          position: 'relative',
          width: 'fit-content',
          textAlign: 'left',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          color: '#000',
          display: 'flex',
          justifyContent: 'space-between',
          // alignItems: 'center',
          gap: 2
        }}
      >
        <Avatar
          sx={{
            bgcolor: '#f1f3ff',
            color: '#4f46e5',
            width: 32,
            height: 32,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '' }}>
            Total Products
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            <CountUp end={totalProducts || 0} duration={2} />
          </Typography>
        </Box>
        <Chip
          icon={trend.icon}
          label={`${trend.percent}%`}
          size="small"
          sx={{
            backgroundColor: trend.direction === 'up' ? '#e8f5e9' : '#ffebee',
            color: trend.direction === 'up' ? '#388e3c' : '#d32f2f',
            fontWeight: 'bold',
            fontSize:"12px",
            p:1,
          }}
        />
      </Box>



      {/* Product Overview Section */}
      <Box sx={{
        padding: 1,
        borderRadius: 2,
        boxShadow: 'none',
        marginTop: 0
      }}>
        <ProductOverview products={data?.productStats} />
      </Box>

      {/* User Overview Section */}
      <Box sx={{
        padding: 2,
        borderRadius: 2,
        boxShadow: 'none',
        marginTop: 2
      }}>
        <UserOverview users={data?.userStats} />
      </Box>

      {/* Charts Section (Linegraph and Chancechart) */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{
            padding: 2,
            borderRadius: 2,
            boxShadow: 'none',
            height: '100%'
          }}>
            <Linegraph />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{
            padding: 2,
            borderRadius: 2,
            boxShadow: 'none',
            height: '100%'
          }}>
            <Chancechart />
          </Box>
        </Grid>
      </Grid>

      {/* Payinout Section */}
      <Box sx={{
        padding: 2,
        borderRadius: 2,
        boxShadow: 'none',
        marginTop: 2
      }}>
        <Payinout orders={data?.orders} />
      </Box>
    </div>
  );
}

export default Dashboard;
