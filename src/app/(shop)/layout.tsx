import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/ui/header";
import { AuthProvider } from "@/providers/auth";
import Footer from "@/components/ui/footer";
import CartProvider from "@/providers/cart";
import { Toaster } from "sonner";
import { SessionHandler } from "@/components/session-handler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PC Store",
  description: "Loja de computadores",
  icons: {
    icon: "/computer-logo.png",
    apple: "/computer-logo.png"
  }
}; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-full flex-col">
          <AuthProvider>
            <CartProvider>
              <SessionHandler />
              <Header />
              <div className="flex-1">{children}</div>
              <Toaster />
              <Footer />
            </CartProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
