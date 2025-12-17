import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const env = process.env;

const axiosInstance = axios.create({
    baseURL: env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5173/api',
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config)=> {
    let token = useAuthStore.getState().token;

    // SSR: intenta leer token desde cookies si no está en el store (p.ej. primera carga después de login)
    if (!token && typeof window === "undefined") {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { cookies } = require("next/headers");
            token = cookies().get("auth-token")?.value;
        } catch {
            // ignore; no cookies available
        }
    }

    if(token && config.headers){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default axiosInstance;
