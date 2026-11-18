import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className={`${geistSans.className} bg-zinc-950 text-zinc-50 antialiased`}>
        <Suspense fallback={null}>
          <ClerkProvider appearance={{ theme: shadcn }}>
            {children}
          </ClerkProvider>
        </Suspense>
      </body>
    </html>
  );
}
