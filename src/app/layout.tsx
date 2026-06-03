import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Socialfin — Ad Creatives",
  description: "Socialfin Ad Creatives Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
