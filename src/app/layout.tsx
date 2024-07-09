/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomLayout from "@/components/CustomLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grime",
  description: "Grime",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body className="{inter.className} overflow-auto">
          <CustomLayout>
            <main className="">
              {children}
            </main>
          </CustomLayout>
        </body>
      </html>
    </>
  );
}
