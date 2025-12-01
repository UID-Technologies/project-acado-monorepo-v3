import React, { useEffect, memo, useCallback } from 'react';
import { fetchUniversityCourses } from '@services/elms/UniversityService';
import { useUniversityCoursesStore } from '@app/store/elms/UniversityStore';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Link } from 'react-router-dom';
import CourseCard from '@/components/ui/elms/CourseCard';

interface UniversityCoursesProps {
    universityId?: number | null;
}

const Courses: React.FC<UniversityCoursesProps> = ({ universityId }) => {
    const { courses, setCourses, error, setError, loading, setLoading } = useUniversityCoursesStore();

    const getCourses = useCallback(async () => {
        if (!universityId) return;
        setLoading(true);
        setError('');
        try {
            const coursesData = await fetchUniversityCourses(universityId);
            setCourses(coursesData);
        } catch (error) {
            console.error(error);
            setError('Error fetching courses');
        } finally {
            setLoading(false);
        }
    }, [universityId, setCourses, setError, setLoading]);

    useEffect(() => {
        getCourses();
    }, [getCourses]);

    if (loading) return <Loading loading={loading} className="col-span-full" />;
    if (error) return <Alert type="danger" title={error} showIcon={true} className="col-span-full" />;
    if (!courses || courses.length === 0) return <Alert type="info" title="No courses found" showIcon={true} className="col-span-full" />;

    return (
        <>
            {courses && courses?.map((course) => (
                <Link to={`/course/${course?.id}`} key={course?.id}>
                    <CourseCard course={course ?? []} />
                </Link>
            ))}
        </>
    );
};

export default memo(Courses);
