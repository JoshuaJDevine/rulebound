/**
 * Header Component
 * Top navigation bar with Riftbound branding
 * Dark blue background, Cinzel logo, gold accents
 */

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { SearchInput } from "@/components/ui";
import { useDarkMode } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { resolvedMode, toggleDarkMode } = useDarkMode();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <header
      className="sticky top-0 z-50 bg-primary-900 border-b border-primary-700"
      role="banner"
    >
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
        {/* Logo - Cinzel font, white with gold hover */}
        <Link
          to="/"
          className="text-xl md:text-2xl font-display font-semibold text-white hover:text-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded px-1 tracking-wider transition-colors"
          aria-label="Rule Bound Home"
        >
          RULE BOUND
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Main navigation"
        >
          <Link
            to="/rules"
            className={cn(
              "font-body text-sm transition-colors px-2 py-1 rounded",
              "focus:outline-none focus:ring-2 focus:ring-accent-500",
              location.pathname === "/rules"
                ? "text-white underline decoration-accent-500 decoration-2 underline-offset-4"
                : "text-primary-100 hover:text-white hover:underline hover:decoration-accent-500 hover:decoration-2 hover:underline-offset-4",
            )}
          >
            Browse
          </Link>
          <Link
            to="/bookmarks"
            className={cn(
              "font-body text-sm transition-colors px-2 py-1 rounded",
              "focus:outline-none focus:ring-2 focus:ring-accent-500",
              location.pathname === "/bookmarks"
                ? "text-white underline decoration-accent-500 decoration-2 underline-offset-4"
                : "text-primary-100 hover:text-white hover:underline hover:decoration-accent-500 hover:decoration-2 hover:underline-offset-4",
            )}
          >
            Bookmarks
          </Link>
        </nav>

        {/* Search - desktop full, mobile icon */}
        <div className="flex-1 max-w-md hidden md:block">
          <SearchInput
            value={searchQuery}
            onChange={handleSearch}
            onClear={handleClear}
          />
        </div>

        {/* Mobile search icon */}
        <button
          className="md:hidden h-10 w-10 flex items-center justify-center text-primary-300 hover:text-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded transition-colors"
          onClick={() => navigate("/search")}
          aria-label="Search rules"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Mobile bookmarks icon */}
        <Link
          to="/bookmarks"
          className="md:hidden h-10 w-10 flex items-center justify-center text-primary-300 hover:text-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded transition-colors"
          aria-label="Bookmarks"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="h-10 w-10 flex items-center justify-center text-white hover:text-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded transition-colors"
          aria-label={
            resolvedMode === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={
            resolvedMode === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {resolvedMode === "dark" ? (
            // Sun icon for light mode
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
