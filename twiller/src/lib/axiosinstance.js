import axios from "axios";

const axiosInstance = axios.create({
    // baseURL: process.env.BACKEND_URL,
    // headers: {
        //     "Content-Type":"application/json"
        // }
    baseURL: "http://localhost:5000",
    withCredentials: false,
});

export default axiosInstance;