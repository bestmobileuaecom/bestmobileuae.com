import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Best Mobile UAE - Compare Mobile Phone Prices in UAE",
  description:
    "Compare mobile phone prices from top UAE retailers. Find the best deals on iPhones, Samsung, Xiaomi, and more with expert reviews and UAE-specific pricing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
