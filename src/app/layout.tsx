import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Poppins as PoppinsFont } from 'next/font/google'
import './globals.css'

const Poppins = PoppinsFont({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
})

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  viewportFit: 'cover',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9f7f7' },
    { media: '(prefers-color-scheme: dark)', color: '#1f1f1f' }
  ]
}

export const metadata: Metadata = {
  title: 'Golden Duck',
  description:
    'Una banca online donde podrá, no solo gestionar su dinero, sino que incluso invertirlo. Siempre llevando un registro de cuanto dinero es ingresado y cuanto dinero es gastado, contando con categorías para saber en qué lo gasta. También podrá pagar servicios, tales como servicios de Telefonía Móvil o servicios esenciales.',
  authors: {
    name: 'Lycokat',
    url: 'https://lycokat.netlify.app/'
  },
  category: 'Virtual Wallet',
  creator: 'Lycokat',
  generator: 'Next.js',
  manifest: '/manifest.json',
  publisher: 'Vercel'
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="es">
      <body className={Poppins.className}>{children}</body>
    </html>
  )
}
