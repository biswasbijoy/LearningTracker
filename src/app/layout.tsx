import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SQA Learning Tracker",
  description:
    "Track your 12-month AI-Resilient Mid-Level SQA Engineer learning journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body suppressHydrationWarning className="min-h-full font-sans">
        {children}
      </body>
    </html>
  );
}
