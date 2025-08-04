import { useState, useEffect } from "react";
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
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Box,
} from "@mui/material";
import { apiDelete, apiGet } from "../../../api/apiMethods";
import BannerForm from "./BannerForm";
import BannerDetail from "./BannerDetails";
import { DeleteForeverOutlined } from "@mui/icons-material";
import DeleteDialog from "../Website/DeleteDialog";
import { useUser } from "../../../Context/UserContext";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  selectInput: {
    minWidth: 200,
    fontSize: "14px",
  },
});

const BannersPage = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [websites, setWebsites] = useState([]);
  const [filterWebsite, setFilterWebsite] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const { user } = useUser();

  const fetchData = async () => {
    try {
      const response = await apiGet("api/banners", {
        referenceWebsite: filterWebsite,
        search: searchInput,
        page: currentPage,
        limit: pageSize,
        position: filterPosition,
        sortBy,
        sortOrder,
      });
      const { banners, pagination } = response.data;
      setData(banners || []);
      setTotalPages(pagination?.totalPages || 1);
    } catch (error) {
      setData([]);
      console.error(error.message);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const response = await apiGet("api/website");
      setWebsites(response.data?.websites || []);
      setFilterWebsite(response.data?.websites[0]?._id);
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user?.role === "super-admin") {
      fetchDropdownData();
    } else {
      setFilterWebsite(user?.referenceWebsite);
    }
  }, [user]);

  useEffect(() => {
    if (filterWebsite) {
      fetchData();
    }
  }, [
    filterWebsite,
    currentPage,
    searchInput,
    sortBy,
    sortOrder,
    pageSize,
    filterPosition,
  ]);

  const deleteHandler = async (id) => {
    try {
      const response = await apiDelete(`api/banners/${id}`);
      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
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
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <Box className={classes.bg1}>
      <Grid container alignItems="center" sx={{ mb: 0, p: 0 }}>
        <Grid item xs>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#2a4172", fontWeight: "600", mt: 1 }}
          >
            Banners
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <BannerForm websites={websites} dataHandler={fetchData} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 1 }} />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={6} md={3}>
          <TextField
            label="Search by Name"
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

        {user && user.role === "super-admin" && (
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Reference Website</InputLabel>
              <Select
                value={filterWebsite}
                onChange={(e) => setFilterWebsite(e.target.value)}
                label="Website"
              >
                {websites.map((item, index) => (
                  <MenuItem key={index} value={item._id}>
                    {item.websiteName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Position</InputLabel>
            <Select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              label="Position"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="homepage-top">Homepage Top</MenuItem>
              <MenuItem value="homepage-bottom">Homepage Bottom</MenuItem>
              <MenuItem value="sidebar">Sidebar</MenuItem>
              <MenuItem value="footer">Footer</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{ border: "1px solid #ddd", mt: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  whiteSpace: "nowrap",
                  padding: "8px",
                  backgroundColor: "#fbe5ec",
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  whiteSpace: "nowrap",
                  padding: "8px",
                  backgroundColor: "#fbe5ec",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  whiteSpace: "nowrap",
                  padding: "8px",
                  backgroundColor: "#fbe5ec",
                }}
              >
                Images
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  whiteSpace: "nowrap",
                  padding: "8px",
                  backgroundColor: "#fbe5ec",
                }}
              >
                Description
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  whiteSpace: "nowrap",
                  padding: "8px",
                  backgroundColor: "#fbe5ec",
                }}
              >
                Position
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  whiteSpace: "nowrap",
                  padding: "8px",
                  backgroundColor: "#fbe5ec",
                }}
              >
                Device type
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  whiteSpace: "nowrap",
                  padding: "8px",
                  backgroundColor: "#fbe5ec",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {index + (currentPage - 1) * pageSize + 1}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      setSelectedBanner(item);
                      setDetailOpen(true);
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    {item.bannerName}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {item.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={`https://api.jajamblockprints.com${img}`}
                          alt=""
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "4px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell>{item.deviceType}</TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      border: "1px solid #ddd",
                      whiteSpace: "nowrap",
                      padding: "8px",
                    }}
                  >
                    <IconButton onClick={() => openDialog(item._id)}>
                      <DeleteForeverOutlined />
                    </IconButton>
                    <BannerForm
                      websites={websites}
                      dataHandler={fetchData}
                      initialData={item}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <BannerDetail
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedBanner(null);
        }}
        data={selectedBanner}
      />

      <DeleteDialog
        deleteHandler={deleteHandler}
        itemId={selectedItemId}
        open={dialogOpen}
        onClose={closeDialog}
      />

      <Grid container justifyContent="right" sx={{ pr: 2, pb: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </Grid>
    </Box>
  );
};

export default BannersPage;
