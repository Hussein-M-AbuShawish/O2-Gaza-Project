import React from "react"
import type { Metadata, Viewport } from 'next'
import { Tajawal, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { BranchProvider } from '@/lib/branch-context'
import { CartProvider } from "@/lib/cart-context"
import { AmbientBackground } from "@/components/ambient-background"
import './globals.css'

const _tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: '--font-tajawal',
});

const _geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://o2company.com'),
  title: {
    default: 'مطعم أوتو غزة | O2 Company',
    template: '%s | مطعم أوتو غزة'
  },
  description: 'مطعم أوتو غزة (O2) - نكهة تجمع بين الأصالة والحداثة. استكشف المنيو واطلب الآن.',
  
  // إعدادات الـ OpenGraph (التي يستخدمها Instagram و Facebook)
  openGraph: {
    title: 'مطعم أوتو غزة | O2 Gaza Resturant',
    description: 'تجربة طعام فاخرة في قلب غزة. تابعونا لاكتشاف أحدث الأطباق والعروض.',
    url: 'https://o2company.com',
    siteName: 'O2 Company',
    images: [
      {
        url: '/O2.png', // هذه الصورة ستظهر عند مشاركة الرابط في Instagram Direct
        width: 1200,
        height: 630,
        alt: 'مطعم أوتو غزة',
      },
    ],
    locale: 'ar_PS',
    type: 'website',
  },

  // تحسين الأيقونات
  icons: {
    icon: '/O2.png',
    apple: '/apple-icon.png', // ضروري جداً لتجربة مستخدم متكاملة
  },
}

export const viewport: Viewport = {
  themeColor: '#141414',
  width: 'device-width',
  initialScale: 1,
}

// بيانات الـ Schema لتعريف محركات البحث بموقع المطعم الجغرافي
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Company",
  "name": "O2 Company",
  "image": "https://o2company.com/O2.png",
  "url": "https://o2company.com",
  "servesCuisine": "International",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Gaza",
    "addressCountry": "PS"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${_tajawal.variable} ${_geistMono.variable}`}>
      <head>
        <link rel="preload" as="image" href="/path/to/above-the-fold-image.jpg" fetchPriority="high" />
        <link rel="preload" as="style" href="/path/to/critical.css" />
        <link rel="preload" as="font" href="/fonts/your-font.woff2" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <BranchProvider>
          <CartProvider>
            <AmbientBackground />
            <div className="relative z-10">
              {children}
            </div>
            <Analytics />
          </CartProvider>
        </BranchProvider>
      </body>
    </html>
  )
}