import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Depok Hyperlocal Marketplace",
  description: "Discover and post products/services near you instantly.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Depok Hyperlocal",
  },
};

export const viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>{children}</body>
    </html>
  );
}
