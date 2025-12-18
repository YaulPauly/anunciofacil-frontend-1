import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const env = process.env;

const axiosInstance = axios.create({
    baseURL: env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5173/api',
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config)=> {
    let token = useAuthStore.getState().token;

    // Fallback: si el store aún no está hidratado, intenta leer desde localStorage en cliente
    if (!token && typeof window !== "undefined") {
        try {
            const persisted = localStorage.getItem("anuncia-facil-auth");
            if (persisted) {
                const parsed = JSON.parse(persisted);
                token = parsed?.state?.token;
            }
        } catch {
            // ignore
        }
    }

    if(token && config.headers){
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Si enviamos FormData, dejamos que el browser defina el boundary
    if (config.data instanceof FormData && config.headers) {
        delete config.headers["Content-Type"];
    }
    return config;
})

export default axiosInstance;
