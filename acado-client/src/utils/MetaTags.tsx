import React, { useEffect } from "react";

interface MetaTagsProps {
    title: string;
    description: string;
    image: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({ title, description, image }) => {
    useEffect(() => {
        document.title = title;

        const updateMetaTag = (property: string, content: string) => {
            let element = document.querySelector(`meta[property='${property}']`);
            if (element) {
                element.setAttribute("content", content);
            } else {
                const meta = document.createElement("meta");
                meta.setAttribute("property", property);
                meta.setAttribute("content", content);
                document.head.appendChild(meta);
            }
        };

        updateMetaTag("og:title", title);
        updateMetaTag("og:description", description);
        updateMetaTag("og:image", image);
        updateMetaTag("og:url", window.location.href);
    }, [title, description, image]);

    return null; // No UI needed, just updating meta tags
};

export default MetaTags;