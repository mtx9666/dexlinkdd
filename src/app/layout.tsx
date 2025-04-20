import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/navigation/navbar';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { Suspense } from 'react';
import { Inter, Outfit } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })
const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
})

export const metadata = {
  title: 'Dexlink Social Trading',
  description: 'AI-powered social trading platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${outfit.variable}`}>
        <Providers>
          <Suspense fallback={
            <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          }>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 pt-16">
                <div className="container mx-auto px-4">
                  {children}
                </div>
              </main>
              <ChatSidebar />
            </div>
          </Suspense>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
} 