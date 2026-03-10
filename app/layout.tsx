import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Workspace Tag Updater",
  description: "POC tool for bulk updating workspace tags via CSV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
