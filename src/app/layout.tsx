import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAT0X01 INVESTIGATIOONS",
  description: "Local-first intelligence investigation workspace.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
