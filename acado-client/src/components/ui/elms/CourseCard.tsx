import React, { memo } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcnAvatar';
import { Clock1 } from 'lucide-react';
import { Course } from '@app/types/elms/course';

interface CourseProps {
    course: Course | null;
}

const CourseCard: React.FC<CourseProps> = ({ course }) => {
    return (
        <Card className="hover:transform hover:scale-95 transition-transform transition-150">
            <CardHeader className="p-0 bg-center bg-cover h-48 rounded-t" style={{ backgroundImage: `url(${course?.image})` }}></CardHeader>
            <CardContent className='h-36'>
                <div className="mt-3 flex items-center space-x-3">
                    <Avatar className="rounded-md">
                        <AvatarImage src={course?.organization?.organization_logo} className="bg-white" />
                        <AvatarFallback>{course?.organization?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xs font-semibold line-clamp-2">{course?.organization?.name}</h2>
                </div>
                <div className="mt-3">
                    <h3 className="text-lg font-semibold line-clamp-1">{course?.name}</h3>
                    <p className="mt-2 text-xs line-clamp-2">{course?.description}</p>
                </div>
            </CardContent>
            <CardFooter>
                <ul className="flex items-center justify-between w-full">
                    <li className="flex items-center space-x-2">
                        <Clock1 size={18} className="text-primary" />
                        <span>{course?.course_meta_data?.duration}</span>
                    </li>
                </ul>
            </CardFooter>
        </Card>
    )
}

export default memo(CourseCard);
