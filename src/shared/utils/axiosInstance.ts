import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const env = process.env;

const axiosInstance = axios.create({
    baseURL: env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5173/api',
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config)=> {
    const token = useAuthStore.getState().token;
    if(token && config.headers){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default axiosInstance;