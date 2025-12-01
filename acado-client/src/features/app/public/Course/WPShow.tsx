import React, { useState, useEffect, useMemo } from 'react';
import { fetchCourseById } from '@services/public/CoursesService';
import { useParams, Link } from 'react-router-dom';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import '@/assets/styles/wordpress.css';
import {
  Award,
  BookOpen,
  Building2,
  Clock,
  DollarSign,
  GraduationCap,
  Languages,
  UserCheck,
} from 'lucide-react';
import { fetchLmsCourseMeta } from '@services/common/CourseService';
import { useCourseDetailsStore } from '@app/store/public/coursesStore';
import type { Courses } from '@app/types/common/courses';
import '../../common/Details.css';

const iconComponents = {
  GraduationCap,
  UserCheck,
  BookOpen,
  Clock,
  Building2,
  DollarSign,
  Award,
  Languages,
};

// ✅ Helper: safely encode image URLs
const safeUrl = (url?: string, fallback = '/fallback.jpg') => {
  if (!url) return fallback;
  const cleaned = url.replace(/\\/g, '').trim();
  try {
    return encodeURI(cleaned);
  } catch {
    console.warn('Invalid image URL:', url);
    return fallback;
  }
};

const CourseShow: React.FC = () => {
  const { course_id } = useParams();
  const [course, setCourse] = useState<Courses>();
  const { setCourseDetails, error, setError, loading, setLoading } = useCourseDetailsStore();
  const [activeSection, setActiveSection] = useState<string>('about-the-program');

  const sections = useMemo(
    () => [
      'about-the-program',
      'Course-Insights',
      'Course-Structure',
      'What-you-will-get',
      'Learning-Outcomes',
      'International-Partners',
      'Industrial-Collaborations',
      'Career-Opportunities',
      'Highlights-of-the-Program',
    ],
    []
  );

  // ✅ Fetch base course data
  useEffect(() => {
    if (!course_id) {
      setError('Course ID is required');
      return;
    }
    if (isNaN(Number(course_id))) {
      setError('Invalid Course ID');
      return;
    }

    setLoading(true);
    setError('');
    fetchCourseById(course_id)
      .then((data) => setCourseDetails(data))
      .catch((err) => setError(err?.message || 'Failed to load course details'))
      .finally(() => setLoading(false));
  }, [course_id, setCourseDetails, setError, setLoading]);

  // ✅ Fetch LMS metadata
  useEffect(() => {
    if (!course_id) return;
    setLoading(true);
    fetchLmsCourseMeta(course_id)
      .then(setCourse)
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch course meta');
      })
      .finally(() => setLoading(false));
  }, [course_id, setError, setLoading]);

  // ✅ Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return <Loading loading={loading} />;
//   eslint-disable-next-line
  if (error) return <Alert title={error} showIcon type="danger" className="mt-8" />;

  const sanitizedContent = course?.course_heading ?? '';
