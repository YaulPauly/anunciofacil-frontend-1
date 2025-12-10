export const ROUTES = {
    HOME: "/",
    ADS: "/ads",
    AD_DETAIL: (id:string) => `/ads/${id}`,
    CATEGORY: (slug: string) => `/category/${slug}`,
    AUTH: {
        LOGIN: "/login",
        REGISTER:"/register",
    },
    PROFILE: {
        ROOT: "/profile",
        MY_ADS: "/profile/my-ads",
    },
    ADMIN: {
        ROOT: "/admin",
        DASHBOARD: "/admin/dashboard",
        USERS: "/admin/users",
        CONFIG: "/admin/config",
    },
} as const;