import '@/assets/styles/wordpress.css'
import { Award, BookOpen, Building2, Clock, DollarSign, GraduationCap, Languages, UserCheck } from 'lucide-react'
import React from 'react'
import { fetchLmsCourseMeta } from '@services/common/CourseService'
import { Courses } from '@app/types/common/courses'
import Loading from '@/components/shared/Loading'
import Error from '@/components/shared/Error'

import { useParams } from 'react-router-dom'

const CourseShow: React.FC = () => {

    const [course, setCourse] = React.useState<Courses>();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string>('');

    const { course_id } = useParams<{ course_id: string }>();


    React.useEffect(() => {

        if (!course_id) {
            setError('Course ID not found');
            setLoading(false);
            return;
        };

        setLoading(true);
        setError('');
        fetchLmsCourseMeta(course_id).then(res => {
            setCourse(res);
        }).catch(err => {
            console.log(err);
            setError(err);
        }).finally(() => {
            setLoading(false);
        })
    }, [])

    if (loading) return <Loading loading={loading} />
    if (error) return <Error error={error} />

    return (
        <div className='pt-4'>
            <div className='bg-[#D685DB] p-5'>
                <p className='text-dark font-bold text-xl'>
                    {
                        course?.course_heading
                    }
                </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-1 gap-0 mt-1'>
                {
                    course?.banners ? (
                        <img src={JSON.parse(course?.banners ?? '')[0]} alt='Course Image' className='w-full h-full object-cover' />
                    ) : ''
                }
            </div>
            <div className="bg-[#FFE17F] p-8 md:p-12 lg:p-16 mt-2">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Degree */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-black/10">
                            <GraduationCap className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Degree</h3>
                            <p>{course?.degree}</p>
                        </div>
                    </div>

                    {/* Eligibility */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-black/10">
                            <UserCheck className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Eligibility</h3>
                            <p>{course?.eligibility}</p>
                        </div>
                    </div>

                    {/* Field of Study */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-black/10">
                            <BookOpen className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Field of study</h3>
                            <p>{course?.field_of_study}</p>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-black/10">
                            <Clock className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Duration</h3>
                            <p>{course?.duration}</p>
                        </div>
                    </div>

                    {/* School */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-black/10">
                            <Building2 className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">School / department</h3>
                            <p>{course?.school_department}</p>
                        </div>
                    </div>

                    {/* Tuition */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-black/10">
                            <DollarSign className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Tuition fee</h3>
                            <p>{course?.tuition_fee}</p>
                            <a href="#" className="text-black underline hover:no-underline">
                                Read more
                            </a>
                        </div>
                    </div>

                    {/* Credits */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-black/10">
                            <Award className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Number of Credits</h3>
                            <p>{course?.number_of_credits}</p>
                        </div>
                    </div>

                    {/* Language */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-black/10">
                            <Languages className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Language of instruction</h3>
                            <p>{course?.language}</p>
                        </div>
                    </div>

                    {/* Scholarship */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-black/10">
                            <GraduationCap className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Scholarship</h3>
                            <p>Available</p><p className='underline' dangerouslySetInnerHTML={{ __html: course?.scholarship || '' }} />
                        </div>
                    </div>
                </div>
            </div>
            {/* Header Section */}
            <div className="relative bg-[#D4A088] py-16 px-4 md:px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-black">Applying to Bachelor's Degree programmes</h1>
                    <div className="absolute top-4 right-4 md:static">
                        <div className='inline-block bg-[#FFE17F] px-6 py-3 text-black font-semibold rounded-md hover:bg-[#FFD700] transition-colors' dangerouslySetInnerHTML={{ __html: course?.how_to_apply || '' }} />
                    </div>
                </div>
            </div>

            {/* About the Course Section */}
            <div className="bg-white py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">About the Course</h2>
                    <div className="prose prose-lg max-w-none">
                        <div className="text-black leading-relaxed" dangerouslySetInnerHTML={{ __html: course?.about_course || '' }} />
                    </div>
                </div>
            </div>

            {/* Structure of Studies Section */}
            <div className="relative bg-[#7DD3D3] py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className='leading-relaxed text-black' dangerouslySetInnerHTML={{ __html: course?.course_structure || '' }} />
                </div>
            </div>

            <div className="bg-[#ffe5a9] p-6">
                <h2 className="text-2xl font-bold mb-4">Learning Outcomes</h2>
                <div className='leading-relaxed text-black' dangerouslySetInnerHTML={{ __html: course?.learning_outcome || '' }} />
            </div>

            <div className="mt-3">
                <div className="bg-[#f6ffae] p-6">
                    <div className='leading-relaxed text-black' dangerouslySetInnerHTML={{ __html: course?.partners || '' }} />
                </div>
                <div className="bg-[#5ce2e7] p-6">
                    <h3 className="text-lg font-bold mb-4">Industry collaborations</h3>
                    <div className='leading-relaxed text-black' dangerouslySetInnerHTML={{ __html: course?.collaboration || '' }} />
                </div>
                <div className="p-6 bg-[#adff90]">
                    <h3 className="text-lg font-bold mb-4">Career Opportunities</h3>
                    <div className='leading-relaxed text-black' dangerouslySetInnerHTML={{ __html: course?.career_opportunities || '' }} />
                </div>
            </div>
            <div className="bg-green-200 p-6">
                <h3 className="text-lg font-bold mb-4">USP's Of the Program</h3>
                <div className='leading-relaxed text-black' dangerouslySetInnerHTML={{ __html: course?.course_usp || '' }} />
            </div>
        </div>
    )
}

export default CourseShow
