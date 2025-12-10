"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/useAuthStore";

export default function ProtectedClient({children}: {children: ReactNode}){
    const router = useRouter();
    const token = useAuthStore((s)=>s.token);

    useEffect(() => {
        if(!token){
            router.push("/login");
        }
    },[token, router]);

    if(!token){
        return null;
    }

    return<>{children}</>;
}