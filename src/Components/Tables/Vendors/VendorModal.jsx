import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid } from '@mui/material';
import { useState } from 'react';
import { Check } from '@mui/icons-material';

export default function VendorModal({ userId, updateVendorRequest }) {
    const [open, setOpen] = useState(false);
    const [commissionRate, setCommissionRate] = useState("");

    return (
        <div>
            {/* <Button variant="contained" color="primary" onClick={() => setOpen(true)}> */}
            <Check onClick={() => setOpen(true)} />
            {/* </Button> */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Accept vendor request</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={"Commission Rate"}
                                variant="outlined"
                                required
                                value={commissionRate}
                                sx={{ marginTop: 1 }}
                                onChange={(e) => setCommissionRate(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={() => updateVendorRequest(userId, true, commissionRate)} color="primary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* <Snackbar
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
            </Snackbar> */}
        </div>
    )
}
