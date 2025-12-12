"use client";

import { ReactNode } from "react";
import ProtectedClient from "@/shared/components/ProtectedClient";
import { Navbar } from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";

export default function AuthenticatedLayout({children}: {children: ReactNode}){
    return(
        <ProtectedClient>
            <div className="min-h-screen flex flex-col">
                <Navbar /> 
                    <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
                <Footer />
            </div>
        </ProtectedClient>
    )
};