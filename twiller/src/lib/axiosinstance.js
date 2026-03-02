import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://twiller-2-0-t0ez.onrender.com",
  withCredentials: true,
});

export default axiosInstance;