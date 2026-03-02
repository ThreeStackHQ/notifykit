import type { Metadata } from 'next';
import './globals.css';

const baseUrl = 'https://notifykit.threestack.io';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'NotifyKit — In-App Notifications That Actually Convert',
    template: '%s · NotifyKit',
  },
  description:
    'Drop-in notification center for indie SaaS. Real-time SSE stream, email fallback, and a <5KB vanilla JS widget. Knock.app at 1/10th the price.',
  keywords: [
    'in-app notifications',
    'notification center',
    'indie saas',
    'sse notifications',
    'knock alternative',
    'novu alternative',
    'bell widget',
    'real-time notifications',
  ],
  authors: [{ name: 'ThreeStack', url: baseUrl }],
  creator: 'ThreeStack',
  publisher: 'ThreeStack',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'NotifyKit',
    title: 'NotifyKit — In-App Notifications That Actually Convert',
    description:
      'Drop-in notification center for indie SaaS. Real-time SSE, email fallback, <5KB widget. $9/mo vs Knock $100+.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NotifyKit — In-App Notifications',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotifyKit — In-App Notifications That Actually Convert',
    description:
      'Drop-in notification center for indie SaaS. Real-time SSE, email fallback, <5KB widget. $9/mo vs Knock $100+.',
    images: ['/og-image.png'],
    creator: '@threestack',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
