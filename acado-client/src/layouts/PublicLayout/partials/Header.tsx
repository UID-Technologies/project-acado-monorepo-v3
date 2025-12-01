import Logo from '@/components/template/Logo'
import { Button } from '@/components/ui'
import Container from '@/components/shared/Container'
import { useThemeStore } from '@app/store/themeStore'
import useDarkMode from '@/utils/hooks/useDarkMode'
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi' // Menu icons
import { useAuth } from '@app/providers/auth'

const Header = () => {

    const mode = useThemeStore((state) => state.mode);
    const auth = useAuth();
    const [isDarkMode, toggleMode] = useDarkMode();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDark = (): void => {
        toggleMode(isDarkMode ? 'light' : 'dark');
    }

    return (
        <div className="sticky top-0 z-50 border-b bg-white dark:bg-dark dark:border-none">
            <Container>
                <div className="flex w-full justify-between items-center p-4">
                    {/* Logo and Desktop Nav */}
                    <div className="flex w-full items-center justify-between gap-5">
                        <Link to="/">
                            <Logo imgClass="h-12" mode={mode} />
                        </Link>

                        <div className="flex gap-4 items-center">
                            <div className="hidden md:flex gap-4 items-center">
                                {/* Desktop Navigation (UNCHANGED) */}
                                <ul className="flex space-x-4">
                                    {[
                                        'events',
                                        'courses',
                                        'how-to-apply',
                                        'scholarship',
                                        'community',
                                        'privacy-policy',
                                    ].map((route) => (
                                        <li
                                            key={route}
                                            className="font-bold text-textLight dark:text-textDark"
                                        >
                                            <NavLink
                                                to={`/${route}`}
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? 'text-primary capitalize dark:text-primary'
                                                        : 'text-textLight capitalize dark:text-textDark'
                                                }
                                            >
                                                {route.replaceAll('-', ' ')}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div
                                className={`hidden md:flex items-center justify-between py-1 shadow-inner rounded-full cursor-pointer w-9 h-5 p-1 transition-all ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                                    }`}
                                onClick={() => {
                                    toggleDark()
                                    setIsOpen(false)
                                }}
                            >
                                <span
                                    className={`h-3 w-3 rounded-full transition-all ${isDarkMode
                                        ? 'translate-x-4 bg-gray-600'
                                        : 'translate-x-0 bg-white'
                                        }`}
                                />
                            </div>

                            {/* Register/Login & Apply Now */}
                            <div className="hidden md:flex gap-2">
                                {!auth?.authenticated && <Link to="/sign-in">
                                    <Button
                                        variant="solid"
                                        className="rounded-md text-ac-dark"
                                    >
                                        Register/Login
                                    </Button>
                                </Link>
                                }
                                {auth?.authenticated && <Link to="/dashboard">
                                    <Button
                                        variant="solid"
                                        className="rounded-md text-ac-dark"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(true)}>
                            <FiMenu size={24} />
                        </button>
                    </div>
                </div>
            </Container>

            {/* Mobile Side Menu */}
            <div
                className={`fixed top-0 right-0 w-64 h-screen bg-white dark:bg-dark shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Close Button */}
                <div className="flex justify-end p-4">
                    <button onClick={() => setIsOpen(false)}>
                        <FiX size={24} />
                    </button>
                </div>

                {/* Menu Items */}
                <ul className="flex flex-col space-y-4 p-4">
                    {[
                        'events',
                        'courses',
                        'how-to-apply',
                        'scholarship',
                        'volunteer',
                        'community',
                        'privacy-policy',
                    ].map((route) => (
                        <li
                            key={route}
                            className="font-bold capitalize text-textLight dark:text-textDark"
                        >
                            <NavLink
                                to={`/${route}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {route.replaceAll('-', ' ')}{' '}
                                {/* Now replaces all hyphens */}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Spacer to push buttons to bottom */}
                <div className="flex-grow" />

                {/* Buttons (Register/Login & Apply Now) */}
                <div className="p-4 space-y-2">
                    {!auth?.authenticated && <Link to="/sign-in">
                        <Button
                            variant="solid"
                            className="w-full rounded-md text-ac-dark mb-3"
                            onClick={() => setIsOpen(false)}
                        >
                            Register/Login
                        </Button>
                    </Link>}
                    {
                        auth?.authenticated && <Link to="/dashboard">
                            <Button
                                variant="solid"
                                className="w-full rounded-md text-ac-dark mb-3"
                                onClick={() => setIsOpen(false)}
                            >
                                Dashboard
                            </Button>
                        </Link>
                    }
                </div>

                {/* Dark Mode Toggle */}
                <div className="p-4 flex items-center justify-between border-t">
                    <span className="text-xl">
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                    <div
                        className={`flex items-center justify-between py-1 shadow-inner rounded-full cursor-pointer w-9 h-5 p-1 transition-all ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                            }`}
                        onClick={() => {
                            toggleDark()
                            setIsOpen(false)
                        }}
                    >
                        <span
                            className={`h-3 w-3 rounded-full transition-all ${isDarkMode
                                ? 'translate-x-4 bg-gray-600'
                                : 'translate-x-0 bg-white'
                                }`}
                        />
                    </div>
                </div>
            </div>

            {/* Backdrop (Click to Close) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}

export default Header
