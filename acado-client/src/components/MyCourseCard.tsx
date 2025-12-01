import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/shadcn/progress';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import type { Program } from "@app/types/learner/programList";

interface MyCourseCardProps {
    course: Program;
}

const MyCourseCard = ({ course }: MyCourseCardProps) => {
    return (
        <Card className="rounded-lg shadow-md overflow-hidden relative flex flex-col h-full" >
            <CardHeader className="relative h-40 px-0 pt-0 relative">
                <img src={course.image} alt="Cybersecurity" className="w-full h-full object-cover" />
            </CardHeader>
            <CardContent>
                <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                            <img src={course?.organization?.organization_logo} alt={course?.organization?.name} className="w-8 h-8 object-contain rounded-full bg-gray-100 border" />
                            <h4 className="font-semibold text-sm line-clamp-2">{course?.organization?.name}</h4>
                        </div>
                    </div>
                    <div className='text-left'>
                        <h4 className="font-semibold text-sm line-clamp-2 text-cblack mb-0">{course.name}</h4>
                        <p className="text-sm dark:text-gray-300 text-gray-700 line-clamp-2 mt-2 line-clamp-2">{stripHtmlTags(course?.description)}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="mt-auto pt-0 pb-3">
                <div className="sticky bottom-0 w-full">
                    <Progress value={course?.completion} className='h-2 mb-1 dark:bg-gray-700 bg-gray-200' />
                    <span className="text-xs text-gray-500">
                        {course?.completion == 0 ? '0%' : `${course?.completion}% Completed`}
                    </span>
                </div>
            </CardFooter>
        </Card >
    )
}

export default MyCourseCard
