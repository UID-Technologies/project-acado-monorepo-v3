import { FaLinkedin, FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa'
import type { CommonProps } from '@app/types/common'
import { useThemeStore } from '@app/store/themeStore'
import useDarkMode from '@/utils/hooks/useDarkMode'

const SocialLinks = ({}: CommonProps) => {
    const mode = useThemeStore((state) => state.mode)
    const [isDarkMode, toggleMode] = useDarkMode()

    const toggleDark = (): void => {
        toggleMode(isDarkMode ? 'light' : 'dark')
    }

    return (
        <div className="hidden md:flex fixed bottom-5 right-5 flex-col gap-3 z-50">
            <a
                href="https://www.linkedin.com/in/adado-ai-b49721342"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full dark:text-textLight text-textDark shadow-lg transition duration-300 bg-primary"
            >
                <FaLinkedin size={20} />
            </a>
            <a
                href="https://facebook.com/acadoai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full dark:text-textLight text-textDark shadow-lg transition duration-300 bg-primary"
            >
                <FaFacebook size={20} />
            </a>
            <a
                href="https://youtube.com/@acadoai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full dark:text-textLight text-textDark shadow-lg transition duration-300 bg-primary"
            >
                <FaYoutube size={20} />
            </a>
            <a
                href="https://www.instagram.com/acadoai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full dark:text-textLight text-textDark shadow-lg transition duration-300 bg-primary"
            >
                <FaInstagram size={20} />
            </a>
        </div>
    )
}

export default SocialLinks
