import { Clock } from 'lucide-react';
import React, { useEffect } from 'react';
import { BiRightArrowAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';

import { fetchCoursesByUniversityId } from '@services/public/UniversitiesService';
import { useCourseStore } from '@app/store/public/coursesStore';
import { fetchEnrolledUniversity } from '@services/learner/EnrolledUniversityService';
import { BsPeople } from 'react-icons/bs';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';

const ContinueLearning: React.FC = () => {
    const { courses, setCourses, error, setError, loading, setLoading } = useCourseStore();

    useEffect(() => {
        const query = "?limit=4";
        fetchEnrolledUniversity(query)
            .then((response) => {
                setCourses(response);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (!courses || courses.length === 0) {
        return null;
    }

    if (loading) {
        return <Loading loading={loading} />
    }

    if (error) {
        return <Alert title={error} type='danger' />
    }

    return (
        <div className='bg-gray-100 p-4 rounded-lg dark:bg-gray-800 overflow-hidden mb-6'>
            <div className='flex justify-between items-center'>
                <h1 className='font-semibold capitalize text-lg mb-3'>University Courses - My Selection</h1>
                <Link to={'/university-course-listing'} className='text-primary rounded py-2 px-3 font-bold flex items-center justify-center gap-2'>
                    View All<BiRightArrowAlt size={20} className='inline' />
                </Link>
            </div>
            {courses.map((course: any) => (
                <Link to={`/courses-show/${course.ID}`} key={`enrolled-university-course-${course.ID}`}>
                    <div className='group block md:flex items-center mb-3 rounded transform transition-transform hover:scale-[1.02] dark:bg-gray-700 bg-gray-200'>
                        <div className='w-full h-48 md:w-48 md:min-w-48 md:h-28 bg-cover bg-center rounded-t md:rounded-l md:rounded-r-none'
                            style={{
                                backgroundImage: `url(${course?.json?.image_url ? course?.json?.image_url : `https://ui-avatars.com/api/?name=${course.title}`})`,
                                backgroundPosition: 'top',
                                backgroundSize: 'cover'
                            }}>
                        </div>
                        <div className='px-3 py-3 md:py-2'>
                            <h6 className='font-semibold uppercase dark:text-primary text-primary'>
                                {course?.post_title?.length > 40 ? course?.post_title.substring(0, 40) + '...' : course?.post_title}
                            </h6>
                            <div dangerouslySetInnerHTML={{ __html: course?.post_content.length > 100 ? course?.post_content.substring(0, 100) + '...' : course?.post_content }}></div>
                            <div className="flex items-center gap-2 py-1">
                                <div className="flex items-center gap-1">
                                    <Clock size={16} className='text-primary' />
                                    <span>{course?.course_meta_data?.course_duration} Year</span>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                    <BsPeople size={16} className='text-primary' />
                                    <span>{course?.json?.meta_data?._lp_students}</span>
                                    <span>Students</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ContinueLearning;
