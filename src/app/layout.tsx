import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteName, siteUrl } from "@/lib/site";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";
import "./globals.css";

// Variable fonts supplied by the designer; the italic files sit alongside them
// unreferenced until something actually needs italics.
const interTight = localFont({
  src: "./fonts/InterTight-VariableFont_wght.ttf",
  variable: "--font-inter-tight",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-VariableFont_wght.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

/**
 * What holds for the whole site. `metadataBase` is what lets every page below
 * name its canonical address and its picture with a path rather than a host, and
 * the template is what puts the name at the end of every title without each page
 * having to remember to.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s — ${siteName}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: siteName,
  robots: { index: true, follow: true },
  openGraph: { siteName, type: "website" },
  formatDetection: { telephone: false, address: false, email: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${interTight.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* The design is drawn at 1920: past that the page stays centred and the
          gutters show through as white rather than stretching every band. */}
      <body className="mx-auto flex min-h-full w-full max-w-[1920px] flex-col">
        {children}
      </body>
    </html>
  );
}
