import { useState, useEffect, useCallback } from "react";

export const useFullScreen = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const enterFullScreen = useCallback(() => {
        document.documentElement.requestFullscreen();
    }, []);

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullScreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
    }, []);

    return { isFullScreen, enterFullScreen };
};
