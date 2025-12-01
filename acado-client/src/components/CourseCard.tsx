import { Card, CardContent, CardHeader } from './ui/card';
import { CourseDetails } from '@app/types/learning/courses';

interface CourseCardProps {
    course: CourseDetails;
    tooltip?: boolean;
}

const CourseCard = ({ course }: CourseCardProps) => {
    return (
        <Card className='overflow-hidden hover:shadow-lg relative hover:transform hover:scale-95 transition-transform duration-300 h-full flex flex-col'>
            <CardHeader className='p-0 relative'>
                <img src={course.image} alt={course.name} className="w-full h-40" />
            </CardHeader>
            <CardContent className='px-2 py-3 flex flex-col justify-between flex-1'>
                <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                            <img src={course?.organization?.organization_logo} alt={course?.organization?.name} className="w-8 h-8 object-contain rounded-full bg-gray-100 border" />
                            <h4 className="font-semibold text-sm line-clamp-2">{course?.organization?.name}</h4>
                        </div>
                    </div>
                    <div className='text-left'>
                        <h4 className="font-semibold text-sm line-clamp-2 text-cblack mb-4">{course.name}</h4>
                        <p className="text-sm text-gray-500 line-clamp-2">{course?.description}</p>
                    </div>
                    <div className='mt-4 mb-2 text-left'>
                        <h4 className='font-semibold text-sm text-gray-600'>Skills</h4>
                    </div>
                </div>
                <div className='mt-3 flex flex-wrap items-center gap-2'>
                </div>

            </CardContent>
        </Card>
    )
}

export default CourseCard;
