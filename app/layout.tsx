import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Obsidian Studio — Curated Digital Assets",
  description: "Minimalist digital presets, wallpapers, and sound packs with instant crypto delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ theme: shadcn }}>
      <html lang="en" className="dark">
        <body className={`${inter.className} min-h-screen bg-zinc-950 text-zinc-100 antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
