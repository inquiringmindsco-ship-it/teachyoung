import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Overstood — Understand anything instantly",
  description: "Type or snap anything. Get a clear explanation. Made for people who are tired of not knowing how things work.",
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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%23FF6B35'/><stop offset='100%25' stop-color='%23FFD700'/></linearGradient></defs><rect width='100' height='100' rx='22' fill='url(%23g)'/><text x='50' y='68' font-size='52' text-anchor='middle' fill='white' font-family='system-ui' font-weight='bold'>O</text></svg>" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
