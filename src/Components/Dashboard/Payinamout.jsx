import { Box, Grid, Paper, Typography, AppBar, Toolbar } from '@mui/material';
import CountUp from 'react-countup';

const Payinout = ({ orders }) => {
  const cardStyles = {
    p: 2,
    borderRadius: '12px',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  };

  return (
    <Box>
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
        <Toolbar disableGutters  sx={{
          p:0,
          fontSize:"14px",
          color:"#000",
          minHeight:"10px !important",
        }}>
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
            Order Overview
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Order Summary */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={cardStyles}>
            <Typography variant="subtitle2" sx={{ color: '#888', mb: 0.5 }}>
              TOTAL ORDERS
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {orders?.overall?.totalOrders || 0}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#444' }}>
              ₹ <CountUp end={orders?.overall?.totalAmount || 0} decimals={2} duration={2.5} />
            </Typography>
          </Paper>
        </Grid>

        {/* Order Status Heading */}
        <Grid item xs={12}>
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
            Order Status Overview
          </Typography>
        </Grid>

        {/* Order Status Cards */}
        {orders?.byStatus.map((item, index) => (
          <Grid key={index} item xs={12} md={3}>
            <Paper sx={cardStyles}>
              <Typography variant="subtitle2" sx={{ color: '#888', mb: 0.5 }}>
                {item._id?.toUpperCase()} ORDERS
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {item.totalOrders || 0}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: '#444' }}>
                ₹ <CountUp end={item.totalAmount || 0} decimals={2} duration={2.5} />
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Payment Status Heading */}
        <Grid item xs={12}>
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
            Payment Status Overview
          </Typography>
        </Grid>

        {/* Payment Status Cards */}
        {orders?.byPaymentStatus.map((item, index) => (
          <Grid key={index} item xs={12} md={3}>
            <Paper sx={cardStyles}>
              <Typography variant="subtitle2" sx={{ color: '#888', mb: 0.5 }}>
                {item._id?.toUpperCase()} PAYMENTS
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {item.totalOrders || 0}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: '#444' }}>
                ₹ <CountUp end={item.totalAmount || 0} decimals={2} duration={2.5} />
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Payinout;
