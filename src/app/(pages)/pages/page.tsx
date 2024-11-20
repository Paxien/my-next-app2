'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPages } from '@/app/actions/pages';
import { getNavigationItems, updateNavigationItem } from '@/app/actions/navigation';
import type { PageInfo } from '@/app/actions/pages';
import type { NavItem } from '@/app/config/navigation';

export default function PagesManager() {
  const router = useRouter();
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pagesData, navData] = await Promise.all([
          getPages(),
          getNavigationItems()
        ]);
        setPages(pagesData);
        setNavItems(navData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDelete = async (pageName: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        const response = await fetch(`/api/pages/${pageName.toLowerCase()}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Refresh the page list
          const updatedPages = await getPages();
          setPages(updatedPages);
          router.refresh();
        } else {
          console.error('Failed to delete page');
        }
      } catch (error) {
        console.error('Error deleting page:', error);
      }
    }
  };

  const handleNavToggle = async (pageName: string) => {
    try {
      const pageHref = `/${pageName.toLowerCase()}`;
      const currentNavItem = navItems.find(item => item.href === pageHref);
      const newShowInNav = !currentNavItem?.showInNav;
      
      await updateNavigationItem(pageName, newShowInNav);
      
      // Refresh navigation items
      const updatedNavItems = await getNavigationItems();
      setNavItems(updatedNavItems);
      router.refresh();
    } catch (error) {
      console.error('Error updating navigation:', error);
    }
  };

  const isInNavigation = (pageName: string) => {
    const pageHref = `/${pageName.toLowerCase()}`;
    return navItems.some(item => item.href === pageHref && item.showInNav);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            Loading pages...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pages Manager</h1>
          <Link
            href="/pages/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Create New Page
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No pages found. Create your first page!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pages.map((page) => (
              <div
                key={page.path}
                className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{page.name}</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Route: {page.route}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleNavToggle(page.name)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          isInNavigation(page.name)
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {isInNavigation(page.name) ? 'In Navigation' : 'Add to Navigation'}
                      </button>
                      <div className="flex space-x-3">
                        <Link
                          href={`/pages/edit/${page.name.toLowerCase()}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(page.name)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
