import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const font = Plus_Jakarta_Sans({ variable: "--font-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Planet Studio — Kids Planet", template: "%s | Planet Studio" },
  description: "School management dashboard for Kids Planet, Kullu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
      <body className="min-h-screen">
        <Sidebar />
        <main className="lg:ml-64 min-h-screen p-6 pt-16 lg:pt-6">
          {children}
        </main>
      </body>
    </html>
  );
}
