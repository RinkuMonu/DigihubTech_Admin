import React from 'react';
import { Box, Paper, Typography, Stack, Chip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const productivityData = [
  { month: 'Aug', focus: 65, lack: 35 },
  { month: 'Sep', focus: 45, lack: 55 },
  { month: 'Oct', focus: 72, lack: 28 },
  { month: 'Nov', focus: 58, lack: 42 },
];

const ProductivityAnalytics = () => {
  return (
    <Paper elevation={3} sx={{ borderRadius: 2, p:2, }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ color: '#681853'}}>Focusing</Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#681853'}}>Productivity analytics</Typography>
        </Box>
        <Chip
          label="Week 8"
          size="small"
          color="success"
          variant="outlined"
          sx={{ fontWeight: 'bold' }}
        />
      </Stack>

      <Typography variant="caption" fontWeight="bold" display="block" mb={3}>
        Unbalanced
      </Typography>

      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="caption" color="text.secondary">
          Range: Last month
        </Typography>
        <Stack direction="row" spacing={1}>
          <Typography variant="caption" color="success.main">
            Maximum of focus
          </Typography>
          <Typography variant="caption" color="text.secondary">
            |
          </Typography>
          <Typography variant="caption" color="error">
            Min or lack of focus
          </Typography>
        </Stack>
      </Stack>

      <Box sx={{ height: 226, mb: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'text.secondary' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'text.secondary' }}
              domain={[0, 100]}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="focus"
              stroke='#C1467F'
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="lack"
              stroke="#384D89"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ProductivityAnalytics;