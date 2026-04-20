'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PackageSearch, ShoppingBag, ClipboardList, Zap } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md supports-backdrop-filter:bg-white/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6 max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight group">
          <div className="p-2 rounded-lg bg-black dark:bg-white group-hover:shadow-lg transition-shadow">
            <PackageSearch className="w-5 h-5 text-white dark:text-black" />
          </div>
          <span className="text-black dark:text-white">Shop</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
          >
            Products
          </Link>

          {isAuthenticated && (
            <>
              {user?.role !== 'admin' && (
                <Link
                  href="/orders"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                >
                  My Orders
                </Link>
              )}

              <Link
                href="/cart"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Cart
              </Link>

              {user?.role === 'admin' && (
                <Link
                  href="/admin/orders"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:block text-sm text-right">
                <p className="text-slate-600 dark:text-slate-400">Welcome,</p>
                <p className="font-semibold text-slate-900 dark:text-white">{user?.username}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="text-xs">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
