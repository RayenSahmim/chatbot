import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/Providers/SessionProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/Providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatbot",
  description: "A chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
        <ThemeProvider
          attribute="class"
          value={{
            light: "light",
            dark: "dark",
          }}
        >
        {children}
        </ThemeProvider>
        </Providers>
        <Toaster />

      </body>
      
    </html>
  );
}
