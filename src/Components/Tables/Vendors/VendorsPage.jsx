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
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    Divider
} from '@mui/material';
import { useUser } from '../../../Context/UserContext';
import { useEffect, useState } from 'react';
import { apiGet, apiPatch } from '../../../api/apiMethods';
import { DeleteForeverOutlined } from '@mui/icons-material';
import VendorModal from './VendorModal';

export default function VendorsPage() {
    const { user } = useUser();
    const [vendors, setVendors] = useState([])
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {

        (async () => {
            try {
                if (!sessionStorage.getItem("accessToken")) return;
                const { data } = await apiGet('/api/incoming-vendor-requests');
                setVendors(data);
            } catch (error) {
                console.log(error);
            }
        })()
    }, [])

    async function updateVendorRequest(userId, accept, commissionRate) {
        try {
            await apiPatch(`/api/update-vendor-request/${userId}`, { accept, commissionRate });
            alert("Vendor request updated successfully");
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <>
          <Box >
            <Grid container alignItems="center" sx={{ mb: 0, p: 0 }}>
                <Grid item xs>
                    <Typography variant="h5" gutterBottom sx={{
                            flexGrow: 1,
                            color: '#2a4172',
                            fontWeight: '600',
                            p: 0,
                            mb: 0,
                            fontSize: '20px',
                        }}>Vendor requests</Typography>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 1, borderBottomWidth: 1, pt: 0, }} />
            {/* <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                    <TextField
                        label="Search by Name"
                        variant="outlined"
                        fullWidth
                        value={{}}
                        onChange={(e) => {
                            // setSearchInput(e.target.value);
                            // setCurrentPage(1);
                        }}
                    />
                </Grid>
                {user && user.role === "super-admin" && <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel>Reference Website</InputLabel>
                        <Select
                            value={{}}
                            defaultValue=''
                            // onChange={(e) => setfilterWebsite(e.target.value)}
                            label="Sort By"
                        >
                        </Select>
                    </FormControl>
                </Grid>}
                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            defaultValue=''
                            label="Product Category"
                        >
                            <MenuItem value=''>All</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            label="Sort By"
                        >
                            <MenuItem value="productName">Name</MenuItem>
                            <MenuItem value="price">Price</MenuItem>
                            <MenuItem value="discount">Discount</MenuItem>
                            <MenuItem value="createdAt">Created</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant="contained"
                        fullWidth
                    >
                    </Button>
                </Grid>
                <Grid item xs={3}>
                </Grid>
                <Grid item xs={3}>
                </Grid>
            </Grid> */}
            <TableContainer component={Paper} sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', p: 0, mt:2 }}>
                <Table sx={{ borderCollapse: 'collapse' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' , backgroundColor:"#fbe5ec"}}><strong>#</strong></TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' , backgroundColor:"#fbe5ec"}}><strong>Name</strong></TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' , backgroundColor:"#fbe5ec"}}><strong>Company</strong></TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' , backgroundColor:"#fbe5ec"}}><strong>GSTIn Number</strong></TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' , backgroundColor:"#fbe5ec"}}><strong>Mobile</strong></TableCell>
                            <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' , backgroundColor:"#fbe5ec"}}><strong>Action</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {vendors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={12} align="center">No data available.</TableCell>
                            </TableRow>
                        ) : (
                            vendors.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                                        {index + (currentPage - 1) * pageSize + 1}
                                    </TableCell>
                                    <TableCell onClick={() => {
                                        // setSelectedWebsite(item);
                                        // setDetailOpen(true)
                                    }
                                    } sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', cursor: 'pointer' }}>
                                        {item.firstName + " " + item.lastName || 'NA'}
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                                        {item.company || 'NA'}
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                                        {item.gstInNumber || '0'}
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                                        {item.mobile}
                                    </TableCell>
                                    <TableCell sx={{ display: 'flex', border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                                        <IconButton >
                                            <VendorModal updateVendorRequest={updateVendorRequest} userId={item._id} />
                                        </IconButton>
                                        <IconButton onClick={() => updateVendorRequest(item._id, false)}>
                                            <DeleteForeverOutlined />
                                        </IconButton>
                                        {/* <ProductForm categories={categories} websites={websites} dataHandler={fetchData} initialData={item} /> */}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <ProductDetail
                open={detailOpen}
                onClose={() => {
                    setDetailOpen(false);
                    setSelectedWebsite(null);
                }}
                data={selectedWebsite}
            /> */}
            {/* <DeleteDialog
                deleteHandler={deleteHandler}
                itemId={selectedItemId}
                open={dialogOpen}
                onClose={closeDialog}
            /> */}
            <Grid container justifyContent="right" sx={{pb:2, pr:2}}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    // onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                />
            </Grid>
            </Box>
        </>
    )
}