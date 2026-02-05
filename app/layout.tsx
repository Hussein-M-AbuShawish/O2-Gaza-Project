import React from "react"
import type { Metadata, Viewport } from 'next'
import { Tajawal, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { BranchProvider } from '@/lib/branch-context'
import { CartProvider } from "@/lib/cart-context"
import './globals.css'

const _tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"]
});
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'O2 Gaza Restaurant | مطعم أوتو غزة',
  description: 'مطعم أوتو غزة - تجربة طعام استثنائية تجمع بين الأصالة والحداثة. استمتع بأشهى المأكولات في أجواء راقية.',
  generator: 'v0.app',
  icons: {
    icon: [
      
      {
        url: '/O2.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/O2.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/O2.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#141414',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`font-sans antialiased`}>
        <BranchProvider>
          <CartProvider>
            {children}
            <Analytics />
          </CartProvider>
        </BranchProvider>
      </body>
    </html>
  )
}
