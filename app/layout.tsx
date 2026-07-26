import type { Metadata } from 'next';
import React from 'react';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Cipher AI',
  description: 'Multi-model AI Chat with File Upload, Image Support & Web Builder',
  icons: {
    icon: '🔐',
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
