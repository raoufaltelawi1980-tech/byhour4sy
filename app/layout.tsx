import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/app/components/SiteHeader";

export const metadata: Metadata = {
  title: "بالساعة | سوق يومي للخدمات والسلع والوظائف في سوريا",
  description: "ابحث، اختر، احجز، أنجز — منصة بالساعة لخدماتك اليومية في سوريا",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-arabic min-h-screen">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
