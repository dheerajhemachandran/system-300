import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./component/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "System 300",
  description: "Level up your life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-500 max-w-[1440px] mx-auto">
          <div className="px-2 md:px-10 lg:px-20">
            <Navbar/>
            {children}
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}
