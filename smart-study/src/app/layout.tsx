import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import PageTransition from "@/components/shared/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudySmart - AI-Powered Learning Platform",
  description:
    "Unlock your full potential with personalized learning paths and real-time AI assistance. StudySmart adapts to your pace and provides the support you need to succeed.",
  keywords:
    "AI learning, personalized education, study platform, adaptive learning, online education",
  authors: [{ name: "StudySmart Team" }],
  openGraph: {
    title: "StudySmart - AI-Powered Learning Platform",
    description:
      "Transform your learning experience with AI-powered personalized education",
    type: "website",
  },
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
        <StoreProvider>
          <PageTransition>{children}</PageTransition>
        </StoreProvider>
      </body>
    </html>
  );
}
