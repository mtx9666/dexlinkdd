'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { WalletConnect } from '@/components/wallet/wallet-connect';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Menu } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  {
    name: 'Trading',
    items: [
      { name: 'Trade', href: '/trade' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Market Analysis', href: '/market-analysis' },
      { name: 'Automated Investing', href: '/automated-investing' },
    ],
  },
  {
    name: 'Trading Bots',
    items: [
      { name: 'Bot Marketplace', href: '/bots-marketplace' },
      { name: 'My Bots', href: '/my-bots' },
      { name: 'Bot Analytics', href: '/bot-analytics' },
    ],
  },
  {
    name: 'Social',
    items: [
      { name: 'Social Feed', href: '/social' },
      { name: 'Profile', href: '/profile' },
    ],
  },
  {
    name: 'Settings',
    items: [
      { name: 'Settings', href: '/settings' },
      { name: 'Help', href: '/help' },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-primary hover:text-primary/90 transition-colors font-clash-display tracking-tight">
              Dexlink
            </Link>
            <div className="hidden md:flex md:space-x-4">
              {navigation.map((group) => (
                <DropdownMenu key={group.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        pathname.startsWith(`/${group.name.toLowerCase()}`)
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {group.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {group.items.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            'w-full',
                            pathname === item.href
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          )}
                        >
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <WalletConnect />
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((group) => (
              <div key={group.name} className="space-y-1">
                <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                  {group.name}
                </div>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 text-sm',
                      pathname === item.href
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
} 