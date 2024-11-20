'use server';

import { readdirSync } from 'fs';
import { join } from 'path';

export interface PageInfo {
  name: string;
  path: string;
  route: string;
}

export async function getPages(): Promise<PageInfo[]> {
  const pagesDir = join(process.cwd(), 'src/app/(pages)');
  const entries = readdirSync(pagesDir, { withFileTypes: true });
  
  return entries
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('pages'))
    .map(dir => ({
      name: dir.name.charAt(0).toUpperCase() + dir.name.slice(1),
      path: join(pagesDir, dir.name),
      route: `/${dir.name}`
    }));
}
