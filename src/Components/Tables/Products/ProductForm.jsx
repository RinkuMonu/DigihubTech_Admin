import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Snackbar,
  SnackbarContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { apiPost, apiPut } from "../../../api/apiMethods";
import { EditNoteOutlined } from "@mui/icons-material";
import { useUser } from "../../../Context/UserContext";
import AddIcon from "@mui/icons-material/Add";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  selectInput: {
    minWidth: 200,
    fontSize: "14px",
  },
});

const ProductForm = ({ dataHandler, initialData, websites, addCategory }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [size, setSize] = useState("M");
  const [discount, setDiscount] = useState(0);
  const [referenceWebsite, setReferenceWebsite] = useState("");
  const [category, setCategory] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryPreview, setCategoryPreview] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [subcategory, setSubCategory] = useState("");
  const { user, categories, setCategories } = useUser();

  useEffect(() => {
    if (initialData) {
      setProductName(initialData?.productName || "");
      setDescription(initialData.description || "");
      setPrice(initialData?.price || 0);
      setSize(initialData?.size || "");
      setDiscount(initialData?.discount || 0);
      setReferenceWebsite(initialData?.referenceWebsite || "");
      setCategory(initialData?.category?._id || "");
      // setPreviewImages(initialData?.images || []);
      setPreviewImages(
        initialData?.images?.map(
          (img) => `https://api.jajamblockprints.com${img}`
        ) || []
      );
    } else {
      resetForm();
    }
  }, [initialData]);

  useEffect(() => {
    if (user && !initialData) {
      setReferenceWebsite(user.referenceWebsite || "");
    }
  }, [user, initialData]);

  const resetForm = () => {
    setProductName("");
    setDescription("");
    setPrice(0);
    setSize("");
    setDiscount(0);
    setReferenceWebsite("");
    setCategory("");
    setSubCategory("");
    setImageFiles([]);
    setPreviewImages([]);
    setCategoryImage(null);
    setCategoryPreview("");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleCategoryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setCategoryPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (
      (!addCategory &&
        (!productName ||
          !description ||
          (!initialData && imageFiles.length === 0) ||
          !price ||
          !referenceWebsite ||
          !category)) ||
      (addCategory && (!productName || !categoryImage))
    ) {
      setSnackbarMessage("Please fill all required fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();

    if (addCategory) {
      formData.append("name", productName);
      formData.append("subcategory", subcategory);
      if (description) formData.append("description", description);
      if (referenceWebsite)
        formData.append("referenceWebsite", referenceWebsite);
      formData.append("images", categoryImage);
    } else {
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("price", price);
      formData.append(
        "actualPrice",
        ((price * (100 - discount)) / 100).toFixed(2)
      );
      formData.append("discount", discount);
      formData.append("size", size);
      formData.append("referenceWebsite", referenceWebsite);
      formData.append("category", category);
      
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      const response = initialData
        ? await apiPut(`api/product/products/${initialData._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : addCategory
        ? await apiPost("api/categories", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await apiPost("api/product/products", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if (response.status === 200) {
        setSnackbarMessage(
          addCategory
            ? "Category created successfully"
            : "Product saved successfully"
        );
        setSnackbarSeverity("success");
        setOpen(false);
        dataHandler();
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to save");
      setSnackbarSeverity("error");
    }

    setSnackbarOpen(true);
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <div>
      {initialData ? (
        <IconButton onClick={handleClickOpen}>
          <EditNoteOutlined />
        </IconButton>
      ) : user && (user.role === "admin" || user.role === "vendor") ? (
        <Button sx={{ px: 2, py: 1 }} color="primary" onClick={handleClickOpen}>
          <AddIcon /> {addCategory ? "Add Category" : "New Product"}
        </Button>
      ) : null}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: "#872d67" }}>
          {initialData
            ? "Update Product"
            :  addCategory
            ? "Add sub Category"
            : "New Product"}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ width: "400px" }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={addCategory ? "Category Name" : "Product Name"}
                variant="outlined"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Grid>

            {addCategory && (
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="subcategory-label">
                      Add Category
                    </InputLabel>
                    <Select
                      labelId="subcategory-label"
                      value={subcategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      <MenuItem value="Mobile & Tablet">Mobile & Tablet</MenuItem>
                      <MenuItem value="Computer & Peripherals">Computer & Peripherals</MenuItem>
                      <MenuItem value="Audio & Smart Home">Audio & Smart Home</MenuItem>
                      <MenuItem value="Home Appliances">Home Appliances</MenuItem>
                      <MenuItem value="Kichen Appliances">Kichen Appliances</MenuItem>
                      <MenuItem value="Wearbles & Smart Tech">Wearbles & Smart Tech</MenuItem>
                      <MenuItem value="Grooming Appliances">Grooming Appliances</MenuItem>
                      <MenuItem value="Camera & Musical">Camera & Musical</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description (optional)"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCategoryImageUpload}
                    style={{ marginTop: 8 }}
                  />
                  {categoryPreview && (
                    <img
                      src={categoryPreview}
                      alt="category-preview"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 4,
                        marginTop: 8,
                      }}
                    />
                  )}
                </Grid>
              </>
            )}

            {!addCategory && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4} // You can adjust the number of rows as needed
                  />
                </Grid>

                <Grid item xs={12}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ marginTop: 8 }}
                  />
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {previewImages.map((img, idx) => (
                      <Grid item key={idx}>
                        <img
                          src={img}
                          alt={`preview-${idx}`}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    variant="outlined"
                    type="text"
                    inputProps={{ min: 0 }}
                    value={price}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setPrice(value >= 0 ? value : 0);
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      label="Size"
                      variant="outlined"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Discount (%)"
                    variant="outlined"
                    type="text"
                    inputProps={{ min: 0 }}
                    value={discount}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setDiscount(value >= 0 ? value : 0);
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          message={snackbarMessage}
          style={{
            backgroundColor: snackbarSeverity === "success" ? "green" : "red",
          }}
        />
      </Snackbar>
    </div>
  );
};

export default ProductForm;