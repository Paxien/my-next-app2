'use client';

import Link from 'next/link';
import { useHeaderSettings } from '@/lib/store/header-settings-store';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { getNavigationItems } from '../actions/navigation';
import type { NavItem } from '../config/navigation';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useHeaderSettings();
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    const loadNavItems = async () => {
      const items = await getNavigationItems();
      setNavItems(items.filter(item => item.showInNav));
    };
    loadNavItems();
  }, []);

  const headerStyle = {
    height: settings.height === 'custom' ? `${settings.customHeight}px` : undefined,
    opacity: settings.opacity / 100,
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav 
        className={cn(
          settings.backgroundColor,
          settings.textColor,
          settings.height !== 'custom' && settings.height,
          'w-full transition-all duration-200',
          settings.isSticky && 'sticky top-0 z-50',
          settings.showShadow && 'shadow-md',
          settings.borderBottom && 'border-b',
          settings.borderColor,
          settings.blur && settings.blurStrength
        )}
        style={headerStyle}
      >
        <div className={cn(
          'mx-auto',
          settings.isBoxed ? settings.maxWidth : '',
          settings.padding
        )}>
          <div className={cn(
            'flex h-full items-center',
            settings.contentAlignment
          )}>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Link href="/" className={cn("font-bold", settings.fontSize)}>
                  Logo
                </Link>
              </div>
              <div className="hidden sm:flex sm:space-x-8">
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
      <div className={cn(
        'flex-1',
        settings.isBoxed && settings.maxWidth,
        settings.isBoxed && 'mx-auto'
      )}>
        {children}
      </div>
    </div>
  );
}
