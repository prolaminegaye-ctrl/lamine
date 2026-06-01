import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ETAGIA — Plateforme LMS Africaine',
  description: 'Formation en ligne pour les professionnels africains',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@1,400;1,500;1,600&family=Archivo:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full" style={{ fontFamily: 'var(--sans)' }}>{children}</body>
    </html>
  )
}
