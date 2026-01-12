/**
 * Route definitions for Rule Bound
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { HomePage } from '@/pages/HomePage';
import { RulesListPage } from '@/pages/RulesListPage';
import { RuleDetailPage } from '@/pages/RuleDetailPage';
import { BookmarksPage } from '@/pages/BookmarksPage';
import { SearchPage } from '@/pages/SearchPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <HomePage />
      </AppLayout>
    ),
  },
  {
    path: '/rules',
    element: (
      <AppLayout>
        <RulesListPage />
      </AppLayout>
    ),
  },
  {
    path: '/rules/:ruleId',
    element: (
      <AppLayout>
        <RuleDetailPage />
      </AppLayout>
    ),
  },
  {
    path: '/bookmarks',
    element: (
      <AppLayout>
        <BookmarksPage />
      </AppLayout>
    ),
  },
  {
    path: '/search',
    element: (
      <AppLayout>
        <SearchPage />
      </AppLayout>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
