import React from 'react';
import { Star } from 'lucide-react';

const HeadlineScroller = () => {
  const headlines = [
    "Apply Now - Admissions Ongoing",
    "Early bird discount available",
    "Apply Now - Admissions Ongoing",
    "Early bird discount available"
  ];

  return (
    <div className="w-full py-3 overflow-hidden dark:bg-gray-700">
      <div className="relative flex">
        {/* First set of headlines */}
        <div className="flex animate-scroll whitespace-nowrap">
          {headlines.map((headline, index) => (
            <div key={`set1-${index}`} className="flex items-center mx-0">
              <span className="text-primary font-medium text-base italic">
                {headline}
              </span>
              <Star className="w-5 h-5 text-primary fill-primary mx-4" />
            </div>
          ))}
        </div>
        
        {/* Duplicate set for seamless loop */}
        <div className="flex animate-scroll whitespace-nowrap">
          {headlines.map((headline, index) => (
            <div key={`set2-${index}`} className="flex items-center mx-0">
              <span className="text-primary font-medium text-base italic">
                {headline}
              </span>
              <Star className="w-5 h-5  text-primary fill-primary mx-4" />
            </div>
          ))}
        </div>

        <div className="flex animate-scroll whitespace-nowrap">
          {headlines.map((headline, index) => (
            <div key={`set2-${index}`} className="flex items-center mx-0">
              <span className="text-primary font-medium text-base italic">
                {headline}
              </span>
              <Star className="w-5 h-5  text-primary fill-primary mx-4" />
            </div>
          ))}
        </div>

        <div className="flex animate-scroll whitespace-nowrap">
          {headlines.map((headline, index) => (
            <div key={`set2-${index}`} className="flex items-center mx-0">
              <span className="text-primary font-medium text-base italic">
                {headline}
              </span>
              <Star className="w-5 h-5  text-primary fill-primary mx-4" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-scroll {
          animation: scroll 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HeadlineScroller;