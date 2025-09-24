import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/client-providers";
import LayoutWrapper from "@/components/layout/layout-wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Emel Yeşildere - Duygu Temizliği & Holistik Koçluk",
  description: "Duygu temizliği ve travma iyileştirme uzmanı. Holistik koçluk hizmetleri ile kişisel dönüşüm ve iyileşme yolculuğunuzda yanınızdayım.",
  keywords: "duygu temizliği, travma iyileştirme, holistik koçluk, yaşam koçluğu, kişisel gelişim, terapi, danışmanlık",
  authors: [{ name: "Emel Yeşildere" }],
  creator: "Ahmet Yeşildere",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://emelyesildere.com",
    title: "Emel Yeşildere - Duygu Temizliği & Holistik Koçluk",
    description: "Duygu temizliği ve travma iyileştirme uzmanı. Holistik koçluk hizmetleri ile kişisel dönüşüm ve iyileşme yolculuğunuzda yanınızdayım.",
    siteName: "Emel Yeşildere",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emel Yeşildere - Duygu Temizliği & Holistik Koçluk",
    description: "Duygu temizliği ve travma iyileştirme uzmanı. Holistik koçluk hizmetleri ile kişisel dönüşüm ve iyileşme yolculuğunuzda yanınızdayım.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
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
