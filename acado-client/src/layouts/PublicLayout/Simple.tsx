/* eslint-disable react-hooks/exhaustive-deps */
import { cloneElement, useEffect, useState } from 'react'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@app/types/common'
import Header from './partials/Header'
import Footer from './partials/Footer'
import { useLocation } from "react-router-dom";
import SocialLinks from './partials/SocialLinks';
import { useThemeStore } from '@app/store/themeStore'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children, content }: SimpleProps) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const getQueryParam = (key: string) => queryParams.get(key);

    // Detect if the page is inside an iframe
    const isIframe = window.self !== window.top;

    // Theme and visibility states
    const { setMode } = useThemeStore((state) => state)
    const [hideHeader, setHideHeader] = useState(false);
    const [hideFooter, setHideFooter] = useState(false);

    useEffect(() => {
        if (isIframe) {
            // If inside an iframe, force light mode and hide header/footer
            setMode("light");  // Force light theme
            setHideHeader(true);
            setHideFooter(true);
        } else {
            // Handle based on query parameters or stored settings
            const headerParam = getQueryParam("header");
            const footerParam = getQueryParam("footer");

            if (headerParam === "0") {
                setHideHeader(true);
            }

            if (footerParam === "0") {
                setHideFooter(true);
            }
        }
    }, [location, isIframe]);

    return (
        <div className="h-full">
            {!hideHeader && <Header />}
            <main className='dark:bg-dark bg-[#F7FBFC] pb-12 min-h-screen'>
                {content}
                {children
                    ? cloneElement(children as ReactElement)
                    : null}
            </main>
            {!hideFooter && <Footer />}
            <SocialLinks></SocialLinks>
        </div>
    )
}

export default Simple;
