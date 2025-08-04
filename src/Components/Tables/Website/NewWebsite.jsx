import { useEffect, useState } from 'react';
import {
    Dialog, Checkbox, FormControlLabel, DialogActions, DialogContent, DialogTitle,
    Button, TextField, Grid, Snackbar, SnackbarContent, IconButton, Autocomplete, CircularProgress
} from '@mui/material';
import { apiPost, apiPut, apiGet } from '../../../api/apiMethods';
import { EditNoteOutlined } from '@mui/icons-material';

const NewWebsite = ({ dataHandler, initialData, categories }) => {
    const [open, setOpen] = useState(false);
    const [websiteName, setWebsiteName] = useState('');
    const [websiteDescription, setWebsiteDescription] = useState('');
    const [websiteURL, setWebsiteURL] = useState('');
    const [logo, setLogo] = useState(null);
    const [activeStatus, setActiveStatus] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (initialData) {
            setWebsiteName(initialData.websiteName || '');
            setWebsiteDescription(initialData.websiteDescription || '');
            setWebsiteURL(initialData.websiteURL || '');
            setActiveStatus(initialData.activeStatus || false);
            setSelectedCategories(initialData.categories || []);
        } else {
            resetForm();
        }
    }, [initialData]);

    const resetForm = () => {
        setWebsiteName('');
        setWebsiteDescription('');
        setWebsiteURL('');
        setActiveStatus(true);
        setSelectedCategories([]);
        setLogo(null);
    };

    const handleFileChange = (event) => {
        setLogo(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!websiteName || !websiteURL) {
            setSnackbarMessage('Please fill all required fields');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const formData = new FormData();
        formData.append('websiteName', websiteName);
        formData.append('websiteDescription', websiteDescription);
        formData.append('websiteURL', websiteURL);
        formData.append('activeStatus', activeStatus);
        formData.append('categories', JSON.stringify(selectedCategories));
        if (logo) formData.append('image', logo);


        try {
            const response = initialData
                ? await apiPut(`api/website/${initialData._id}`, formData, 'multipart/form-data')
                : await apiPost('api/website/add', formData, 'multipart/form-data');
            if (response.status === 200) {
                setSnackbarMessage('Request successful');
                setSnackbarSeverity('success');
                setOpen(false);
                dataHandler();
            }
        } catch (error) {
            setSnackbarMessage('Request failed');
            setSnackbarSeverity('error');
            console.log(error)
        }
        setSnackbarOpen(true);
    };

    return (
        <div>
            {initialData ? (
                <IconButton onClick={() => setOpen(true)}>
                    <EditNoteOutlined />
                </IconButton>
            ) : (
                <Button  color="primary" onClick={() => setOpen(true)}>
                    New Website
                </Button>
            )}

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{initialData ? "Update" : "New"} Website</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} marginTop={2}>
                            <TextField fullWidth label="Website Name" variant="outlined" required value={websiteName} onChange={(e) => setWebsiteName(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Website Description" variant="outlined" value={websiteDescription} onChange={(e) => setWebsiteDescription(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Website URL" variant="outlined" required value={websiteURL} onChange={(e) => setWebsiteURL(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete multiple options={categories} getOptionLabel={(option) => option.name} value={selectedCategories} onChange={(event, newValue) => setSelectedCategories(newValue)} isOptionEqualToValue={(option, value) => option._id === value._id} renderInput={(params) => <TextField {...params} label="Select Categories" variant="outlined" placeholder="Categories" />} />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel control={<Checkbox checked={activeStatus} onChange={(e) => setActiveStatus(e.target.checked)} />} label="Active" />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary" >Submit</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)}>
                <SnackbarContent message={snackbarMessage} style={{ backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red' }} />
            </Snackbar>
        </div>
    );
};

export default NewWebsite;
