import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { buildOrganizationSchema } from "@/lib/seo/schema-org";
import { getGlobalSiteInfo } from "@/lib/site/global-site-info";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Arcanine Tecnologia",
  description: "Site corporativo com painel administrativo",
};

const globalSiteInfo = getGlobalSiteInfo();
const organizationSchema = buildOrganizationSchema({
  companyName: globalSiteInfo.companyName,
  email: globalSiteInfo.email,
  phone: globalSiteInfo.phone,
  websiteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <JsonLd data={organizationSchema} />
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
