import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SCHOOL } from "@/lib/constants";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SCHOOL.name} — ${SCHOOL.tagline}`,
    template: `%s | ${SCHOOL.name}`,
  },
  description: SCHOOL.description,
  keywords: [
    "Kids Planet",
    "school in Kullu",
    "Kullu Valley school",
    "HPBOSE school",
    "playgroup Kullu",
    "best school Kullu",
  ],
  openGraph: {
    type: "website",
    siteName: SCHOOL.name,
    title: `${SCHOOL.name} — ${SCHOOL.tagline}`,
    description: SCHOOL.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
