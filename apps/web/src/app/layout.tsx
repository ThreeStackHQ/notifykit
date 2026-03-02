import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NotifyKit — In-app notification center',
  description: 'Drop-in notification center for indie SaaS. Knock.app at 1/10th the price.',
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
