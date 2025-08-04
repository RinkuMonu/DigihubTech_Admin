import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Snackbar, SnackbarContent } from '@mui/material';

const DeleteDialog = ({ deleteHandler, itemId, open, onClose }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success | error

    const handleDelete = async () => {
        try {
            await deleteHandler(itemId); // Call the passed deleteHandler with the itemId
            setSnackbarMessage('Item deleted successfully');
            setSnackbarSeverity('success');
            onClose(); 
        } catch (error) {
            setSnackbarMessage('Failed to delete item');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this item? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="secondary"
                        variant="contained"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
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

export default DeleteDialog;
