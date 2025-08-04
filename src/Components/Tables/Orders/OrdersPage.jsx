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
    IconButton,
    Snackbar,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    Divider,
} from '@mui/material';
import { apiDelete, apiGet } from '../../../api/apiMethods';
import OrderForm from './OrderForm';
import OrderDetail from './OrderDetail';
import { DeleteForeverOutlined } from '@mui/icons-material';
import DeleteDialog from './../Website/DeleteDialog';
import { useUser } from '../../../Context/UserContext';

import { makeStyles } from '@mui/styles';
const useStyles = makeStyles({
    selectInput: {
        minWidth: 200,
        fontSize: '14px',
    },
});
const OrdersPage = () => {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [detailOpen, setDetailOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedWebsite, setSelectedWebsite] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [pageSize, setPageSize] = useState(10);
    const [websites, setWebsites] = useState([]);
    const [filterWebsite, setfilterWebsite] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const API_ENDPOINT = `api/order/allorders`;

    const { user } = useUser()

    const fetchData = async () => {
        try {
            if (!user) return;
            if (["admin", "vendor"].includes(user.role) && !filterWebsite) return;
            const response = await apiGet(API_ENDPOINT, {
                referenceWebsite: filterWebsite,
                customerName: searchInput,
                page: currentPage,
                limit: pageSize,
                sortBy,
                sortOrder,
                minPrice,
                maxPrice,
            });
            const orders = response.data?.orders;
            setData(orders || []);
            setTotalPages(response.data?.totalPages || 1);
        } catch (error) {
            console.error(error.message);
            setData([]);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const websitesResponse = await apiGet('api/website');
            setWebsites(websitesResponse.data?.websites || []);
            setfilterWebsite(websitesResponse.data?.websites[0]._id); // Set the default website to the first one
        } catch (error) {
            console.error('Failed to fetch dropdown data:', error.message);
        }
    };

    useEffect(() => {
        if (user && user.role === 'super-admin') fetchDropdownData();
        else {
            setfilterWebsite(user?.referenceWebsite)
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [filterWebsite, currentPage, searchInput, pageSize, sortBy, sortOrder, minPrice, maxPrice]);

    const deleteHandler = async (id) => {
        let API_URL = `api/order/orders/${id}`;
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

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleSortChange = (field) => {
        setSortBy(field);
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <>
            <Box className={classes.bg1} >
                <Grid container alignItems="center" sx={{ mb: 0, p: 0}}>
                    <Grid item xs>
                        <Typography variant="h5" gutterBottom
                            sx={{
                                flexGrow: 1,
                                color: '#2a4172',
                                fontWeight: '600',
                                p: 0,
                                mb: 0,
                                fontSize: '20px',
                            }}>Received Orders</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ mt: 1, borderBottomWidth: 1, pt:0}} />
                <Grid container spacing={3} alignItems="center" sx={{ mt:0, mb:2,  px:0, py:0  }}>
                    <Grid item xs={6} md={3} sx={{pt:0}}>
                        <TextField
                            label="Search by Customer"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </Grid>
                    {user && user.role === 'super-admin' && <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel>Reference Website</InputLabel>
                            <Select
                                value={filterWebsite}
                                onChange={(e) => setfilterWebsite(e.target.value)}
                                label="Website"
                                  size="small"
                            >
                                <MenuItem value=''>All</MenuItem>
                                {websites && websites.map((item, index) =>
                                    <MenuItem key={index} value={item._id}>{item.websiteName}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>}
                    <Grid item xs={3}>
                        <TextField
                            label="Min Price"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={minPrice}
                            onChange={(e) => {
                                setMinPrice(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Max Price"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={maxPrice}
                            onChange={(e) => {
                                setMaxPrice(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', p: 2 }}>
                    <Table sx={{ borderCollapse: 'collapse' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', }}>
                                    <strong>#</strong>
                                </TableCell>
                                <TableCell
                                    sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px',  cursor: 'pointer' }}
                                    onClick={() => handleSortChange('customer')}
                                >
                                    <strong>Customer</strong>
                                </TableCell>
                                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', }}>
                                    <strong>Shipping Address</strong>
                                </TableCell>
                                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', }}>
                                    <strong>Payment Status</strong>
                                </TableCell>
                                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', }}>
                                    <strong>Order Status</strong>
                                </TableCell>
                                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', }}>
                                    <strong>Price</strong>
                                </TableCell>
                                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', }}>
                                    <strong>Order Date</strong>
                                </TableCell>
                                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', }}>
                                    <strong>Action</strong>
                                </TableCell>
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
                                        <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px',  }}>
                                            {index + (currentPage - 1) * pageSize + 1}
                                        </TableCell>
                                        <TableCell onClick={() => { setSelectedWebsite(item); setDetailOpen(true); }}
                                            sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', cursor: 'pointer',  }}>
                                            {item.customer?.firstName + ' ' + item.customer?.lastName || 'NA'}
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px',  }}>
                                            {`${item.shippingAddress?.address} ${item.shippingAddress?.state}, ${item.shippingAddress?.country} ${item.shippingAddress?.pinCode}` || 'NA'}
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px',  }}>
                                            {item.paymentStatus || '0'}
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px',  }}>
                                            {item.status}
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px',  }}>
                                            {item.totalAmount} &#8377;
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px',  }}>
                                            {new Date(item.createdAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ display: 'flex', border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px',  }}>
                                            <OrderForm dataHandler={fetchData} order={item} />
                                            <IconButton onClick={() => openDialog(item._id)}>
                                                <DeleteForeverOutlined />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <OrderDetail
                    open={detailOpen}
                    onClose={() => { setDetailOpen(false); setSelectedWebsite(null); }}
                    data={selectedWebsite}
                />
                <DeleteDialog
                    deleteHandler={deleteHandler}
                    itemId={selectedItemId}
                    open={dialogOpen}
                    onClose={closeDialog}
                />
                <Grid container justifyContent="right" sx={{pr:2, pb:2}}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                    />
                </Grid>
            </Box>
        </>
    );
};

export default OrdersPage;