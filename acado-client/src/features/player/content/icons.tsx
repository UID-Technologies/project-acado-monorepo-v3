/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 21 March 2025
@author:: Edulyst Ventures  
@purpose : This component is used to show the icons for the content type
@dependency : This component is dependent on the content_type to set the icon for the content type

@@ Use case (if any use case) and solutions 

**/


import { BookOpenCheck, Headphones, Link, Notebook, Video } from 'lucide-react';
import { JSX } from 'react';

type ContentType = 'video' | 'notes' | 'assignment' | 'assessment' | 'zoomclass' | 'liveclass' | 'offlineclass' | 'video_yts' | 'audio' | 'scorm' | 'survey' | 'text' | 'external_link';

interface ContentTypeIconsProps {
    content_type: ContentType;
}

const ContentTypeIcons: React.FC<ContentTypeIconsProps> = ({ content_type }) => {
    const icons: Record<ContentType, JSX.Element> = {
        video: <Video className='text-red-600' />,
        notes: <Notebook className='text-blue-700' />,
        assignment: (
            <svg xmlns="http://www.w3.org/2000/svg" className='h-6' viewBox="0 0 24.00 24.00" fill="none">
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                    <path d="M19.9994 19.2601H10.9294C10.4794 19.2601 10.1094 18.8901 10.1094 18.4401C10.1094 17.9901 10.4794 17.6201 10.9294 17.6201H19.9994C20.4494 17.6201 20.8194 17.9901 20.8194 18.4401C20.8194 18.9001 20.4494 19.2601 19.9994 19.2601Z" fill="#aa0bf4" /> <path d="M19.9994 12.9701H10.9294C10.4794 12.9701 10.1094 12.6001 10.1094 12.1501C10.1094 11.7001 10.4794 11.3301 10.9294 11.3301H19.9994C20.4494 11.3301 20.8194 11.7001 20.8194 12.1501C20.8194 12.6001 20.4494 12.9701 19.9994 12.9701Z" fill="#aa0bf4" /> <path d="M19.9994 6.66979H10.9294C10.4794 6.66979 10.1094 6.29978 10.1094 5.84978C10.1094 5.39978 10.4794 5.02979 10.9294 5.02979H19.9994C20.4494 5.02979 20.8194 5.39978 20.8194 5.84978C20.8194 6.29978 20.4494 6.66979 19.9994 6.66979Z" fill="#aa0bf4" /> <path opacity="0.4" d="M4.90969 8.02992C4.68969 8.02992 4.47969 7.93992 4.32969 7.78992L3.41969 6.87992C3.09969 6.55992 3.09969 6.03992 3.41969 5.71992C3.73969 5.39992 4.25969 5.39992 4.57969 5.71992L4.90969 6.04992L7.04969 3.90992C7.36969 3.58992 7.88969 3.58992 8.20969 3.90992C8.52969 4.22992 8.52969 4.74992 8.20969 5.06992L5.48969 7.78992C5.32969 7.93992 5.12969 8.02992 4.90969 8.02992Z" fill="#aa0bf4" /> <path opacity="0.4" d="M4.90969 14.3302C4.69969 14.3302 4.48969 14.2502 4.32969 14.0902L3.41969 13.1802C3.09969 12.8602 3.09969 12.3402 3.41969 12.0202C3.73969 11.7002 4.25969 11.7002 4.57969 12.0202L4.90969 12.3502L7.04969 10.2102C7.36969 9.89021 7.88969 9.89021 8.20969 10.2102C8.52969 10.5302 8.52969 11.0502 8.20969 11.3702L5.48969 14.0902C5.32969 14.2502 5.11969 14.3302 4.90969 14.3302Z" fill="#aa0bf4" /> <path opacity="0.4" d="M4.90969 20.3302C4.69969 20.3302 4.48969 20.2502 4.32969 20.0902L3.41969 19.1802C3.09969 18.8602 3.09969 18.3402 3.41969 18.0202C3.73969 17.7002 4.25969 17.7002 4.57969 18.0202L4.90969 18.3502L7.04969 16.2102C7.36969 15.8902 7.88969 15.8902 8.20969 16.2102C8.52969 16.5302 8.52969 17.0502 8.20969 17.3702L5.48969 20.0902C5.32969 20.2502 5.11969 20.3302 4.90969 20.3302Z" fill="#aa0bf4" /> </g>
            </svg>
        ),
        assessment: <BookOpenCheck className="text-pink-700" />,
        zoomclass: (
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48" className='h-6'>
                <circle cx="24" cy="24" r="20" fill="#2196f3"></circle><path fill="#fff" d="M29,31H14c-1.657,0-3-1.343-3-3V17h15c1.657,0,3,1.343,3,3V31z"></path><polygon fill="#fff" points="37,31 31,27 31,21 37,17"></polygon>
            </svg>
        ),
        liveclass: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-presentation-icon lucide-presentation"><path d="M2 3h20" /><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" /><path d="m7 21 5-5 5 5" /></svg>
        ),
        offlineclass: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-presentation-icon lucide-presentation"><path d="M2 3h20" /><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" /><path d="m7 21 5-5 5 5" /></svg>
        ),
        video_yts: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-youtube text-red-600" viewBox="0 0 16 16">
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
            </svg>
        ),
        audio: <Headphones className='text-purple-700' />,
        scorm: (
            <svg xmlns="http://www.w3.org/2000/svg" className='h-6' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM8.5 16.5a1.5 1.5 0 1 1-1.5-1.5a1.5 1.5 0 0 1 1.5 1.5zm7-3a1.5 1.5 0 1 1-1.5-1.5a1.5 1.5 0 0 1 1.5 1.5z" />
                <path d="M12 6a6 6 0 0 0-6 6" />
                <path d="M12 12a6 6 0 0 0 6-6" />
                <path d="M12 18a6 6 0 0 0-6-6" />
                <path d="M12 12a6 6 0 0 0 6 6" />
            </svg>
        ),
        survey: (
            <svg xmlns="http://www.w3.org/2000/svg" className='h-6' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM8.5 16.5a1.5 1.5 0 1 1-1.5-1.5a1.5 1.5 0 0 1 1.5 1.5zm7-3a1.5 1.5 0 1 1-1.5-1.5a1.5 1.5 0 0 1 1.5 1.5z" />
                <path d="M12 6a6 6 0 0 0-6 6" />
                <path d="M12 12a6 6 0 0 0 6-6" />
                <path d="M12 18a6 6 0 0 0-6-6" />
                <path d="M12 12a6 6 0 0 0 6 6" />
            </svg>
        ),
        text: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-text-icon lucide-text text-cyan-500"><path d="M15 18H3" /><path d="M17 6H3" /><path d="M21 12H3" /></svg>
        ),
        external_link: (
            <Link />
        )
    };

    return icons[content_type] || null;
};

export default ContentTypeIcons;