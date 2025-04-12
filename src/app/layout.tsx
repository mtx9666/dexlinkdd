import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import { Navbar } from '@/components/navigation/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dexlink Social Trading',
  description: 'Decentralized social trading platform with AI-powered HFT bot integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <div className="pt-16">{children}</div>
        </Providers>
      </body>
    </html>
  );
} 