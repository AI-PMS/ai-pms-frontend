import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Move viewport and themeColor to the new viewport export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1e40af',
}

export const metadata: Metadata = {
  title: 'Prison Management System',
  description: 'AI-powered Prison Management System for Ghana Security Agencies',
  manifest: '/manifest.json',
  // Remove themeColor and viewport from here
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* themeColor is now handled by the viewport export */}
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}