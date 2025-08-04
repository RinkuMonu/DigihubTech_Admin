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
import ProductForm from "./ProductForm";
import ProductDetail from "./ProductDetail";
import { DeleteForeverOutlined, Height } from "@mui/icons-material";
import DeleteDialog from "../Website/DeleteDialog";
import { useUser } from "../../../Context/UserContext";
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles({
  selectInput: {
    minWidth: 200,
    fontSize: "14px",
  },
});
const ProductsPage = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [websites, setWebsites] = useState([]);
  const [filterWebsite, setfilterWebsite] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  // const [categories, setCategories] = useState([]);
  const API_ENDPOINT = `api/product/getproducts`;

  const { user, setCategories, categories } = useUser();

  const fetchData = async () => {
    try {
      const response = await apiGet(API_ENDPOINT, {
        referenceWebsite: filterWebsite,
        search: searchInput,
        page: currentPage,
        limit: pageSize,
        category: filterCategory,
        sortBy,
        sortOrder,
      });
      const { products, pagination } = response.data;
      setData(products || []);
      setTotalPages(pagination?.totalPages || 1);
    } catch (error) {
      setData([]);
      console.error(error.message);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [websitesResponse] = await Promise.all([apiGet("api/website")]);
      setWebsites(websitesResponse.data?.websites || []);
      setfilterWebsite(websitesResponse.data?.websites[0]?._id);
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
  };
  useEffect(() => {
    if (!user) return;
    if (user?.role === "super-admin") {
      fetchDropdownData();
    } else {
      setfilterWebsite(user?.referenceWebsite);
    }
  }, [user]);

  // useEffect(() => {
  //     if (filterWebsite) {
  //         const matchedWebsite = websites.find((website) => website._id === filterWebsite);
  //         if (matchedWebsite) {
  //             setCategories(matchedWebsite.categories || []);
  //         } else {
  //             setCategories([]);
  //         }
  //     } else {
  //         setCategories([]);
  //     }
  // }, [filterWebsite, websites]);

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
    filterCategory,
  ]);

  const deleteHandler = async (id) => {
    let API_URL = `api/product/delete/${id}`;
    try {
      const response = await apiDelete(API_URL);
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
    <>
      <Box className={classes.bg1}>
        <Grid container alignItems="center" sx={{ mb: 0, p: 0 }}>
          <Grid item xs>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                flexGrow: 1,
                color: "#2a4172",
                fontWeight: "600",
                p: 0,
                mb: 0,
                fontSize: "20px",
                // color: "#000",
                mt: 1,
              }}
            >
              Products
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <ProductForm
              categories={categories}
              websites={websites}
              dataHandler={fetchData}
            />
          </Grid>
          <Grid item xs={2}>
            <ProductForm
              addCategory={true}
              categories={categories}
              websites={websites}
              dataHandler={fetchData}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 1, borderBottomWidth: 1, mt: 1 }} />

        <Grid container spacing={3} alignItems="center" sx={{ mt: 0, px: 0 }}>
          <Grid item xs={6} md={3}>
            <TextField
              label="Search by Name"
              variant="outlined"
              id="outlined-size-small"
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
                  defaultValue=""
                  onChange={(e) => setfilterWebsite(e.target.value)}
                  label="Sort By"
                  size="small"
                >
                  {websites &&
                    websites.map((item, index) => (
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
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
                size="small"
              >
                <MenuItem value="">All</MenuItem>
                {categories &&
                  categories.map((item, index) => (
                    <MenuItem key={index} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                label="Sort By"
                id="outlined-size-small"
                size="small"
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
              fullWidth
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </Grid>
        </Grid>
        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
            padding: "8px",
            p: 0,
            my: 3,
          }}
        >
          <Table sx={{ borderCollapse: "collapse" }}>
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
                  <strong>#</strong>
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    whiteSpace: "nowrap",
                    padding: "8px",
                    backgroundColor: "#fbe5ec",
                  }}
                >
                  <strong>Name</strong>
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    whiteSpace: "nowrap",
                    padding: "8px",
                    backgroundColor: "#fbe5ec",
                  }}
                >
                  <strong>Images</strong>
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    whiteSpace: "nowrap",
                    padding: "8px",
                    backgroundColor: "#fbe5ec",
                  }}
                >
                  <strong>Amount</strong>
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    whiteSpace: "nowrap",
                    padding: "8px",
                    backgroundColor: "#fbe5ec",
                  }}
                >
                  <strong>Discount</strong>
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    whiteSpace: "nowrap",
                    padding: "8px",
                    backgroundColor: "#fbe5ec",
                  }}
                >
                  <strong>Category</strong>
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    whiteSpace: "nowrap",
                    padding: "8px",
                    backgroundColor: "#fbe5ec",
                  }}
                >
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    No data available.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell
                      sx={{
                        border: "1px solid #ddd",
                        whiteSpace: "nowrap",
                        padding: "8px",
                      }}
                    >
                      {index + (currentPage - 1) * pageSize + 1}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setSelectedWebsite(item);
                        setDetailOpen(true);
                      }}
                      sx={{
                        border: "1px solid #ddd",
                        whiteSpace: "nowrap",
                        padding: "8px",
                        cursor: "pointer",
                      }}
                    >
                      {item.productName || "NA"}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #ddd",
                        whiteSpace: "nowrap",
                        padding: "8px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "4px" }}>
                        {item.images.map((item, index) => (
                          <img
                            key={index}
                            style={{
                              height: "35px",
                              width: "35px",
                              objectFit: "cover",
                              boxShadow: "1px 1px 10px",
                              borderRadius: "50%",
                            }}
                            src={`https://api.jajamblockprints.com${item}`}
                            alt=""
                          />
                        )) || "NA"}
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #ddd",
                        whiteSpace: "nowrap",
                        padding: "8px",
                      }}
                    >
                      {item.price || "NA"} &#8377;
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #ddd",
                        whiteSpace: "nowrap",
                        padding: "8px",
                      }}
                    >
                      {item.discount || "0"} %
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #ddd",
                        whiteSpace: "nowrap",
                        padding: "8px",
                      }}
                    >
                      {item.category?.name}
                    </TableCell>
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
                      <ProductForm
                        categories={categories}
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
        <ProductDetail
          open={detailOpen}
          onClose={() => {
            setDetailOpen(false);
            setSelectedWebsite(null);
          }}
          data={selectedWebsite}
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
    </>
  );
};

export default ProductsPage;
