/**
 * AppLayout Component
 * Root layout component wrapping all pages with header, main content, and navigation
 */

import { SkipLink } from "@/components/ui";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

export interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      <SkipLink targetId="main-content" />
      <Header />
      <main
        id="main-content"
        className="flex-1 pb-20 md:pb-8"
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
