import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sun Moon Chat MVP Demo",
  description: "Mobile-first astrology social MVP demo with seeded onboarding, chart, matches, and chat",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Mobile viewport targeting 390x844
  themeColor: "#0a0a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen">
        <div className="demo-badge">Demo Mode</div>
        {children}
      </body>
    </html>
  );
}
