
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Link } from 'react-router-dom';
import { Program } from '@app/types/learner/programList';
import { useMyCourses } from '@app/hooks/data/useCourses';
import Heading from '@/components/heading';
import MyCourseCard from '@/components/MyCourseCard';

const ContinueLearning: React.FC = () => {

    const { data: courses = [], isError: error, isLoading } = useMyCourses()

    if (isLoading) {
        return (
            <div className='h-28 flex justify-center items-center'>
                <Loading loading={true} />
            </div>
        );
    }

    if (error) {
        return <Alert title={`Error!: ${error}`} type="danger" />;
    }

    return (
        <div>
            <Heading title="Continue Learning" description="Continue your learning journey with your enrolled courses." />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {courses && courses.map((course: Program) => (
                    <Link key={course.id} to={`/course-module/${course.id}`} className="group">
                        <MyCourseCard course={course} />
                    </Link>
                ))}

                {courses && courses.length === 0 && (
                    <div className="col-span-4">
                        <Alert title="No courses found" type="info" />
                    </div>
                )}


            </div>
        </div>
    );
};

export default ContinueLearning;
