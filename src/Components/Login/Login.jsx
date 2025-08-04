import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Link,
  Paper,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import assetimg from "../../assets/images/Login.gif";
import logo from "../../assets/images/logo.png";
import { apiPost } from "../../api/apiMethods";
import { useUser } from "../../Context/UserContext";

const API_ENDPOINT = `api/auth/admin_login`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
    const { initializeUser } = useUser();

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await apiPost(API_ENDPOINT, { email, password });
      const { accessToken, refreshToken, userData } = response.data;
      if (userData.role === "admin" || userData.role === 'vendor' || userData.role === 'super-admin') {
        if (accessToken && refreshToken) {
          sessionStorage.setItem("accessToken", accessToken);
          sessionStorage.setItem("refreshToken", refreshToken);
          const expirationTime = new Date().getTime() + (rememberMe ? 24 : 1) * 60 * 60 * 1000;
          sessionStorage.setItem("expirationTime", expirationTime);
          setSnackbarMessage("Login successful!");
          setOpenSnackbar(true);
          setTimeout(() => {
            navigate("/");
            initializeUser()
          }, 2000);
        } else {
          throw new Error("Access token or refresh token is missing.");
        }
      } else {
        setSnackbarMessage("Login failed. Only admin can log in.");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setSnackbarMessage("Login failed. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Left side image */}
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", sm: "flex" },
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={assetimg}
                alt="Login"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Box>

            {/* Right side form */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: { xs: 2, sm: 0 },
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: 2,
                  width: "100%",
                  maxWidth: "400px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    position: "relative",
                  }}
                >
                   <Typography
                  component="h1"
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: 700, marginTop: "0px" }}
                >
                  Admin Panel
                </Typography>
                  {/* <img
                    src={logo}
                    alt="Logo"
                    style={{
                      position: "absolute",
                      bottom: "-1px",
                      height: "90px",
                    }}
                  /> */}
                </Box>
                <Typography
                  component="h1"
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 700, marginTop: "0px" }}
                >
                  Log In
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleLogin}
                  sx={{ width: "100%" }}
                >
                  <TextField
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Id"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    }
                    label="Remember me"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        color: "#1976d2",
                        "&:hover": {
                          color: "black",
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link
                        href="#"
                        variant="body2"
                        sx={{
                          color: "#1976d2",
                          textDecoration: "none",
                          "&:hover": { color: "black" },
                        }}
                      >
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link
                        href="#"
                        variant="body2"
                        sx={{
                          color: "#1976d2",
                          textDecoration: "none",
                          "&:hover": { color: "black" },
                        }}
                      >
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarMessage.includes("failed") ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

export default Login;
