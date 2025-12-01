import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { fetchFreeCourses } from '@services/public/LmsCourseService';
import { useFreeCourseStore } from '@app/store/public/___LmsCourseStore';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function FreeCourseDetails() {
    const { freeCourses, loading, error, setFreeCourses, setLoading, setError } = useFreeCourseStore();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchFreeCourses()
            .then((response) => {
                setFreeCourses(response.data);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
                console.log("Courses fetched");
            });
    }, [setFreeCourses, setLoading, setError]);

    const filteredCourses = freeCourses.filter(course => 
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && !freeCourses.length) {
        return <Loading loading={loading} />;
    }

    if (error) {
        return <Alert type="danger" title={error} />;
    }

    return (
        <section>
            <div className="flex justify-end mb-4">
                <input 
                    type="text" 
                    placeholder="Search by course name..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="border px-4 py-2 rounded-md w-64 shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 mb-4">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <Link key={course.id} to={`/course-module/${course.id}`} className="dark:bg-gray-800 bg-white rounded-lg shadow-md overflow-hidden relative">
                            <div className="relative h-40">
                                <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
                                <span className="absolute top-2 right-2 dark:bg-gray-800 px-2 py-1 rounded text-sm font-medium">Free</span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold mb-5 text-sm line-clamp-3">{course.name}</h3>
                                <p className="font-semibold mb-5 text-sm line-clamp-3">{course.description}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500">No courses found.</p>
                )}
            </div>
        </section>
    );
}

export default FreeCourseDetails;
