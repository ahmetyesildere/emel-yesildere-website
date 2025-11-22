'use client'

import { usePathname } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppWidget from "@/components/ui/whatsapp-widget";
import CookieConsent from "@/components/ui/cookie-consent";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const isSessionRoom = pathname?.startsWith('/session-room');

  if (isSessionRoom) {
    // Session room: No header/footer, full screen
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  // Normal pages: With header/footer
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppWidget />
      <CookieConsent />
    </div>
  );
};

export default LayoutWrapper;