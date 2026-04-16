import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import  AuthListener from "@/components/AuthListener";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   metadataBase: new URL("https://e-commerce-three-chi-72.vercel.app/"),
//   title: {
//     default: "ModernCommerce | Your One-Stop Shop",
//     template: "%s | ModernCommerce",
//   },
//   description: "High-quality products delivered to your door.",
//   openGraph: {
//     title: "ModernCommerce",
//     description: "Shop the latest trends in tech and fashion.",
//     url: "https://e-commerce-three-chi-72.vercel.app/",
//     siteName: "ModernCommerce",
//     images: [
//       {
//         url: "/og-default-banner.jpg", // Located in your /public folder
//         width: 1200,
//         height: 630,
//         alt: "ModernCommerce Default Storefront Image",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "ModernCommerce",
//     description: "Shop the latest trends.",
//     images: ["/og-default-banner.jpg"], 
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <AuthListener>
          {children}
          </AuthListener></body>
    </html>
  );
}
