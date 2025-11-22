import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/client-providers";
import LayoutWrapper from "@/components/layout/layout-wrapper";
import { LocalBusinessSchema, PersonSchema, WebsiteSchema } from "@/components/seo/structured-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://emelyesildere.com'),
  title: {
    default: "Emel Yeşildere - Duygu Temizliği & Yaşam Koçluğu | Bandırma",
    template: "%s | Emel Yeşildere"
  },
  description: "Duygu temizliği ve travma iyileştirme uzmanı. Online ve yüz yüze seanslar. Bandırma, Balıkesir. Kişisel gelişim, ilişki koçluğu, kariyer danışmanlığı.",
  keywords: [
    "duygu temizliği",
    "travma iyileştirme", 
    "yaşam koçluğu",
    "kişisel gelişim",
    "online terapi",
    "Bandırma psikolog",
    "Balıkesir yaşam koçu",
    "ilişki koçluğu",
    "kariyer koçluğu",
    "stres yönetimi",
    "Emel Yeşildere"
  ],
  authors: [{ name: "Emel Yeşildere", url: "https://emelyesildere.com" }],
  creator: "Emel Yeşildere",
  publisher: "Emel Yeşildere",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://emelyesildere.com",
    title: "Emel Yeşildere - Duygu Temizliği & Yaşam Koçluğu",
    description: "Duygu temizliği ve travma iyileştirme uzmanı. Online ve yüz yüze seanslar. Bandırma, Balıkesir.",
    siteName: "Emel Yeşildere",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Emel Yeşildere - Duygu Temizliği & Yaşam Koçluğu"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Emel Yeşildere - Duygu Temizliği & Yaşam Koçluğu",
    description: "Duygu temizliği ve travma iyileştirme uzmanı. Online ve yüz yüze seanslar.",
    images: ["/og-image.jpg"],
    creator: "@emelyesildere"
  },
  alternates: {
    canonical: "https://emelyesildere.com"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <LocalBusinessSchema />
        <PersonSchema />
        <WebsiteSchema />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProviders>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ClientProviders>
      </body>
    </html>
  );
}
