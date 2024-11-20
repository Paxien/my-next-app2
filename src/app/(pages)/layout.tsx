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
          'w-full',
          settings.backgroundColor,
          settings.textColor,
          settings.height,
          settings.isSticky && 'sticky top-0 z-50',
          settings.showShadow && 'shadow-sm',
          settings.borderBottom && 'border-b',
          settings.borderColor,
          settings.opacity !== 100 && `opacity-${settings.opacity}`,
          settings.blur && settings.blurStrength
        )}
      >
        <div className={cn(
          'flex h-full',
          settings.padding,
          'w-full mx-auto',
          settings.isBoxed ? settings.maxWidth : '',
        )}>
          <div className={cn(
            'flex w-full',
            settings.headerContentPosition,
            settings.headerContentHeight,
            settings.isBoxed ? '' : settings.maxWidth + ' mx-auto'
          )}>
            <div className={cn(
              'flex w-full',
              settings.navAlignment === 'center' ? 'justify-center' : 'justify-between'
            )}>
              <div className={cn(
                'flex-shrink-0',
                settings.logoPosition === 'center' && 'absolute left-1/2 transform -translate-x-1/2'
              )}>
                <Link href="/" className={cn("font-bold", settings.fontSize)}>
                  Logo
                </Link>
              </div>
              <nav className={cn(
                'hidden sm:flex',
                settings.navButtonSpacing,
                settings.navPadding,
                settings.navAlignment === 'center' ? 'flex-1 justify-center' : 
                settings.navAlignment === 'end' ? 'justify-end' : 'justify-start',
                settings.logoPosition === 'center' && 'relative'
              )}>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center transition-colors duration-200",
                      settings.navButtonPadding,
                      settings.fontSize,
                      settings.navRounded,
                      settings.navHoverEffect,
                      settings.navButtonVariant === 'ghost' && 'hover:bg-gray-100 dark:hover:bg-gray-700',
                      settings.navButtonVariant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                      settings.navButtonVariant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                      settings.navButtonVariant === 'outline' && 'border border-input hover:bg-accent hover:text-accent-foreground',
                      settings.navStyle === 'solid' && 'bg-gray-100 dark:bg-gray-700',
                      settings.navStyle === 'outline' && 'border border-gray-200 dark:border-gray-600',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              {settings.navAlignment === 'center' && <div className="flex-shrink-0 w-[60px]" />}
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
