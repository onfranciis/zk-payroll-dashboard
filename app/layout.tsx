import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZK Payroll Dashboard",
  description: "A zero-knowledge payroll dashboard application.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
