import type { Metadata } from "next";
<<<<<<< HEAD
import "./globals.css";

=======
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
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
<<<<<<< HEAD
      <body className="antialiased">{children}</body>
=======
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
    </html>
  );
}
