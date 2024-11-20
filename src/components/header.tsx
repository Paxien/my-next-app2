'use client';

import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/canvas-4', label: 'Canvas 4' },
    { href: '/canvas-3', label: 'Canvas 3' },
    { href: '/canvas-2', label: 'Canvas 2' },
    { href: '/canvas-1', label: 'Canvas 1' },
  ];

  return (
    <header className={cn("border-b bg-background", className)}>
      <div className="flex h-14 items-center px-4 gap-4">
        <MenuIcon className="h-6 w-6" />
        <nav className="flex items-center gap-4 text-sm">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
