import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "theJsonApi",
  description: "Made by Abhishek Gusain",
  icons:{
    icon: '/icon.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    appearance={{
      layout: {
        logoImageUrl: '/icon.png',
        socialButtonsVariant: 'iconButton'
      },
      variables:{
        colorText: 'black',
        colorPrimary: '#0E78F9',
        colorBackground: '#ffffff',
        colorInputBackground: '#ffffff',
        colorInputText: 'black'
      }
    }}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
