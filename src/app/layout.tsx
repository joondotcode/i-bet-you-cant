import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from "@/components/theme-provider";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://i-bet-you-cant.vercel.app'),
  title: "I Bet You Can't - Psychology-Powered Habit Building",
  description: "The only habit app that puts your money where your mouth is. Stake $15, complete every day, or lose it all. 73% success rate using loss aversion psychology.",
  keywords: ["habit tracker", "accountability", "psychology", "loss aversion", "habit building", "financial stakes"],
  authors: [{ name: "I Bet You Can't Team" }],
  openGraph: {
    title: "I Bet You Can't - Turn Your Habits Into Reality",
    description: "The psychology-powered habit app with a 73% success rate. Financial stakes create real commitment.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "I Bet You Can't - Psychology-Powered Habit Building",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "I Bet You Can't - Psychology-Powered Habit Building",
    description: "The only habit app that puts your money where your mouth is. 73% success rate.",
    images: ["/og-image.png"],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: RootLayoutProps) {
  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            defaultTheme="system"
            storageKey="i-bet-you-cant-theme"
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
