import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { SCHOOL } from "@/lib/constants";
import { getSchoolJsonLd, getBreadcrumbJsonLd } from "@/lib/metadata";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kidsplanetkullu.com"),
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
  icons: {
    icon: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
  openGraph: {
    type: "website",
    siteName: SCHOOL.name,
    title: `${SCHOOL.name} — ${SCHOOL.tagline}`,
    description: SCHOOL.description,
    url: "https://kidsplanetkullu.com",
    locale: "en_IN",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: `${SCHOOL.name} logo`,
      },
    ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getSchoolJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbJsonLd()) }}
        />
        <Header />
        <main id="main-content" className="min-h-screen pb-16 lg:pb-0">{children}</main>
        <Footer />
        <div className="hidden lg:block">
          <WhatsAppButton />
        </div>
        <BackToTop />
        <StickyMobileCTA />
      </body>
    </html>
  );
}
