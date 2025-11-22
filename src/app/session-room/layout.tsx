import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seans Odası - Emel Yeşildere",
  description: "Online danışmanlık seansı odası",
};

export default function SessionRoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}