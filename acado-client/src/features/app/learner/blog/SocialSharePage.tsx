import { Twitter, Github, Linkedin, Share2 } from 'lucide-react';
import React, { useState } from 'react';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface SocialShareProps {
  socialLinks: SocialLink[];
  title: string;
}

export function SocialShare({ socialLinks, title }: SocialShareProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const encodedTitle = encodeURIComponent(title);

  const getShareUrl = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodedTitle}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`;
      default:
        return '';
    }
  };

  const getIcon = (iconName: string) => {
    const iconClass = "h-4 w-4 dark:text-primary text-gray-700";
    switch (iconName.toLowerCase()) {
      case 'twitter':
        return <Twitter className={iconClass} />;
      case 'github':
        return <Github className={iconClass} />;
      case 'linkedin':
        return <Linkedin className={iconClass} />;
      default:
        return <Share2 className={iconClass} />;
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center">
      {socialLinks.map((link) => (
        <button
          key={link.platform}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          onClick={() => window.open(getShareUrl(link.platform) || link.url, '_blank')}
        >
          {getIcon(link.icon)}
          <span className="sr-only">Share on {link.platform}</span>
        </button>
      ))}
      {/* Custom Dropdown Button */}
      <div className="relative">
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="More sharing options"
          onClick={toggleDropdown}
        >
          <Share2 className="h-4 w-4 dark:text-primary text-gray-700" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
            <button
              className="cursor-pointer block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                closeDropdown();
              }}
            >
              Copy link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const socialLinks = [
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/janesmith', icon: 'linkedin' },
  { platform: 'GitHub', url: 'https://github.com/janesmith', icon: 'github' },
  { platform: 'Twitter', url: 'https://twitter.com/janesmith', icon: 'twitter' }
];

export function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Share This Page</h1>
      <SocialShare socialLinks={socialLinks} title="Check out my profile!" />
    </div>
  );
}
