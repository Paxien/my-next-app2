export interface NavItem {
  name: string;
  href: string;
  showInNav: boolean;
}

export interface NavConfig {
  items: NavItem[];
}

export const defaultNavItems: NavItem[] = [
  { name: 'Home', href: '/home', showInNav: true },
  { name: 'Dashboard', href: '/dashboard', showInNav: true },
  { name: 'About', href: '/about', showInNav: true },
  { name: 'Pages', href: '/pages', showInNav: true },
];
