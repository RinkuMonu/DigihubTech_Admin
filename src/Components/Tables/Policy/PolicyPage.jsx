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
    Grid,
    useMediaQuery,
    IconButton,
} from '@mui/material';

import { apiDelete, apiGet } from '../../../api/apiMethods';
import { EditNoteOutlined } from '@mui/icons-material';
import DeleteDialog from '../Website/DeleteDialog';
import { EyeOutlined } from '@ant-design/icons';

const PolicyPage = () => {
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
            const response = await apiDelete(API_URL);
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
                        <Typography variant="h5" gutterBottom>Polices</Typography>
                    </Grid>
                </Grid>
                {/* <CategoryForm dataHandler={fetchData} /> */}
            </Grid>

            <TableContainer component={Paper} sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', p: 1 }}>
                <Table sx={{ borderCollapse: 'collapse' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Website</strong></TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Privacy Policy</strong></TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Terms and Condition</strong></TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Refund Policy</strong></TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Shipping Policy</strong></TableCell>
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
                                        {"hello"}
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', cursor: 'pointer' }}>
                                        <IconButton>
                                            <EditNoteOutlined />
                                        </IconButton>
                                        <IconButton>
                                            <EyeOutlined />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                                        <IconButton>
                                            <EditNoteOutlined />
                                        </IconButton>
                                        <IconButton>
                                            <EyeOutlined />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                                        <IconButton>
                                            <EditNoteOutlined />
                                        </IconButton>
                                        <IconButton>
                                            <EyeOutlined />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                                        <IconButton>
                                            <EditNoteOutlined />
                                        </IconButton>
                                        <IconButton>
                                            <EyeOutlined />
                                        </IconButton>
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

export default PolicyPage;
