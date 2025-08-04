import { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Grid,
    Button,
    Pagination,
    useMediaQuery,
    IconButton,
    Snackbar
} from '@mui/material';

import { apiDelete, apiGet } from '../../../api/apiMethods';
import { DeleteForeverOutlined, EditNoteOutlined } from '@mui/icons-material';
import DeleteDialog from '../Website/DeleteDialog';
import CategoryForm from './CategoryForm';

const CategoryPage = () => {
    const [data, setData] = useState([]); // Initialize as an array
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const API_ENDPOINT = `api/categories`;

    const isSmallScreen = useMediaQuery('(max-width:800px)');

    const fetchData = async () => {
        try {
            const response = await apiGet(API_ENDPOINT);
            if (Array.isArray(response.data)) {
                setData(response.data);
            } else {
                console.error('Data is not an array:', response.data);
            }
        } catch (error) {
            console.error('There was an error fetching data!', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteHandler = async (id) => {
        let API_URL = `api/categories/${id}`;
        try {
            const response = await apiDelete(API_URL); // Call the DELETE method
            if (response.status === 200) {
                fetchData();
            }
        } catch (error) {
            console.log(error)
        }
    };
    const openDialog = (id) => {
        setSelectedItemId(id);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setSelectedItemId(null);
    };

    return (
        <>
            <Grid sx={{ mb: 3, paddingTop: '20px', position: isSmallScreen ? 'relative' : 'sticky', top: isSmallScreen ? 'auto' : 0, zIndex: 1000, backgroundColor: 'white' }} className='setdesigntofix'>
                <Grid container alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs>
                        <Typography variant="h5" gutterBottom>Product Categories</Typography>
                    </Grid>
                </Grid>
                <CategoryForm dataHandler={fetchData} />
            </Grid>

            <TableContainer component={Paper} sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', p: 1 }}>
                <Table sx={{ borderCollapse: 'collapse' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>#</strong></TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Name</strong></TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Description</strong></TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={12} align="center">No data available.</TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', cursor: 'pointer' }}>
                                        {item.name || 'NA'}
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                                        {item.description || 'NA'}
                                    </TableCell>
                                    <TableCell sx={{ display: 'flex', border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                                        <IconButton onClick={() => openDialog(item._id)}>
                                            <DeleteForeverOutlined />
                                        </IconButton>
                                        <CategoryForm dataHandler={fetchData} initialData={item} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer >
            <DeleteDialog
                deleteHandler={deleteHandler}
                itemId={selectedItemId}
                open={dialogOpen}
                onClose={closeDialog}
            />
        </>
    );
};

export default CategoryPage;
