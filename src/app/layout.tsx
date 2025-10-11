import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { QueryProvider } from "@/lib/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spirare - Gerador de Meditações",
  description: "Crie meditações personalizadas para nutrir sua mente e espírito",
  applicationName: "Spirare",
  icons: {
    icon: "/icon.svg",
    shortcut: "/spirare-mark.svg",
    apple: "/icon.svg",
    other: [{ rel: "mask-icon", url: "/spirare-mark.svg", color: "#10b981" }],
  },
};

export const viewport = {
  themeColor: "#fef3c7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-amber-200`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
