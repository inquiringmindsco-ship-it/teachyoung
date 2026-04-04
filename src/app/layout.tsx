import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeachYoung™ PHOENIX EDITION | Peak Performance Learning for Black Children",
  description: "The ultimate culturally-rooted peak performance learning system designed for the holistic development of Black children—mind, body, and spirit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
