'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Trade', href: '/trade' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Social', href: '/social' },
  { name: 'Settings', href: '/settings' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Only show the UI after mounting to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">Dexlink</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {mounted && <ConnectButton />}
          </div>
        </div>
      </div>
    </nav>
  );
} 