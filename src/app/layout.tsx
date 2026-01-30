import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Book Cover 3D Mockup Generator',
  description: 'Generate realistic 3D book mockups from your cover images',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
