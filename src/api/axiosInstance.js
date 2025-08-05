import axios from "axios";
import { HandleAxiosError } from "./axioserror";


const axiosInstance = axios.create({
  // baseURL: "https://api.jajamblockprints.com", // Replace with your actual base URL
  // baseURL: "http://localhost:5008", // Replace with your actual base URL
  baseURL: "https://server.digihubtech.in", // Replace with your actual base URL
  headers: {
    "Content-Type": "application/json",
     },
});
//backend kha h
// Request Interceptor
axiosInstance.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers["authorization"] = `Bearer ${String(token)}`;
  }
  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (res) => {
    if (res.data?.data?.accessToken) {
      sessionStorage.setItem("accessToken", res.data.data.accessToken);
    }
    return res;
  },
  (err) => {
    HandleAxiosError(err)// Call the error handler function
    return Promise.reject(err);
  }
);



export { axiosInstance };




