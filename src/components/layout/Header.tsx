/**
 * Header Component
 * Top navigation bar with logo, search, and primary actions
 */

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SearchInput } from '@/components/ui';

export function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200" role="banner">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded px-1"
          aria-label="Rule Bound Home"
        >
          Rule Bound
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4" aria-label="Main navigation">
          <Link
            to="/rules"
            className="text-neutral-700 hover:text-neutral-900 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded px-2 py-1"
          >
            Browse
          </Link>
          <Link
            to="/bookmarks"
            className="text-neutral-700 hover:text-neutral-900 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded px-2 py-1"
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
          className="md:hidden h-10 w-10 flex items-center justify-center text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded"
          onClick={() => navigate('/search')}
          aria-label="Search rules"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="md:hidden h-10 w-10 flex items-center justify-center text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded"
          aria-label="Bookmarks"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
