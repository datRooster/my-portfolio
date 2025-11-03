import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/ui/Footer";
import WebchatWidget from "@/components/ui/WebchatWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "theWebRooster - Portfolio",
  description: "Portfolio personale di theWebRooster - Progetti, Bug Bounty, Servizi di Consulenza",
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
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 mb-16">
            {children}
          </main>
          <Footer />
          <WebchatWidget />
        </div>
      </body>
    </html>
  );
}
