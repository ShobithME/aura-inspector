import type { Metadata, Viewport } from "next";
import "./globals.css";
import EmberField from "@/components/EmberField";
import NavBar from "@/components/NavBar";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "🔥 Aura Inspector — Official Aura Inspection Bureau",
  description:
    "Inspect your aura using the world's most advanced aura inspection bureau. Discover your Aura Score, Rank, and Verdict.",
  keywords: [
    "Aura Inspector",
    "Aura Scanner",
    "Aura Test",
    "Aura Score",
    "Aura Detector",
    "Gen Z Aura",
  ],
  metadataBase: new URL("https://aura-inspector.vercel.app"),
  openGraph: {
    title: "🔥 Aura Inspector",
    description:
      "Inspect your aura using the world's most advanced aura inspection bureau.",
    url: "https://aura-inspector.vercel.app",
    siteName: "Aura Inspector",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "🔥 Aura Inspector",
    description:
      "Inspect your aura using the world's most advanced aura inspection bureau.",
    creator: "@shobith_lark",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

// themeColor moved to viewport export to fix Next.js metadata warning
export const viewport: Viewport = {
  themeColor: "#FF6B00",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Caveat:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void-grid antialiased min-h-screen overflow-x-hidden">
        <EmberField />
        <NavBar />
        <main className="relative z-10 pt-28 pb-16 min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
