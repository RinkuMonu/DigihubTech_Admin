import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Snackbar,
  SnackbarContent,
  Paper,
  IconButton,
} from '@mui/material';
import { EditNoteOutlined } from '@mui/icons-material';
import { apiPut } from '../../../api/apiMethods';

const OrderForm = ({ order,dataHandler }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleStatusChange = async () => {
    try {
      const updatedOrder = {
        ...order,
        status,
        paymentStatus,
      };
      const response = await apiPut(`/api/order/orders/${order._id}/status`, updatedOrder);
      if (response) {
        setSnackbarMessage('Order updated successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        dataHandler();
        handleClose();
      }
    } catch (error) {
      setSnackbarMessage('Failed to update order');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      {/* Button to open dialog */}
        <IconButton onClick={handleOpen}>
          <EditNoteOutlined/>
        </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.products.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item?.product?.productName}</TableCell>
                    <TableCell>{item?.product?.price}</TableCell>
                    <TableCell>{item?.quantity}</TableCell>
                    <TableCell>{item?.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ marginTop: 20 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {["pending", "processing", "shipped", "delivered", "cancelled"].map((statusOption) => (
                  <MenuItem key={statusOption} value={statusOption}>
                    {statusOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                {["pending", "completed", "failed"].map((paymentOption) => (
                  <MenuItem key={paymentOption} value={paymentOption}>
                    {paymentOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleStatusChange}
            color="primary"
            variant="contained"
          >
            Update Order
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          message={snackbarMessage}
          style={{
            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
          }}
        />
      </Snackbar>
    </div>
  );
};

export default OrderForm;
