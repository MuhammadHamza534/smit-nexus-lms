import type { Metadata } from "next";
import "./globals.css";
import { LmsProvider } from "@/components/LmsProvider";

export const metadata: Metadata = {
  title: "SMIT Nexus LMS",
  description: "Student, Trainer and Admin Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LmsProvider>{children}</LmsProvider>
      </body>
    </html>
  );
}