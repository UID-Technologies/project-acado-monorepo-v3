import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CiStopwatch } from 'react-icons/ci';
import { FaGraduationCap, FaStar } from 'react-icons/fa6';
import { Course } from '@app/types/public/lmsCourses';
import { TimerIcon } from 'lucide-react';

interface ProgramCardProps {
  program: Course;
}

const useIsMobile = (breakpoint = 768) => {
  const isMobileRef = useRef(window.innerWidth <= breakpoint);
  const [isMobile, setIsMobile] = useState(isMobileRef.current);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const handleResize = (e: MediaQueryListEvent) => {
      isMobileRef.current = e.matches;
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const isMobile = useIsMobile();

  // 🧩 Safe organization logo fallback
  const orgLogo =
    program?.organization?.logo ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(program?.organization?.name || '')}`;

  // 🧩 Clean + encode image URL (handles slashes and parentheses)
  const imageUrl = useMemo(() => {
    if (!program?.image) return '/fallback.jpg';
    const clean = program.image.replace(/\\/g, '').trim();
    try {
      return encodeURI(clean);
    } catch {
      return clean;
    }
  }, [program?.image]);

  // 🧩 Background style
  const bgStyle = useMemo(
    () => ({ backgroundImage: `url("${imageUrl}")` }),
    [imageUrl]
  );

  // 🧩 Mobile Layout
  if (isMobile) {
    return (
      <div className="w-full rounded-lg overflow-hidden shadow-md bg-white dark:bg-[#1a1a1a] p-4 space-y-3">
        <div className="flex items-center gap-3">
          <img src={orgLogo} alt="Org Logo" className="w-10 h-10 rounded-full" />
          <p className="text-sm font-semibold capitalize dark:text-textDark">
            {program?.organization?.name}
          </p>
        </div>

        <div className="w-full h-40 bg-cover bg-center rounded-md" style={bgStyle}></div>

        <p className="text-sm font-bold dark:text-textDark capitalize">
          {program?.name}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-textDark">
          <div className="flex items-center gap-1">
            <TimerIcon className="text-base text-yellow-400" />
            <span>{program?.course_meta_data?.duration || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaStar className="text-base text-yellow-400" />
            <span>4.5</span>
          </div>
        </div>
      </div>
    );
  }

  // 🧩 Desktop Layout
  return (
    <div className="max-w-sm rounded overflow-hidden mx-auto shadow-lg dark:bg-[#222222] hover:transform hover:scale-95 transition-transform duration-300">
      <div className="w-full h-44 bg-cover bg-top" style={bgStyle}></div>

      <div className="px-6 pt-4 dark:bg-[#222222] bg-white">
        <div className="flex items-center gap-3">
          <img src={orgLogo} alt="logo" className="w-[30px] h-[30px] rounded" />
          <p className="font-bold text-[10px] dark:text-textDark capitalize">
            {program?.organization?.name}
          </p>
        </div>

        <p className="font-bold text-[14px] mb-2 mt-3 whitespace-nowrap overflow-hidden text-ellipsis dark:text-textDark capitalize">
          {program?.name}
        </p>
      </div>

      <ul className="px-6 pb-4 dark:bg-[#222222] bg-white">
        <li className="flex mb-1 items-center gap-3 md:gap-2">
          <CiStopwatch className="text-[20px] dark:text-darkPrimary" />
          <span className="text-[10px] dark:text-textDark">
            {program?.course_meta_data?.duration || 'N/A'}
          </span>
        </li>

        <div className="flex items-center justify-between gap-3 md:gap-2">
          <li className="flex items-center gap-3 md:gap-2">
            <FaGraduationCap className="text-[20px] dark:text-darkPrimary" />
            <span className="text-[10px] dark:text-textDark">Enrollments</span>
          </li>
          <li className="flex items-center gap-3 md:gap-2">
            <FaStar className="text-[20px] text-yellow-400" />
            <span className="text-[10px] dark:text-textDark">4.5</span>
          </li>
        </div>
      </ul>
    </div>
  );
};

// ✅ Optimized memoization (only re-render if program.id changes)
export default React.memo(ProgramCard, (prev, next) => prev.program.id === next.program.id);
