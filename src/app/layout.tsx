import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";

const worksans = Work_Sans({
  variable: "--font-work-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`min-h-screen bg-gray-50 ${worksans.className}`}>
        <Navbar/>
        <main className="">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
