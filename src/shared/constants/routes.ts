export const ROUTES = {
    //Rutas públicas
    HOME: "/",
    ADS: "/ads",
    AD_DETAIL: (id:string) => `/ads/${id}`,
    CATEGORY: (slug: string) => `/category/${slug}`,
    CONTACT: "/contact",
    //RUTA PROTEGIDA
    CREATE_AD: "/ads/create",
    // RUTAS DE AUTENTICACION
    AUTH: {
        LOGIN: "/login",
        REGISTER:"/register",
    },
    // RUTAS DE PERFIL
    PROFILE: {
        ROOT: "/profile",
        MY_ADS: "/profile/my-ads",
    },
    //RUTAS DE ADMIN
    ADMIN: {
        ROOT: "/dashboard",
        USERS: "/dashboard/users",
        CONFIG: "/dashboard/config",
    },
} as const;