import Loading from '@/components/shared/Loading';
import { Alert, Input } from '@/components/ui'; // Added Input import
import { fetchFreeCourses } from '@services/public/LmsCourseService';
import { useFreeCourseStore } from '@app/store/public/___LmsCourseStore';
import React, { useEffect, useState } from 'react'; // Added useState
import { Link } from 'react-router-dom';

function LMSCoursesList() {
    const { freeCourses, loading, error, setFreeCourses, setLoading, setError } = useFreeCourseStore();
    const [searchTerm, setSearchTerm] = useState(''); // Added search state

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchFreeCourses().then((response) => {
            setFreeCourses(response?.data);
        }).catch((error) => {
            setError(error);
        }).finally(() => {
            setLoading(false);
            console.log("Courses fetched");
        });
    }, [setFreeCourses, setLoading, setError]);

    // Filter courses based on search term
    const filteredCourses = freeCourses.filter(course =>
        course?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && !freeCourses.length) {
        return <Loading loading={loading} />;
    }

    if (error) {
        return <Alert type="danger" title={error} />;
    }

    return (
        <section>
            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="Search courses by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                {
                    filteredCourses && filteredCourses.map((course) => (
                        <Link key={`/course//${course.id}`} to={`/course/${course?.id}`} className="dark:bg-gray-800 bg-white rounded-lg shadow-md overflow-hidden relative">
                            <div className="relative h-40">
                                <img src={course.image} alt="Cybersecurity" className="w-full h-full object-cover" />
                                <span className="absolute top-2 right-2 dark:bg-gray-800 px-2 py-1 rounded text-sm font-medium">Free</span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold mb-5 text-sm line-clamp-3">{course?.name}</h3>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: course?.description.length > 300 ? course?.description.substring(0, 300) + "..." : course?.description,
                                    }}
                                    className="text-gray-600 dark:text-gray-300"
                                ></p>
                            </div>
                        </Link>
                    ))
                }
            </div>
            {filteredCourses.length === 0 && searchTerm && (
                <p className="text-center mt-4 text-gray-500">No courses found matching "{searchTerm}"</p>
            )}
        </section>
    )
}

export default LMSCoursesList
