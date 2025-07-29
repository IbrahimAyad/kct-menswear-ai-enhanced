import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Providers } from "@/components/providers/Providers";
import { AIStyleAssistant } from "@/components/ai/AIStyleAssistant";
import { SimpleCartDrawer } from "@/components/cart/SimpleCartDrawer";

export const metadata: Metadata = {
  title: "KCT Menswear - Premium Men's Formal Wear",
  description: "Elevate your style with premium men's formal wear and expert tailoring. Shop suits, wedding attire, and occasion-based bundles.",
  keywords: "mens suits, formal wear, wedding suits, tuxedos, dress shirts, tailoring, Detroit menswear",
  openGraph: {
    title: "KCT Menswear - Premium Men's Formal Wear",
    description: "Elevate your style with premium men's formal wear and expert tailoring",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
          <SimpleCartDrawer />
          <AIStyleAssistant />
        </Providers>
      </body>
    </html>
  );
}
