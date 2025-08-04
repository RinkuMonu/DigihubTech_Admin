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
import NewWebsite from './NewWebsite';
import { DeleteForeverOutlined, EditAttributesOutlined, EditCalendarOutlined, EditNoteOutlined, PolicyOutlined } from '@mui/icons-material';
import DeleteDialog from './DeleteDialog';
import ViewDetail from './ViewDetail';
import PolicyDialog from './PolicyDialog';

const Websiteslist = () => {
  const [data, setData] = useState([]); // Initialize as an array
  const [filteredData, setFilteredData] = useState([]); // Initialize as an array
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Define items per page
  const [detailOpen, setDetailOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [categories, setCategories] = useState([]);
  const [policydialogOpen, setPolicyDialogOpen] = useState(false);
  const [selectedWeb,setWeb]= useState(null)

  const API_ENDPOINT = `api/website`;

  const [viewAll, setViewAll] = useState(true);
  const isSmallScreen = useMediaQuery('(max-width:800px)');

  const fetchData = async () => {
    try {
      const response = await apiGet(API_ENDPOINT, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchInput, // Ensure search input is passed in the API request
        }
      });
      if (Array.isArray(response.data.websites)) {
        setData(response.data.websites || []);
        setFilteredData(response.data.websites);
      } else {
        console.error('Data is not an array:', response.data);
      }
    } catch (error) {
      setData([])
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiGet('api/categories'); // Replace with your actual API endpoint
      if (response.status === 200) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchInput]); // Trigger effect when page or search changes

  const deleteHandler = async (id) => {
    let API_URL = `api/website/${id}`;
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

  const handleFilter = () => {
    let filtered = data.filter((item) => {
      const matchesName = item.websiteName?.toLowerCase().includes(searchInput.toLowerCase());
      const matchesDescription = item.websiteDescription?.toLowerCase().includes(searchInput.toLowerCase());
      return matchesName || matchesDescription;
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  };

  useEffect(() => {
    handleFilter(); // Call filter function on state changes
  }, [searchInput]);

  const handleReset = () => {
    setSearchInput('');
    setFilteredData(data);
    setCurrentPage(1);
    setViewAll(false);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const toggleViewAll = () => {
    setViewAll((prev) => !prev);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = viewAll
    ? filteredData
    : Array.isArray(filteredData)
      ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
      : [];
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <>
      <Grid sx={{ mb: 3, paddingTop: '20px', position: isSmallScreen ? 'relative' : 'sticky', top: isSmallScreen ? 'auto' : 0, zIndex: 1000, backgroundColor: 'white' }} className='setdesigntofix'>
        {/* <Grid container alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs>
          
          </Grid>
        </Grid> */}

        <Grid container spacing={3} alignItems="left" sx={{ mb: 3 }}>
          {/* <Grid item xs={12} md={3}>
          </Grid> */}
          <Grid item xs>
          <Typography variant="h5" gutterBottom>Websites Information</Typography>
          </Grid>
          <Grid item xs={12} sm={5} container spacing={1}>
            <Grid item xs={4}>
              <NewWebsite categories={categories} dataHandler={fetchData} />
            </Grid>
            <Grid item xs={4}>
              <Button  fullWidth onClick={handleReset}>Reset</Button>
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth onClick={toggleViewAll}>{viewAll ? 'Paginate' : 'View All'}</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', p: 1 }}>
        <Table sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>#</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Name</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Description</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Date</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Status</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Policy</strong></TableCell>
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
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell onClick={() => {
                    setSelectedWebsite(item);
                    setDetailOpen(true)
                  }
                  } sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', cursor: 'pointer' }}>
                    {item.websiteName || 'NA'}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                    {item.websiteDescription || 'NA'}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                    {new Date(item.dateCreated).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', color: item.activeStatus === 'Success' ? 'green' : 'red' }}>
                    {item.activeStatus ? 'active' : 'deactive'}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                    <IconButton onClick={() => {setPolicyDialogOpen(true),setWeb(item._id)}}>
                      <PolicyOutlined />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ display: 'flex', border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                    <IconButton onClick={() => openDialog(item._id)}>
                      <DeleteForeverOutlined />
                    </IconButton>
                    <NewWebsite categories={categories} dataHandler={fetchData} initialData={item} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer >

      <ViewDetail
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedWebsite(null)
        }}
        websiteData={selectedWebsite}
      />
      <PolicyDialog selectedWeb={selectedWeb} open={policydialogOpen} onClose={() => setPolicyDialogOpen(false)} />
      <DeleteDialog
        deleteHandler={deleteHandler}
        itemId={selectedItemId}
        open={dialogOpen}
        onClose={closeDialog}
      />
    </>
  );
};

export default Websiteslist;
