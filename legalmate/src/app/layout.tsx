import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import HeaderWithLanguage from "@/components/HeaderWithLanguage";
import { LanguageProvider } from "@/components/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <LanguageProvider>
        <html lang="he" dir="rtl">
          <body className="bg-[#0e0e13] text-white antialiased">
            <HeaderWithLanguage />
            <main>{children}</main>
          </body>
        </html>
      </LanguageProvider>
    </ClerkProvider>
  );
}
