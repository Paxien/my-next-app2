'use server';

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { defaultNavItems, type NavItem } from '../config/navigation';

const NAV_CONFIG_PATH = join(process.cwd(), 'src/app/config/nav-config.json');

export async function getNavigationItems(): Promise<NavItem[]> {
  try {
    const content = await readFile(NAV_CONFIG_PATH, 'utf-8');
    return JSON.parse(content).items;
  } catch (error) {
    // If file doesn't exist, create it with default items
    await writeFile(NAV_CONFIG_PATH, JSON.stringify({ items: defaultNavItems }, null, 2));
    return defaultNavItems;
  }
}

export async function updateNavigationItem(pageName: string, showInNav: boolean): Promise<void> {
  const items = await getNavigationItems();
  const pageHref = `/${pageName.toLowerCase()}`;
  
  const existingIndex = items.findIndex(item => item.href === pageHref);
  
  if (existingIndex !== -1) {
    items[existingIndex].showInNav = showInNav;
  } else if (showInNav) {
    items.push({
      name: pageName,
      href: pageHref,
      showInNav: true
    });
  }

  await writeFile(NAV_CONFIG_PATH, JSON.stringify({ items }, null, 2));
}
