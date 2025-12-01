import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { fetchCourseById } from '@services/public/LmsCourseService';
import { useSingleCourseStore } from '@app/store/public/___LmsCourseStore';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import Swal from 'sweetalert2';

function CourseShow() {

    const { id } = useParams<{ id: string }>();
    const { setCourse, course, loading, setLoading, error, setError } = useSingleCourseStore();
    const [tab, setTab] = useState('about');
    const [enrolled, setEnrolled] = useState(JSON.parse(localStorage.getItem('continueReadingIds') || '[]')?.includes(course?.id) || false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) {
                setError('Course ID is required');
                return;
            };
            setLoading(true);
            fetchCourseById(id).then((response) => {
                setCourse(response);
            }).catch((err) => {
                setError(err);
            }).finally(() => {
                setLoading(false);
            });
        }
        fetchCourse();
    }, [id, setCourse, setLoading, setError]);

    const enrollNow = () => {
        Swal.fire({
            title: 'Enroll Now',
            text: 'Are you sure you want to enroll this course?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Enroll Now',
            cancelButtonText: 'No, Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                const alreadyEnrolled = JSON.parse(localStorage.getItem('continueReadingIds') || '[]');
                if (alreadyEnrolled.includes(course?.id)) {
                    return Swal.fire('Already Enrolled!', 'You have already enrolled this course.', 'info');
                }
                alreadyEnrolled.push(course?.id);
                localStorage.setItem('continueReadingIds', JSON.stringify(alreadyEnrolled));
                Swal.fire('Enrolled!', 'You have successfully enrolled this course.', 'success');
                setEnrolled(true);
            }
        });
    }

    const continueLearning = () => {
        if (!course?.modules?.length) {
            return Swal.fire('No Modules!', 'There is no module in this course.', 'info');
        }
        navigate(`/courses/${course?.id}/modules/${course?.modules?.[0]?.id}`);
    }

    if (loading) return <Loading loading={loading} />
    if (error) return <Alert title={error} type="danger" />

    return (
        <div>
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <a href="#" className="hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </a>
                <span>›</span>
                <Link to={'/my-courses'} className="hover:text-blue-600">Courses</Link>
                <span>›</span>
                <a href="#" className="hover:text-blue-600">{course?.name}</a>
            </nav>
            <div className='bg-white p-6 rounded-lg shadow-sm mb-5'>
                <div className="max-w-4xl">
                    <h1 className="text-xl md:text-3xl font-bold mb-2">
                        {course?.name}
                    </h1>
                    <div className="mb-7 flex justify-start items-center space-x-2">
                        <img src={course?.organization?.logo ?? 'https://ui-avatars.com/api/?name=' + course?.organization?.name} alt={course?.organization?.name} className="w-5 h-5 rounded-full" />
                        <span className="text-sm text-gray-600">{course?.organization?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-5">
                        <div className="flex -space-x-3">
                            {
                                course?.program_faculty?.map((instructor, index) => (
                                    <div key={index} className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white bg-center bg-cover"
                                        style={{ backgroundImage: `url('${instructor?.image ?? 'https://ui-avatars.com/api/?name=' + instructor?.name}}')` }}
                                    ></div>
                                ))
                            }
                        </div>
                        {
                            course?.program_faculty ? <div className="text-sm">
                                <span>Instructors: </span>
                                <a href="#" className="text-primary hover:underline">{course?.program_faculty?.[0]?.name}</a>
                                {course?.program_faculty?.length > 1 && <span> +{course?.program_faculty && course?.program_faculty?.length - 1} more</span>}
                            </div> : <div className="text-sm">
                                <span>Instructors: </span>
                                <span className="text-gray-600">No instructors found</span>
                            </div>
                        }
                    </div>
                    <div className="space-y-4 mb-2">
                        {
                            !enrolled && <button
                                className={`bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-md font-medium transition-colors w-full md:w-auto`}
                                onClick={enrollNow}
                            >
                                {enrolled ? 'Enrolled' : 'Enroll Now'}
                            </button>
                        }
                        {
                            enrolled && <button
                                className="bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-md font-medium transition-colors w-full md:w-auto"
                                onClick={continueLearning}
                            >
                                Continue Learning
                            </button>
                        }
                    </div>
                    <div className="text-gray-700 mb-8">
                        <span className="font-bold text-black">43,165</span> already enrolled
                    </div>
                </div>
            </div>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-5 bg-white p-6 rounded-lg shadow-sm">
                    <div className='border-r-0 border-b md:border-b-0 md:border-r py-3 md:py-0 border-gray-200 px-3 flex flex-col justify-center'>
                        <h6 className="font-bold">{course?.modules?.length} module</h6>
                        <p className="text-xs text-gray-600">Gain insight into a topic and learn the fundamentals.</p>
                    </div>
                    <div className='border-r-0 border-b md:border-b-0 md:border-r py-3 md:py-0 border-gray-200 px-3 flex flex-col justify-center'>
                        <h6 className="font-bold">Program</h6>
                        <p className={`text-xs text-gray-600 ${course?.program_status?.program_status == 'upcoming' ? 'text-yellow-600' : course?.program_status?.program_status == 'Ongoing' ? 'text-green-600' : 'text-blue-600'}`}>
                            {course?.program_status?.program_status == 'upcoming' ? 'Upcoming' : course?.program_status?.program_status == 'Ongoing' ? 'Ongoing' : 'Completed'}
                        </p>
                        <p className='text-xs text-gray-600'>{course?.program_status.program_time}</p>
                    </div>
                    <div className='px-3 py-3 md:py-0 flex flex-col justify-center border-r-0 border-b md:border-b-0 md:border-r border-gray-200'>
                        <h6 className="font-bold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up-fill mr-1 text-blue-600" viewBox="0 0 16 16">
                                <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                            </svg>
                            Enrolled
                        </h6>
                        <p className="text-sm text-gray-600">
                            {course?.student_enrolled} students
                        </p>
                    </div>
                    <div className='px-3 py-3 md:py-0 flex flex-col justify-center'>
                        <h6 className="font-bold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up-fill mr-1 text-blue-600" viewBox="0 0 16 16">
                                <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                            </svg>
                            Instructors
                        </h6>
                        <p className="text-sm text-gray-600">
                            {course?.program_faculty?.length} instructors
                        </p>
                    </div>
                </div>
            </div>
            <div className="mx-auto p-4 bg-white rounded-lg shadow-sm mt-5">
                <nav className="border-b border-gray-200 mb-4 sticky top-16 bg-white z-10 w-full">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-gray-500">
                        <li className="mr-6">
                            <button className={`inline-block p-4 ${tab == 'about' ? 'text-primary border-blue-900 border-b-2' : 'hover:text-gray-600'}`} onClick={() => setTab('about')}>About</button>
                        </li>
                        <li className="mr-6">
                            <button className={`inline-block p-4 ${tab == 'modules' ? 'text-primary border-blue-900 border-b-2' : 'hover:text-gray-600'}`} onClick={() => setTab('modules')}>Modules</button>
                        </li>
                    </ul>
                </nav>
                {
                    tab == 'about' && <section>
                        <div className="mb-5">
                            <p className="text-gray-600">{course?.description}</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{`Skills you'll gain`}</h2>
                            <div className="flex flex-wrap gap-3">
                                {
                                    course?.course_skills != '' && course?.course_skills?.split(',')?.map((item, index) => (
                                        <span key={`skills_you_will_gain-${index}`} className="px-4 py-2 bg-gray-100 hover:text-primary cursor-pointer rounded-md text-gray-700
                                    hover:bg-gray-200 transition-colors">{item}</span>
                                    ))
                                }
                            </div>
                        </div>
                    </section>
                }
                {
                    tab == 'modules' && <section>
                        <h2 className="text-2xl font-bold mb-3">There is {course?.modules?.length} module in this course</h2>
                        {
                            course?.modules.map((module, index) => (
                                <Link key={`module-${index}`} to={`/courses/${course?.id}/modules/${module?.id}`} className="block">
                                    <div className="border border-gray-200 p-4 rounded-lg mb-4 hover:shadow-md hover:border-primary hover:transform transition-all group cursor-pointer">
                                        <h3 className="text-lg font-bold mb-3 group-hover:text-primary">{module.name}</h3>
                                        <p className="text-gray-600 line-clamp-3">{module.description}</p>
                                        <ul className="mt-3">
                                            {/* duration */}
                                            <li className="flex items-center space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                                                </svg>
                                                {/* <span>{module.duration}</span> */}
                                            </li>
                                        </ul>
                                    </div>
                                </Link>
                            ))
                        }
                    </section>
                }
            </div>
        </div>
    )
}

export default CourseShow