//   eslint-disable-next-line
  const bannersArray = Array.isArray(course?.banners)
    ? course?.banners
    : course?.banners
    ? [course.banners]
    : [];

  // ✅ Safe background image URLs
  const heroBg = safeUrl('/img/event/event.jpg');
  const courseBg = safeUrl(course?.course_image, '/img/event/event.jpg');

  return (
    <div className="mt-8">
      {/* HERO */}
      <div
        style={{
          backgroundImage: `url("${heroBg}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
        }}
        className="flex justify-center items-end absolute h-[500px] w-full left-0 top-0"
      >
        <div className="absolute inset-0 bg-gray-900 opacity-50 dark:opacity-70" />
      </div>

      <div className="container mx-auto relative mt-48">
        {/* HEADER CARD */}
        <div className="grid grid-cols-1 md:grid-cols-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div
            style={{
              backgroundImage: `url("${courseBg}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              height: '300px',
            }}
            className="col-span-2 md:rounded-s-lg rounded-t-lg md:rounded-r-none"
          />
          <div className="w-full px-5 col-span-3">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b py-4 mb-3 overflow-hidden">
              <h1 className="text-2xl md:text-2xl font-bold text-primary dark:text-primary">
                {course?.course_name}
              </h1>
              <Link
                to={`/courses-show/${course_id}`}
                className="text-nowrap bg-primary text-white dark:text-gray-900 font-bold py-2 px-6 rounded hover:bg-primary-light dark:hover:bg-primary-dark transition whitespace-nowrap"
              >
                Apply Now
              </Link>
            </div>
            <p
              dangerouslySetInnerHTML={{
                __html:
                  sanitizedContent.length > 300
                    ? sanitizedContent.substring(0, 300) + '...'
                    : sanitizedContent,
              }}
              className="text-gray-600 dark:text-gray-300"
            />
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
          {/* LEFT SIDEBAR */}
          <div className="col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sticky top-24">
              <h3 className="text-xl font-bold text-primary dark:text-primary">Course Details</h3>
              <ul className="mt-4 list-inside text-gray-600 dark:text-gray-300">
                {sections.map((id) => (
                  <li key={id}>
                    <button
                      className={`flex gap-3 py-1 hover:text-primary capitalize ${
                        activeSection === id ? 'text-primary font-bold' : ''
                      }`}
                      onClick={() => scrollToSection(id)}
                    >
                      {id.replace(/-/g, ' ')}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="col-span-9 space-y-5">
            {course?.about_course && (
              <Section id="about-the-program" title="About the Program" content={course.about_course} />
            )}

            <Section id="Course-Insights" title="Course Insights">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: 'GraduationCap', title: 'Degree', value: course?.degree },
                  { icon: 'UserCheck', title: 'Eligibility', value: course?.eligibility },
                  { icon: 'BookOpen', title: 'Field of study', value: course?.field_of_study },
                  { icon: 'Clock', title: 'Duration', value: course?.duration },
                  { icon: 'Building2', title: 'School / department', value: course?.school_department },
                  { icon: 'DollarSign', title: 'Tuition fee', value: course?.tuition_fee },
                  { icon: 'Award', title: 'Number of Credits', value: course?.number_of_credits },
                  { icon: 'Languages', title: 'Language of instruction', value: course?.language },
                  { icon: 'GraduationCap', title: 'Scholarship' },
                ].map((item, idx) => {
                  const Icon = iconComponents[item.icon as keyof typeof iconComponents];
                  return (
                    <div key={idx} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-start space-x-4">
                      <div className="bg-primary text-white p-2 rounded-full">{Icon && <Icon className="w-6 h-6" />}</div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{item.value}</p>
                        {item.title === 'Tuition fee' && (
                          <a href="#" className="text-primary hover:underline inline-block">
                            Read more
                          </a>
                        )}
                        {item.title === 'Scholarship' && (
                          <div
                            className="text-gray-600 dark:text-gray-300 mt-1"
                            dangerouslySetInnerHTML={{ __html: course?.scholarship || '' }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {course?.course_structure && (
              <Section id="Course-Structure" title="Course Structure" content={course.course_structure} />
            )}

            {course?.what_you_will_get && (
              <Section id="What-you-will-get" title="What you will get?" content={course.what_you_will_get} />
            )}

            {course?.learning_outcome && (
              <Section id="Learning-Outcomes" title="Learning Outcomes" content={course.learning_outcome} />
            )}

            {course?.partners && (
              <Section id="International-Partners" title="International Partners" content={course.partners} />
            )}

            {course?.collaboration && (
              <Section id="Industrial-Collaborations" title="Industrial Collaborations" content={course.collaboration} />
            )}

            {course?.career_opportunities && (
              <Section id="Career-Opportunities" title="Career Opportunities" content={course.career_opportunities} />
            )}

            {course?.course_usp && (
              <Section id="Highlights-of-the-Program" title="Highlights of the Program" content={course.course_usp} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable content block
const Section = ({
  id,
  title,
  content,
  children,
}: {
  id: string;
  title: string;
  content?: string;
  children?: React.ReactNode;
}) => (
  <div id={id} className="rounded-lg shadow-lg p-5 dark:bg-gray-800" style={{ scrollMarginTop: '95px' }}>
    <h3 className="text-2xl font-bold text-primary dark:text-primary mb-3">{title}</h3>
    {content ? (
      <div
        className="text-gray-600 dark:text-gray-300 add-ul-li custom-html-container"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    ) : (
      children
    )}
  </div>
);

export default CourseShow;
