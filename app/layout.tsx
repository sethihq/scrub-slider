import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/hooks/use-theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "scrub-slider",
  description: "A slider component with scrub sounds and haptic feedback. Built with Radix UI, NumberFlow, Web Audio API, and web-haptics.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "scrub-slider",
    description: "A slider component with scrub sounds and haptic feedback.",
    url: "https://scrub-slider.vercel.app",
    siteName: "scrub-slider",
    type: "website",
    images: [
      {
        url: "https://scrub-slider.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "scrub slider — A slider with scrub sounds and haptic feedback.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "scrub-slider",
    description: "A slider component with scrub sounds and haptic feedback.",
    images: ["https://scrub-slider.vercel.app/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem("scrub-slider-theme");var d=t==="light"?"light":t==="system"?window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light":"dark";if(d==="dark")document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark")}catch(e){}})()` }} />
      </head>
      <body className="min-h-screen font-sans">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
