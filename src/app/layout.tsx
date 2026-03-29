import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import OfflineBanner from '@/components/OfflineBanner';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  other: {
    'impact-site-verification': '83e48a77-c5ab-47c9-9417-9970f50e7ff7',
  },
  title: 'Pupular — Swipe to Adopt Pets Near You',
  description: 'Swipe to adopt pets near you. Browse real dogs & cats from local shelters, take a personality quiz, and connect with rescues. Free on iOS.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pupular',
  },
  openGraph: {
    title: 'Pupular — Swipe to Adopt Pets Near You',
    description: 'Browse real adoptable dogs & cats from local shelters. Swipe, match, and connect with rescues near you. Free on iOS.',
    url: 'https://www.pupular.app',
    siteName: 'Pupular',
    images: [
      {
        url: 'https://www.pupular.app/screenshots/screenshot-1-hero.png',
        width: 1290,
        height: 2796,
        alt: 'Pupular — Swipe through adoptable pets near you',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pupular — Swipe to Adopt Pets Near You',
    description: 'Browse real adoptable dogs & cats from local shelters. Swipe, match, and connect with rescues near you.',
    images: ['https://www.pupular.app/screenshots/screenshot-1-hero.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f6f7f4',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <head>
        <link rel="preconnect" href="https://api.rescuegroups.org" />
        <link rel="dns-prefetch" href="https://api.rescuegroups.org" />
      </head>
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-sage-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <ServiceWorkerRegistration />
        <OfflineBanner />
        {children}
      </body>
    </html>
  );
}
