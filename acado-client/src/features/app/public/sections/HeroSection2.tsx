import React, { memo, useEffect, useState, useCallback } from 'react'
import { useCourses } from '@app/hooks/data/useCourses'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/shadcn/carousel"
// import { stripHtmlTags } from '@/utils/stripHtmlTags'
import { Button } from '@/components/ui/shadcn/button'
import { Link } from 'react-router-dom'
import { PiClockFill, PiGraduationCapFill, PiUserFill } from 'react-icons/pi'
import { TbCashBanknoteFilled } from 'react-icons/tb'

const HeroSection2: React.FC = () => {
    const params = new URLSearchParams();
    params.append('limit', '10');
    params.append('page', '1');
    params.append('cat_id', '1250');

    const { data: coursesData, isLoading } = useCourses(params);
    const courses = coursesData?.data || [];

    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Update current slide index
    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    // Auto-rotation effect
    useEffect(() => {
        if (!api || isHovered || courses.length <= 1) return;

        const intervalId = setInterval(() => {
            api.scrollNext();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [api, isHovered, courses.length]);

    const scrollTo = useCallback((index: number) => {
        api?.scrollTo(index);
    }, [api]);


    if (isLoading) {
        return (
            <div className="relative w-full md:h-[60vh] flex items-center justify-center bg-gray-800">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!courses || courses.length === 0) {
        return null;
    }

    return (
        <section
            className="relative w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: true,
                    duration: 10,
                    skipSnaps: true,
                }}
                className="w-full"
            >
                <CarouselContent className="">
                    {courses.map((course) => (
                        <CarouselItem key={course.id}>
                            <div className="relative w-full">
                                {/* Background */}
                                <div className="absolute pb-12 min-h-[80vh] max-h-[80vh] inset-0 bg-gray-700">
                                </div>
                                <div className="relative">
                                    <div className="grid lg:grid-cols-2 gap-0 items-center">
                                        {/* Left Content */}
                                        <div className="space-y-4 lg:space-y-6 text-white px-4 sm:px-6 lg:px-12 py-6 lg:py-12 relative z-10 bg-gradient-to-r from-gray-800/95 via-gray-800/90 to-gray-800/60 lg:bg-transparent h-full flex flex-col justify-center">
                                            {/* Main Heading */}
                                            <div className="space-y-2">
                                                <h1 className="text-2xl !leading-tight sm:text-3xl lg:text-4xl xl:text-4xl max-w-[80%] font-bold text-primary dark:text-darkPrimary line-clamp-3 min-h-[80px] lg:min-h-[120px]">
                                                    {course.name}
                                                </h1>
                                                {/* University Name */}
                                            <p className="text-sm sm:text-base font-light lg:text-lg text-gray-200 line-clamp-1 md:min-h-[24px] lg:min-h-[28px]">
                                                {course.organization?.name || 'Metropolia University of Applied Sciences, Finland'}
                                            </p>
                                            </div>
                                            
                                            {/* Description */}
                                            {/* <p className="text-xs sm:text-xs font-semibold lg:text-base line-clamp-2 text-gray-300 max-w-[90%] md:min-h-[40px] lg:min-h-[48px]">
                                                {stripHtmlTags(course.description) || 'Explore this comprehensive program designed to enhance your skills and knowledge.'}
                                            </p> */}
                                            {/* Info Grid */}
                                            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl md:min-h-[80px]">
                                                {/* Credits */}
                                                {course.course_meta_data?.number_of_credits && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                                                            <PiGraduationCapFill className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <span className="text-sm shrink-0 sm:text-base font-medium">
                                                            {course.course_meta_data.number_of_credits}
                                                        </span>
                                                    </div>
                                                )}
                                                {/* Language/Mode */}
                                                {course.course_meta_data?.language && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                                                            <PiUserFill className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <span className="text-sm shrink-0 sm:text-base font-medium">
                                                            {course.course_meta_data.mode_of_delivery || 'In-Person'}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Tuition Fee */}
                                                {course.course_meta_data?.tuition_fee && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                                                            <TbCashBanknoteFilled className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <span className="text-sm shrink-0 sm:text-base font-medium">
                                                            {course.course_meta_data.tuition_fee}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Duration */}
                                                {course.course_meta_data?.duration && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                                                            <PiClockFill className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <span className="text-sm shrink-0 sm:text-base font-medium">
                                                            {course.course_meta_data.duration}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* CTA Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-3 pt-2 md:min-h-[64px] sm:min-h-[48px]">
                                                <Button
                                                    className="bg-primary hover:bg-primary text-gray-900 font-semibold text-sm px-6 py-6 rounded-none"
                                                >
                                                    <Link to={`/courses-show/${course.id}`}>
                                                        Admission Open Now
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant={'outline'}
                                                    className="text-white hover:bg-white/10 text-sm px-6 py-6 rounded-none bg-transparent border-gray-500"
                                                >
                                                    <Link to={'/course/' + course.id} >
                                                        Learn More
                                                    </Link>
                                                </Button>
                                            </div>

                                            {/* Dot Indicators */}
                                            {courses.length > 1 && (
                                                <div className="flex gap-2 !mb-8">
                                                    {courses.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            className={`transition-all ${current === index
                                                                ? 'w-3 h-3 bg-primary'
                                                                : 'w-3 h-3 bg-transparent border border-primary hover:bg-white/75'
                                                                } rounded-full`}
                                                            aria-label={`Go to slide ${index + 1}`}
                                                            onClick={() => scrollTo(index)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Image */}
                                        <div className="relative lg:block hidden h-full">
                                            <div className="absolute inset-0 h-full">

                                                <img className=' relative top-10 repeat-0 ' src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/8mynY3UJfqYJIyy7yYuJb627qPUyEhkepW8IWKu2.png" />
                                                {/* Diagonal clip effect */}
                                                <div
                                                    className="absolute inset-0 h-full overflow-hidden"
                                                >
                                                    <img
                                                        src={course?.image}
                                                        alt={course.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile Image */}
                                        <div className="lg:hidden relative w-full md:h-[250px] sm:h-[300px] overflow-hidden">
                                            <img
                                                src={course?.image}
                                                alt={course.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                                  
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* <div className='drop-shadow-md relative -top-1 container text-center mx-auto bg-white dark:bg-gray-800 p-6 rounded-md'>
                <p className='text-primary font-semibold italic'>“Lead industrial transformation - no IELTS required.”</p>
                <p className='dark:text-white mt-3'>Join Finland’s top applied sciences university and gain global managerial expertise in Industrial Management.</p>
            </div> */}
        </section>
    )
}

export default memo(HeroSection2)
