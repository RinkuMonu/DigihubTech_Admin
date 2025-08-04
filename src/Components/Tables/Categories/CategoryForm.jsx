import { useEffect, useState } from 'react';
import { Dialog, Checkbox, FormControlLabel, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Snackbar, SnackbarContent, Typography, IconButton } from '@mui/material';
import { apiPost, apiPut } from '../../../api/apiMethods'; // Ensure you have apiPost setup
import { EditNoteOutlined } from '@mui/icons-material';

const CategoryForm = ({ dataHandler, initialData }) => {
    const [open, setOpen] = useState(false);
    const [name, setname] = useState('');
    const [description, setDescription] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success | error

    useEffect(() => {
        if (initialData) {
            setname(initialData.name || '');
            setDescription(initialData.description || '');
        } else {
            setname('');
            setDescription('');
        }
    }, [initialData]);

    const handleSubmit = async () => {
        if (!name) {
            setSnackbarMessage('Please fill all required fields');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        const newWebsite = {
            name,
            description,
        };
        try {

            const response = initialData ? await apiPut(`api/categories/${initialData._id}`, newWebsite) : await apiPost('api/categories', newWebsite);
            if (response.status === 200) {
                setSnackbarMessage('Request successfully');
                setSnackbarSeverity('success');
                setOpen(false);
                dataHandler();
            }
        } catch (error) {
            setSnackbarMessage('Request failed');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            {initialData ? <IconButton onClick={handleClickOpen}><EditNoteOutlined /></IconButton> :
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    New Category
                </Button>}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle paddingBottom={2} fontSize={22}>{initialData ? "Update" : "New"} Category</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} paddingTop={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                variant="outlined"
                                required
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                className="mb-4"
                                error={!name && open} // Show error if input is empty when dialog is open
                                helperText={!name && open ? 'Name is required' : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mb-4"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
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

export default CategoryForm;
