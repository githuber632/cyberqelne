import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "CyberQELN — Esports Платформа СНГ",
    template: "%s | CyberQELN",
  },
  description:
    "Главная киберспортивная экосистема СНГ. Турниры, команды, игроки, медиа и магазин.",
  keywords: [
    "киберспорт",
    "esports",
    "турниры",
    "MLBB",
    "Mobile Legends",
    "CIS esports",
    "CyberQELN",
  ],
  authors: [{ name: "CyberQELN Team" }],
  creator: "CyberQELN",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://cyberqeln.com",
    title: "CyberQELN — Esports Платформа СНГ",
    description: "Главная киберспортивная экосистема СНГ",
    siteName: "CyberQELN",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberQELN",
    description: "Главная киберспортивная экосистема СНГ",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-cyber-black antialiased">
        <Providers>
          {/* Ambient background glow */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-purple opacity-10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyber-neon-pink opacity-8 rounded-full blur-[100px]" />
          </div>

          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
