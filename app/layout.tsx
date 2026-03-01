// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { EpochProvider } from "../components/layout/EpochProvider";

export const metadata: Metadata = {
  title: "TEMPORALIS",
  description: "Temporal Capital Intelligence Infrastructure",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="production-bg text-[var(--text-primary)] antialiased">
        <EpochProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </EpochProvider>
      </body>
    </html>
  );
}