import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';

const UserDetail = ({ open, onClose, data }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontSize: 22, fontWeight: 'medium' }}>User Details</DialogTitle>
            <DialogContent>
                {data ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Name :
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                                {data.firstName + ' ' + data.lastName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Email
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                                {data.email || ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Mobile
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 0.5 }}>
                                {data.mobile || ''}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Address
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ marginTop: 0.5 }}
                            >
                                {data.address || ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold" color="textSecondary">
                                Role
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ marginTop: 0.5 }}
                            >
                                {data.role || ""} 
                            </Typography>
                        </Grid>
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

export default UserDetail;
