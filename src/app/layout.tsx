import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import { GuestSessionProvider } from "@/providers/GuestSessionContext";
import 'swiper/css';
import 'swiper/css/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movies App",
  description: "Movies app description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`antialiased`}>
    <GuestSessionProvider>
    <Header />
    <main className="p-6 mt-16">{children}</main>
    </GuestSessionProvider>
    </body>
    </html>
    );
}
