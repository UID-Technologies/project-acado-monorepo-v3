import { Alert } from '@/components/ui';
import { PlayIcon } from 'lucide-react';
import React from 'react';
import { BiRightArrowAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { Program } from '@app/types/learner/programList';
import { useMyCourses } from '@app/hooks/data/useCourses';
import LoadingSection from '@/components/LoadingSection';

const ContinueLearning: React.FC = () => {

    const { data: courses = [], isError: error, isLoading } = useMyCourses();

    if (error) {
        return <Alert title={`Error!: ${error}`} type="danger" />;
    }

    const coursesToShow = courses.slice(0, 3);

    if (isLoading) { return <LoadingSection isLoading={isLoading} title='Loading Courses...' description='Please wait while we fetch your courses.' />; }

    if (coursesToShow.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-100 p-4 rounded-lg dark:bg-gray-800 overflow-hidden mt-3 mb-6">
            <div className="flex justify-between items-center">
                <h1 className="font-semibold capitalize text-lg mb-3">Continue Learning</h1>
                {coursesToShow.length > 1 && (
                    <Link to={'/continue-learning'} className="text-primary rounded py-2 px-3 font-bold flex items-center gap-2">
                        View All <BiRightArrowAlt size={20} />
                    </Link>
                )}
            </div>
            <div className='flex md:grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto pb-2 scrollbar-hide'>
                {coursesToShow.map((course) => (
                    <div key={course.id} className="min-w-[250px] md:min-w-0">
                        <CourseCard course={course} />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ContinueLearning;

const CourseCard: React.FC<{ course: Program }> = ({ course }) => (
    <Link to={`/course-module/${course.id}`} className="group">
        <div className="flex min-h-[270px] flex-col items-center mb-3 rounded-md transform transition-transform hover:scale-[1.02] dark:bg-gray-700 bg-gray-200">
            <div
                className="w-full rounded-t rounded-md rounded-b-none h-40"
                style={{
                    backgroundImage: `url(${course.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(course.name)}`})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            <div className="p-3">
                <h6 className="font-semibold capitalize dark:text-primary text-primary line-clamp-1">
                    {course.name.length > 30 ? `${course.name.slice(0, 30)}...` : course.name}
                </h6>
                <p
                    className="dark:text-gray-300 text-xs line-clamp-3"
                    dangerouslySetInnerHTML={{
                        __html: course.description.length > 100 ? `${course.description.slice(0, 100)}...` : course.description,
                    }}
                />
            </div>
            <div className="hidden absolute top-2 right-2 py-2 px-2 rounded bg-primary hover:bg-primary-mild text-ac-dark text-center rounded-b group-hover:block">
                <PlayIcon size={16} className="inline" /> Start Learning
            </div>
        </div>
    </Link>
);
