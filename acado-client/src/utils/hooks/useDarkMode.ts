import { useEffect } from 'react'
import { THEME_ENUM } from '@app/config/constants/theme.constant'
import { useThemeStore } from '@app/store/themeStore'
import type { Mode } from '@app/types/theme'

function useDarkMode(): [
    isEnabled: boolean,
    onModeChange: (mode: Mode) => void,
] {
    const mode = useThemeStore((state) => state.mode)
    const setMode = useThemeStore((state) => state.setMode)

    const { MODE_DARK, MODE_LIGHT } = THEME_ENUM

    const isEnabled = mode === MODE_DARK

    const onModeChange = (mode: Mode) => {
        setMode(mode);
        localStorage.setItem('theme', JSON.stringify({ mode }));
    }

    useEffect(() => {
        if (window === undefined) {
            return
        }

        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            const themeData = JSON.parse(savedTheme);
            // If the mode is found in the session storage, set it
            setMode(themeData.mode);
        }

        const root = window.document.documentElement
        root.classList.remove(isEnabled ? MODE_LIGHT : MODE_DARK)
        root.classList.add(isEnabled ? MODE_DARK : MODE_LIGHT)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEnabled])

    return [isEnabled, onModeChange]
}

export default useDarkMode
