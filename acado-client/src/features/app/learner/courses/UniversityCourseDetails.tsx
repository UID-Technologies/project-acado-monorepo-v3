import { PlayIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BiRightArrowAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';

import { fetchCoursesByUniversityId } from '@services/public/UniversitiesService';
import { useCourseStore } from '@app/store/public/coursesStore';
import { fetchEnrolledUniversity } from '@services/learner/EnrolledUniversityService';

const UniversityCourseDetails: React.FC = () => {
    const { courses, setCourses, error, setError, loading, setLoading } = useCourseStore();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        fetchEnrolledUniversity()
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

    // Filter courses based on the search query
    const filteredCourses = courses?.filter((course: any) =>
        course?.json?.post_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='bg-white p-4 rounded-lg dark:bg-gray-800 overflow-hidden mb-6'>
            <div className='flex justify-between items-center mb-3'>
                <h1 className='font-semibold capitalize text-lg'>University Courses</h1>
            </div>
            {filteredCourses && filteredCourses.map((course: any) => (
                <Link to={`/courses-show/${course.ID}`} key={course.object_id}>
                    <div className='group block md:flex items-center mb-3 rounded transform transition-transform hover:scale-[1.02] dark:bg-gray-700 bg-gray-200'>
                        <img
                            src={course?.json?.image_url ? course?.json?.image_url : `https://ui-avatars.com/api/?name=${course?.json?.post_title}`}
                            alt={`${course?.json?.post_title}`}
                            className='w-full md:w-48 rounded-t md:rounded-l md:rounded-r-none'
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${course?.json?.post_title}`;
                            }}
                        />
                        <div className='p-3 md:px-3 md:py-0'>
                            <h6 className='font-semibold capitalize dark:text-primary text-primary'>
                                {course?.json?.post_title.length > 50 ? course?.json?.post_title.substring(0, 50) + '...' : course?.json?.post_title}
                            </h6>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: course?.post_content.length > 200 ? course?.post_content.substring(0, 200) + '...' : course?.post_content
                                }}
                            ></div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default UniversityCourseDetails;
