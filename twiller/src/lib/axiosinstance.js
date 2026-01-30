import axios from "axios";

const axiosInstance = axios.create({
    // baseURL: process.env.BACKEND_URL,
    // headers: {
        //     "Content-Type":"application/json"
        // }
    // baseURL: "http://localhost:5000",
    baseURL: "https://twiller-2-0-t0ez.onrender.com/",
    withCredentials: false,
});

export default axiosInstance;