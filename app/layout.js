import "./globals.css";

import CartSheet from "./components/CartSheet";
import { CartProvider } from "./components/CartContext";
import SiteNav from "./components/SiteNav";

export const metadata = {
  title: "APEX11",
  description: "APEX11 — Gear up. Play fearless.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <SiteNav />
          {children}
          <CartSheet />
        </CartProvider>
      </body>
    </html>
  );
}
