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

const BannerForm = ({ dataHandler, initialData, websites }) => {
  const [open, setOpen] = useState(false);
  const [bannerName, setBannerName] = useState("");
  const [description, setDescription] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [referenceWebsite, setReferenceWebsite] = useState("");
  const [position, setPosition] = useState("homepage-top");
  const [deviceType, setDeviceType] = useState("both");
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { user } = useUser();

  useEffect(() => {
    if (initialData) {
      setBannerName(initialData?.bannerName || "");
      setDescription(initialData.description || "");
      setCustomPrice(initialData.description || "");
      setReferenceWebsite(initialData?.referenceWebsite || "");
      setPosition(initialData?.position || "homepage-top");
      setDeviceType(initialData?.deviceType || "both");
      setPreviewImages(initialData?.images || []);
    } else {
      resetForm();
    }
  }, [initialData]);

  useEffect(() => {
    if (user) {
      setReferenceWebsite(user.referenceWebsite);
    }
  }, [user]);

  const resetForm = () => {
    setBannerName("");
    setDescription("");
    setReferenceWebsite("");
    setPosition("homepage-top");
    setDeviceType("both");
    setImageFiles([]);
    setPreviewImages([]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async () => {
    const finalDescription =
      description === "customPrice" ? `maxPrice=${customPrice}` : description;
    if (
      !bannerName ||
      !finalDescription ||
      imageFiles.length === 0 ||
      !referenceWebsite ||
      !position ||
      !deviceType
    ) {
      setSnackbarMessage("Please fill all required fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("bannerName", bannerName);
    formData.append("description", finalDescription);
    formData.append("referenceWebsite", referenceWebsite);
    formData.append("position", position);
    formData.append("deviceType", deviceType);

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = initialData
        ? await apiPut(`api/banners/${initialData._id}`, formData, {
            // headers: { "Content-Type": "multipart/form-data" },
          })
        : await apiPost("api/banners/create", formData, {
            // headers: { "Content-Type": "multipart/form-data" },
          });

      if (response.status === 200) {
        setSnackbarMessage("Banner saved successfully");
        setSnackbarSeverity("success");
        setOpen(false);
        dataHandler();
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to save banner");
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
          <AddIcon /> New Banner
        </Button>
      ) : null}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: "#872d67" }}>
          {initialData ? "Update Banner" : "New Banner"}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} style={{ width: "400px" }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Banner Name"
                variant="outlined"
                value={bannerName}
                onChange={(e) => setBannerName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Filter Tag</InputLabel>
                <Select
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  label="Filter tag"
                >
                  <MenuItem value="kalmkari-print-fabric">
                    Kalmkari Print Fabric
                  </MenuItem>
                  <MenuItem value="cotton-mal-mal-saree">
                    Cotton mal mal saree
                  </MenuItem>
                  <MenuItem value="chanderi-silk-saree">
                    Chanderi Silk saree
                  </MenuItem>
                  <MenuItem value="maheswari-silk-saree">
                    Maheswari Silk saree
                  </MenuItem>
                  <MenuItem value="kota-doriya-saree">
                    Kota Doriya Saree
                  </MenuItem>
                  <MenuItem value="cotton-suit">Cotton Suit</MenuItem>
                  <MenuItem value="sanganeri-print-fabric">
                    Sanganeri Print Fabric
                  </MenuItem>
                  <MenuItem value="dabu-print-fabric">
                    Dabu Print Fabric
                  </MenuItem>
                  <MenuItem value="bagru-print">Bagru Print</MenuItem>
                  <MenuItem value="cotton-suit-in-kota">
                    Cotton Suit In Kota
                  </MenuItem>
                  <MenuItem value="chanderi-silk-suits">
                    Chanderi Silk Suits
                  </MenuItem>
                  <MenuItem value="maheshwari-silk-suits">
                    Maheshwari Silk Suits
                  </MenuItem>
                  <MenuItem value="newArrival">New Arrivals</MenuItem>
                  <MenuItem value="customPrice">Custom Price</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {description === "customPrice" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Enter Custom Price"
                  variant="outlined"
                  type="text"
                  inputProps={{ min: 0 }}
                  value={customPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setCustomPrice(value);
                    }
                  }}
                />
              </Grid>
            )}

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

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Position</InputLabel>
                <Select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  label="Position"
                >
                  <MenuItem value="homepage-top">Homepage Top</MenuItem>
                  <MenuItem value="homepage-bottom">Homepage Bottom</MenuItem>
                  <MenuItem value="sidebar">Sidebar</MenuItem>
                  <MenuItem value="footer">Footer</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Device Type</InputLabel>
                <Select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  label="deviceType"
                >
                  {/* <MenuItem value="both">Both</MenuItem> */}
                  <MenuItem value="mobile">Mobile</MenuItem>
                  <MenuItem value="desktop">Desktop</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Website</InputLabel>
                <Select
                  value={referenceWebsite}
                  onChange={(e) => setReferenceWebsite(e.target.value)}
                >
                  {websites.map((site) => (
                    <MenuItem key={site._id} value={site._id}>
                      {site.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
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

export default BannerForm;
