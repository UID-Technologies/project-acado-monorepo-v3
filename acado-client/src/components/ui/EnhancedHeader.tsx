/**
 * Enhanced Header Component
 * 
 * Modern, professional header with glassmorphism effect
 * Features: Sticky behavior, smooth transitions, mobile-responsive
 */

import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import Logo from '@/components/template/Logo';
import Container from './Container';
import EnhancedButton from './EnhancedButton';
import { useThemeStore } from '@app/store/themeStore';
import useDarkMode from '@/utils/hooks/useDarkMode';
import { useAuth } from '@app/providers/auth';

const EnhancedHeader = () => {
  const mode = useThemeStore((state) => state.mode);
  const auth = useAuth();
  const [isDarkMode, toggleMode] = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDark = (): void => {
    toggleMode(isDarkMode ? 'light' : 'dark');
  };

  const navItems = [
    { path: '/events', label: 'Events' },
    { path: '/courses', label: 'Courses' },
    { path: '/how-to-apply', label: 'How to Apply' },
    { path: '/scholarship', label: 'Scholarships' },
    { path: '/community', label: 'Community' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-soft-md border-b border-gray-200/50 dark:border-gray-800/50'
          : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'
      )}
    >
      <Container size="xl">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105">
            <Logo imgClass="h-10 sm:h-12" mode={mode} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary-600 dark:text-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDark}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'focus:outline-none focus:ring-2 focus:ring-primary-500'
              )}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons */}
            {!auth.authenticated ? (
              <>
                <Link to="/sign-in">
                  <EnhancedButton variant="ghost" size="md">
                    Sign In
                  </EnhancedButton>
                </Link>
                <Link to="/sign-up">
                  <EnhancedButton variant="gradient" size="md" shadow>
                    Get Started
                  </EnhancedButton>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">
                  <EnhancedButton variant="outline" size="md">
                    Dashboard
                  </EnhancedButton>
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold shadow-soft-md">
                    {auth.user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'lg:hidden p-2 rounded-lg transition-all duration-200',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-primary-500'
            )}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
          'border-t border-gray-200 dark:border-gray-800',
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <Container size="xl">
          <nav className="py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary-600 dark:text-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Mobile Theme Toggle */}
            <button
              onClick={() => {
                toggleDark();
                setIsOpen(false);
              }}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-lg',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'transition-all duration-200'
              )}
            >
              <span className="text-base font-medium">Theme</span>
              <div className="flex items-center gap-2">
                {isDarkMode ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
              </div>
            </button>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 space-y-2">
              {!auth.authenticated ? (
                <>
                  <Link to="/sign-in" onClick={() => setIsOpen(false)}>
                    <EnhancedButton variant="outline" size="lg" fullWidth>
                      Sign In
                    </EnhancedButton>
                  </Link>
                  <Link to="/sign-up" onClick={() => setIsOpen(false)}>
                    <EnhancedButton variant="gradient" size="lg" fullWidth shadow>
                      Get Started
                    </EnhancedButton>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <EnhancedButton variant="primary" size="lg" fullWidth>
                    Go to Dashboard
                  </EnhancedButton>
                </Link>
              )}
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
};

export default EnhancedHeader;

