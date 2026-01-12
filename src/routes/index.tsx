/**
 * Route definitions for Rule Bound
 * Per architect specs: Hierarchical navigation with single /rules/:id route
 * Navigation flow: Home → Section → Rule → Sub-rule (all use same detail page)
 */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { HomePage } from "@/pages/HomePage";
import { RuleDetailPage } from "@/pages/RuleDetailPage";
import { BookmarksPage } from "@/pages/BookmarksPage";
import { SearchPage } from "@/pages/SearchPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <HomePage />
      </AppLayout>
    ),
  },
  {
    path: "/rules/:ruleId",
    element: (
      <AppLayout>
        <RuleDetailPage />
      </AppLayout>
    ),
  },
  {
    path: "/bookmarks",
    element: (
      <AppLayout>
        <BookmarksPage />
      </AppLayout>
    ),
  },
  {
    path: "/search",
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
