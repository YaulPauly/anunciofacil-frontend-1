"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/useAuthStore";
import { ROUTES } from "@/shared/constants/routes";
import { Spinner } from "./ui/spinner";
import { useShallow } from "zustand/shallow";

export default function ProtectedClient({children}: {children: ReactNode}){
    const router = useRouter();
    const { token, isHydrated } = useAuthStore(useShallow((state) => ({
        token: state.token,
        isHydrated: state.isHydrated,
    })));

    useEffect(() => {
        if(isHydrated && !token){
            router.push(ROUTES.AUTH.LOGIN);
        }
    },[token,isHydrated, router]);

    if(!token || !isHydrated){
        return <Spinner/>;
    }

    return<>{children}</>;
}