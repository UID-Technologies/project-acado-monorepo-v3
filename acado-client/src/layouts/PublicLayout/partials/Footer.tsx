import React, { useState } from 'react'
import type { CommonProps } from '@app/types/common'
import Logo from '@/components/template/Logo'
import { FaSun, FaMoon } from 'react-icons/fa'
import useDarkMode from '@/utils/hooks/useDarkMode'
import { Link } from 'react-router-dom'
import { FaLinkedin, FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa'

const Footer = () => {
    const [isDarkMode, toggleMode] = useDarkMode()
    const [triggered, settriggered] = useState<boolean>(false)
    const toggleDark = (): void => {
        toggleMode(isDarkMode ? 'light' : 'dark')
    }
    const helpbutton = () => {
        settriggered((item) => !item)
    }
    return (
        <footer className="bg-[#7041F3] py-4">
            {/* Logo Section */}
            <div className="w-full mb-4 flex justify-center items-center p-8">
                <Logo imgClass="h-12 mx-auto" mode={isDarkMode ? 'dark' : 'dark'} />
            </div>

            {/* Navigation Links */}
            <div className="container mx-auto text-center text-white px-4">
                <div className="flex flex-wrap justify-center items-center gap-4 text-sm pb-4">
                    <Link to="/register" className="cursor-pointer">Register/Login</Link>
                    <Link to="/courses" className="cursor-pointer">Explore Courses</Link>
                    <Link to="/talent-finder" className="cursor-pointer">Try Talent Finder</Link>
                    <Link to="/community" className="cursor-pointer">Join Community</Link>
                    <Link to="/portfolio" className="cursor-pointer">Build Portfolio</Link>
                    <Link to="/policy" className="cursor-pointer">Privacy Policy</Link>
                </div>

                {/* Social Links - Only Visible on Mobile */}
                <div className="flex justify-center gap-4 mt-4 md:hidden">
                    <a href="https://www.linkedin.com/in/adado-ai-b49721342" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={24} className="text-white hover:text-gray-300 transition duration-300" />
                    </a>
                    <a href="https://facebook.com/acadoai" target="_blank" rel="noopener noreferrer">
                        <FaFacebook size={24} className="text-white hover:text-gray-300 transition duration-300" />
                    </a>
                    <a href="https://youtube.com/@acadoai" target="_blank" rel="noopener noreferrer">
                        <FaYoutube size={24} className="text-white hover:text-gray-300 transition duration-300" />
                    </a>
                    <a href="https://www.instagram.com/acadoai" target="_blank" rel="noopener noreferrer">
                        <FaInstagram size={24} className="text-white hover:text-gray-300 transition duration-300" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
