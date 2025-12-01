import type { CommonProps } from '@app/types/common'
import LayoutBase from '@/components//template/LayoutBase'
import UserProfileDropdown from '@/components//template/UserProfileDropdown'
import Header from '@/components/template/Header'
import MobileNav from '@/components/template/MobileNav'
import SideNav from '@/components/template/SideNav'
import SideNavToggle from '@/components/template/SideNavToggle'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@app/config/constants/theme.constant'
import useDarkMode from '@/utils/hooks/useDarkMode'
import useResponsive from '@/utils/hooks/useResponsive'
import { Calendar1 } from 'lucide-react'
import { FaMoon, FaSun } from "react-icons/fa"
import { ImProfile } from 'react-icons/im'
import { NavLink } from 'react-router-dom'
import { useThemeStore } from '@app/store/themeStore'
import React, { useEffect } from 'react'

const CollapsibleSideHideMenu = ({ children }: CommonProps) => {
    const { larger, smaller } = useResponsive()

    const [isDarkMode, toggleMode] = useDarkMode();
    const toggleDark = (): void => {
        toggleMode(isDarkMode ? 'light' : 'dark');
    }

    // setSideNavCollapse true
    const setSideNavCollapse = useThemeStore((state) => state.setSideNavCollapse);
    useEffect(() => {
        if (larger.lg)
            setSideNavCollapse(true)
    }, [setSideNavCollapse])


    return (
        <LayoutBase
            type={LAYOUT_COLLAPSIBLE_SIDE}
            className="app-layout-collapsible-side flex flex-auto flex-col"
        >
            <div className="flex flex-auto min-w-0">
                {larger.lg && <SideNav />}
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        className="shadow dark:shadow-2xl"
                        headerStart={
                            <>
                                {smaller.lg && <MobileNav />}
                                {larger.lg && <SideNavToggle />}
                                <ul className='md:flex gap-5 hidden'>
                                    <li>
                                        <NavLink
                                            to="/courses-list"
                                            className={({ isActive }) =>
                                                `hover:text-primary hover:dark:text-primary ${isActive ? 'text-primary' : 'dark:text-gray-300'}`
                                            }
                                        >
                                            Courses
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/universities-list"
                                            className={({ isActive }) =>
                                                `hover:text-primary hover:dark:text-primary ${isActive ? 'text-primary' : 'dark:text-gray-300'}`
                                            }
                                        >
                                            Universities
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/communities"
                                            className={({ isActive }) =>
                                                `hover:text-primary hover:dark:text-primary ${isActive ? 'text-primary' : 'dark:text-gray-300'}`
                                            }
                                        >
                                            Communities
                                        </NavLink>
                                    </li>
                                    {/* events */}
                                    <li>
                                        <NavLink
                                            to="/internship"
                                            className={({ isActive }) =>
                                                `hover:text-primary hover:dark:text-primary ${isActive ? 'text-primary' : 'dark:text-gray-300'}`
                                            }
                                        >
                                            Internship
                                        </NavLink>
                                    </li>
                                    {/* volunteering */}
                                    <li>
                                        <NavLink
                                            to="/volunteering"
                                            className={({ isActive }) =>
                                                `hover:text-primary hover:dark:text-primary ${isActive ? 'text-primary' : 'dark:text-gray-300'}`
                                            }
                                        >
                                            Volunteering
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/learner-scholarship"
                                            className={({ isActive }) =>
                                                `hover:text-primary hover:dark:text-primary ${isActive ? 'text-primary' : 'dark:text-gray-300'}`
                                            }
                                        >
                                            Scholarship
                                        </NavLink>
                                    </li>
                                    
                                </ul>
                            </>
                        }
                        headerEnd={
                            <>
                                <div className="flex items-center space-x-2 mr-4">
                                    <NavLink
                                        to="/portfolio"
                                        className={({ isActive }) =>
                                            `my-0 btn btn-primary text-xl hover:text-primary bg-gray-200 dark:bg-gray-700 p-2 rounded-lg ${isActive ? 'text-primary' : ''}`
                                        }
                                    >
                                        <ImProfile size={20} />
                                    </NavLink>
                                    <NavLink
                                        to="/calender"
                                        className={({ isActive }) =>
                                            `my-0 btn btn-primary bg-gray-200 dark:bg-gray-700 p-2 rounded-lg text-xl hover:text-primary ${isActive ? 'text-primary' : ''}`
                                        }
                                    >
                                        <Calendar1 size={20} />
                                    </NavLink>
                                    <button className="btn btn-primary text-xl hover:text-primary bg-gray-200 dark:bg-gray-700 p-2 rounded-lg" onClick={toggleDark}>
                                        {isDarkMode ? <FaSun /> : <FaMoon />}
                                    </button>
                                </div>
                                <UserProfileDropdown hoverable={false} />
                            </>
                        }
                    />
                    <div className="h-full flex flex-auto flex-col">
                        {children}
                    </div>
                </div>
            </div>
        </LayoutBase>
    )
}

export default CollapsibleSideHideMenu