'use client';

import Link from 'next/link';
import { useHeaderSettings } from '@/lib/store/header-settings-store';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { defaultNavItems } from '@/app/config/navigation';
import type { NavItem } from '@/app/config/navigation';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useHeaderSettings();
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);

  useEffect(() => {
    const loadNavItems = async () => {
      try {
        const response = await fetch('/api/navigation');
        if (response.ok) {
          const items = await response.json();
          setNavItems(items.filter((item: NavItem) => item.showInNav));
        }
      } catch (error) {
        console.error('Failed to load navigation items:', error);
        // Fallback to default items
        setNavItems(defaultNavItems.filter(item => item.showInNav));
      }
    };
    loadNavItems();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className={cn(
        settings.backgroundColor,
        settings.textColor,
        settings.height,
        'w-full',
        settings.isSticky && 'sticky top-0 z-50',
        settings.showShadow && 'shadow'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-full">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className={cn("font-bold", settings.fontSize)}>
                  Logo
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("inline-flex items-center px-1 pt-1", settings.fontSize)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
}
