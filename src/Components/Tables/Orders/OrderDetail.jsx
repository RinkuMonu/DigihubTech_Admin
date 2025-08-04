import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const OrderDetail = ({ open, onClose, data }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontSize: 22, fontWeight: 'medium' }}>Order Details</DialogTitle>
            <DialogContent>
                {data ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Customer Name :
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                                {data.customer?.firstName} {data.customer?.lastName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Customer Email
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                                {data.customer?.email}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Payment Status
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                                {data.paymentStatus}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Order Status
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                                {data.status}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Order Amount
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                                {data.totalAmount} &#8377;
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Ordered Website
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                                {data.referenceWebsite?.websiteName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Order Date
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                                {new Date(data.createdAt).toLocaleString()}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Shipping Address
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                                {`${data.shippingAddress?.address} ${data.shippingAddress?.state}, ${data.shippingAddress?.country}   ${data.shippingAddress?.pinCode}  `}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Ordered Products
                            </Typography>
                        </Grid>
                        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
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
                                    {data.products.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.product?.productName}</TableCell>
                                            <TableCell>{item.product?.price}  &#8377;</TableCell>
                                            <TableCell>{item.quantity}*</TableCell>
                                            <TableCell>{item.total}  &#8377;</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Grid>
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        No data available
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetail;
