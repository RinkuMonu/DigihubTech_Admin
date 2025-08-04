import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: '5', value: 1200 },
  { name: '10', value: 1900 },
  { name: '20', value: 1500 },
  { name: '30', value: 2100 },
  { name: '40', value: 1800 },
  { name: '50', value: 2400 },
  { name: '60', value: 1600 },
];

const SubscriberChart = () => {
  return (
    <Paper elevation={3} sx={{ borderRadius: 2, p: 3 }}>
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="600" color="#681853">
          Total Subscribers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Weekly
        </Typography>
      </Grid>

      {/* Numbers Block */}
      <Stack direction="row" spacing={3} alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight="bold" mt={0} color="#681853">
          24,473
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" color="#681853">
          <Typography variant="body2" fontWeight="bold">
            8.3%
          </Typography>
          <Typography variant="body2">749 increased</Typography>
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Last Week: 3,874
      </Typography>

      {/* Chart */}
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#999' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#999' }}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#DD82A8" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default SubscriberChart;
