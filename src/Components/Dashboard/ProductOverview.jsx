import {
  Box,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Chip,
  Avatar,
} from '@mui/material';
import CountUp from 'react-countup';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';

const iconMap = {
  Orders: <ShoppingBagIcon sx={{ fontSize: 16 }} />,
  Earnings: <AttachMoneyIcon sx={{ fontSize: 16 }} />,
  Sold: <InventoryIcon sx={{ fontSize: 16 }} />,
  Profit: <PersonIcon sx={{ fontSize: 16 }} />,
};

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

const ProductOverview = ({ products }) => {
  const cardStyles = {
    padding: 2,
    border: 0,
    borderRadius: '0.5rem',
    backgroundColor: '#f1f8fe',
    boxShadow: 'rgba(143, 155, 166, 0.08) 0px 12px 24px -4px',
    position: 'relative',
    width: '100%',
    textAlign: 'left',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
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
            Product Overview
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3}>
        {products &&
          products.map((product, index) => {
            const trend = getRandomTrend();
            const key = product.category.split(' ')[1];
            const icon = iconMap[key] || <InventoryIcon sx={{ fontSize: 16 }} />;

            return (
              <Grid key={index} item xs={12} md={6} lg={3}>
                <Paper
                  sx={{
                    padding: 2,
                    border: 0,
                    borderRadius: '0.5rem',
                    backgroundColor: '#f1f8fe',
                    boxShadow: 'rgba(143, 155, 166, 0.08) 0px 12px 24px -4px',
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    textAlign: 'left',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    color: '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Top Section: Icon + Chip */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

                    <Chip
                      icon={trend.icon}
                      label={`${trend.percent}%`}
                      size="small"
                      sx={{
                        backgroundColor: trend.direction === 'up' ? '#e8f5e9' : '#ffebee',
                        color: trend.direction === 'up' ? '#388e3c' : '#d32f2f',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>

                  {/* Bottom Content */}
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 500, color: '#666' }}
                    >
                      {product.category}
                    </Typography>
                    
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                      <CountUp end={product.totalProducts || 0} duration={2} separator="," />
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
};

export default ProductOverview;
