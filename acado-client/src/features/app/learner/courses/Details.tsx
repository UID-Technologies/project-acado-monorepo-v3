import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { fetchCourseById } from '@services/public/CoursesService'
import { useParams } from 'react-router-dom'
import { CourseDetails } from '@app/types/common/university'

import Loading from '@/components/shared/Loading'
import ApplyNowButton from '@/components/shared/ApplyNowButton';
import { Alert } from '@/components/ui'
import { Link } from 'react-router-dom'
import { Clock, Clock1 } from 'lucide-react'
import { BsPeople } from 'react-icons/bs'
import { BiRightArrow } from 'react-icons/bi'
import '@/assets/styles/wordpress.css'
import {
    Award,
    BookOpen,
    Building2,
    DollarSign,
    GraduationCap,
    Languages,
    UserCheck,
} from 'lucide-react'
import { fetchLmsCourseMeta } from '@services/common/CourseService'
import { useCourseDetailsStore } from '@app/store/public/CoursesStore'
import type { Courses } from '@app/types/common/courses'
import { Swiper, SwiperSlide } from 'swiper/react'
import DummyImage from '@/assets/images/event.jpg'
import { useNavigate } from 'react-router-dom'
import { applyCourse } from '@services/learner/CourseListServices'
import { enqueueSnackbar } from 'notistack'
import { applyCourse2 } from '@services/learner/CourseListServices'
import '../../common/Details.css'

const iconComponents = {
    GraduationCap,
    UserCheck,
    BookOpen,
    Clock,
    Building2,
    DollarSign,
    Award,
    Languages,
}

const CourseShow: React.FC = () => {
    const { course_id } = useParams()
    const [course, setCourse] = React.useState<Courses>()
    const {
        setCourseDetails,
        courseDetails,
        error,
        setError,
        loading,
        setLoading,
    } = useCourseDetailsStore()
    const [activeSection, setActiveSection] = useState<string>('about-the-program')
    const [inputValue, setInputValue] = useState('')
    const [areYouSureModal, setAreYouSureModal] = useState(false)
    const [formData, setFormData] = useState<any>(null) // <-- to store form response
    const navigate = useNavigate()

    const sections = [
        'about-the-program',
        'Course-Insights',
        'Course-Structure',
        'What-you-will-get',
        'Learning-Outcomes',
        'International-Partners',
        'Industrial-Collaborations',
        'Career-Opportunities',
        'Highlights-of-the-Program',
    ];

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await axios.get(
                    // `http://57.159.29.149:4000/forms/by-course/${course_id}`,
                    `https://caf.acado.ai/forms/by-course/${course_id}`,
                )
                if (res.data && res.data.formId) {
                    setFormData(res.data)
                } else {
                    setFormData(null)
                }
                
                // setFormData({
                //         "formId": "68fea24ee95f59ee6b286d8a",
                //         "name": "Application Form",
                //         "title": "Application Form",
                //         "status": "draft",
                //         "allForms": [
                //             {
                //                 "formId": "68fea24ee95f59ee6b286d8a",
                //                 "name": "Application Form",
                //                 "title": "Application Form",
                //                 "status": "draft"
                //             }
                //         ]
                //     })
            } catch (err) {
                console.error('Error fetching form info:', err)
                setFormData(null)
            }
        }

        if (course_id) fetchForm()
    }, [course_id])

    // alert(formData)


    const handleFillForm = () => {
            if (!formData?.formId) return

            function encodeAuthData(authData) {
                // Encode the authentication data as base64
                const jsonString = JSON.stringify(authData);
                return btoa(encodeURIComponent(jsonString));
            }

            const userData = localStorage.getItem('sessionUser');
            const userDataParsed = JSON.parse(userData);
            // alert(userDataParsed.state.user.name)
            // return false;
            const mockLearnerAuthData = {
                email: userDataParsed.state.user.email,
                role: userDataParsed.state.user.role,
                name: userDataParsed.state.user.name,
                userId: userDataParsed.state.user.id
            };
            const encodedAuth = encodeAuthData(mockLearnerAuthData);

            const url = `http://57.159.29.149:8080/user/login?formId=${formData.formId}&auth=${encodedAuth}`;

            window.open(url, '_blank');
    }
    // useEffect(() => {
    //     setError('')
    //     if (!course_id) {
    //         setError('Course ID is required')
    //         return
    //     }
    //     // if id is not a number
    //     if (isNaN(Number(course_id))) {
    //         setError('Invalid Course ID')
    //         return
    //     }
    //     setLoading(true)
    //     // fetchCourseById(course_id)
    //     //     .then((data) => {
    //     //         setCourseDetails(data)
    //     //     })
    //     //     .catch((error) => {
    //     //         setError(error)
    //     //     })
    //     //     .finally(() => {
    //     //         setLoading(false)
    //     //     })
    // }, [])

    const applyNow = async (
        courseid: number,
        universityId: number,
        reason: string,
    ) => {
        const response = await applyCourse({
            wp_center_id: universityId,
            program_id: courseid,
            reason: reason,
        })
        if (response) {
            setAreYouSureModal(false)
            enqueueSnackbar('Course applied successfully', {
                variant: 'success',
            })
            // navigate('/course-module/' + courseid);
            navigate('/application')
        }
    }

    // const applyNow2 = async (
    //             courseid: number,
    //             universityId: number,
    //             reason: string,
    //         ) => {
    //             const response = await applyCourse2({
    //                 wp_center_id: universityId,
    //                 program_id: courseid,
    //                 reason: reason,
    //             })
    //             if (response) {
    //                 setAreYouSureModal(false)
    //                 enqueueSnackbar('Course applied successfully', {
    //                     variant: 'success',
    //                 })
    //                 // navigate('/course-module/' + courseid);
    //                 // navigate('/application')
    //             }
    //         }

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150 // Adjust offset as needed
            sections.forEach((sectionId) => {
                const section = document.getElementById(sectionId)
                if (section) {
                    const sectionTop = section.offsetTop
                    const sectionBottom = sectionTop + section.offsetHeight

                    if (
                        scrollPosition >= sectionTop &&
                        scrollPosition < sectionBottom
                    ) {
                        setActiveSection(sectionId)
                    }
                }
            })
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [sections])

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId)
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' })
        }
    }

    React.useEffect(() => {
        if (!course_id) {
            setError('Course ID not found')
            setLoading(false)
            return
        }

        setLoading(true)
        setError('')
        fetchLmsCourseMeta(course_id)
            .then((res) => {
                setCourse(res)
            })
            .catch((err) => {
                console.log(err)
                setError(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [course_id, setError, setLoading])

    if (loading) {
        return <Loading loading={loading} />
    }

    if (error) {
        return (
            <Alert
                title={error}
                showIcon={true}
                type="danger"
                className="mt-8"
            />
        )
    }

    const sanitizedContent = course?.course_heading ?? ''
    // const duration = courseDetails?.json?.meta_data?._lp_duration || "N/A";

    const what_your_will_learn_section = [
        {
            title: 'Hands-On Training',
            icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hands-on-training-yJhUj2cl2baCc4M05sg4JHPzdIZino.png',
            description:
                'Get practical experience through interactive sessions',
        },
        {
            title: 'Proximity to Finland Tourism',
            icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/proximity-to-finland-tourism-QrWHkgk65piChjCwVRWKLh9RB7nLV1.png',
            description: 'Learn about Finnish tourism industry firsthand',
        },
        {
            title: 'Projects Development',
            icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/project-J5B3C8M4xQ4KK6HwsXYXpGyKSoTe4q.png',
            description: 'Work on real-world projects and case studies',
        },
        {
            title: 'Impactful Internships',
            icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/internship-iAMmtt7glu8kHufJAmTRKbHJ03QQZ4.png',
            description: 'Gain valuable industry experience',
        },
        {
            title: 'Innovative Learning Approach',
            icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/innovative-learning-approach-tawp6Kjl4yDNsw4xU0LQ8TjfJPW903.png',
            description: 'Experience modern educational methodologies',
        },
        {
            title: 'Assessments',
            icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/assessment-b8ZAh9xJbjVOSLftc1QtEIyAGnIWRp.png',
            description: 'Track your progress with regular evaluations',
        },
    ]
    const bannersArray = Array.isArray(course?.banners)
        ? course.banners
        : [course?.banners]

    return (
        <div className="mt-8">
            <div
                style={{
                    backgroundImage: `url('/img/event/event.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '500px',
                }}
                className="flex justify-center items-end absolute h-[500px] w-full left-0 top-0"
            >
                <div className="absolute inset-0 bg-gray-900 opacity-50 dark:opacity-70"></div>
            </div>
            {/* <div className="flex space-x-4 overflow-x-auto">
                <Swiper spaceBetween={10} slidesPerView={1} loop>
                    {bannersArray.map((banner, index) => (
                        <SwiperSlide key={index}>
                            <div
                                key={index}
                                style={{
                                    backgroundImage: banner !== null ? `url(${banner})` : `url(${DummyImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    height: "500px",

                                }}
                                className="flex justify-center items-end absolute h-[500px] w-full left-0 top-0"
                            />
                        </SwiperSlide>

                    ))}
                </Swiper>
            
            </div> */}
            <div className="container mx-auto relative mt-48">
                <div className="grid grid-cols-1 md:grid-cols-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div
                        style={{
                            backgroundImage: `url(${course?.course_image || '/img/event/event.jpg'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'top',
                            height: '300px',
                        }}
                        className="col-span-2 md:rounded-s-lg rounded-t-lg md:rounded-r-none"
                    >
                        {/* <img src={courseDetails?.json?.image_url} alt="logo" className="md:rounded-s-lg rounded-t-lg md:rounded-r-none w-full" /> */}
                    </div>
                    <div className="w-full px-5 col-span-3">
                        <div className="flex flex-wrap justify-between items-center gap-3 border-b py-4 mb-3 overflow-hidden">
                            <h1 className="text-2xl md:text-2xl font-bold text-primary dark:text-primary">
                                {course?.course_name}
                            </h1>
                            <div>
                                {/* <Link to={`/courses-show/${course_id}`} className="text-nowrap bg-primary text-white dark:text-gray-900 font-bold py-2 px-6 rounded hover:bg-primary-light dark:hover:bg-primary-dark transition whitespace-nowrap">
                                    Apply Now
                                </Link> */}
                                <button
                                    onClick={() => setAreYouSureModal(true)}
                                    className="text-nowrap bg-primary text-white dark:text-gray-900 font-bold py-2 px-6 rounded hover:bg-primary-light dark:hover:bg-primary-dark transition"
                                >
                                    Apply Now
                                </button>

                                {/*<button
                                    onClick={() =>
                                    applyNow2(
                                        Number(course_id),
                                        Number(course?.org_id),
                                        inputValue,
                                    )
                                }
                                    className="text-nowrap bg-primary text-white dark:text-gray-900 font-bold py-2 px-6 rounded hover:bg-primary-light dark:hover:bg-primary-dark transition"
                                >
                                    Apply Now
                                </button>*/}

                                {/*<ApplyNowButton
                                    course_id={course_id}
                                    course={course}
                                    inputValue={inputValue}
                                  />*/}
                            </div>
                        </div>
                        <div>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html:
                                        sanitizedContent.length > 300
                                            ? sanitizedContent.substring(
                                                  0,
                                                  300,
                                              ) + '...'
                                            : sanitizedContent,
                                }}
                                className="text-gray-600 dark:text-gray-300"
                            ></p>
                            <div className="my-4"></div>
                        </div>
                    </div>
                </div>
                {/* 2 cols where left 300px and right side complete */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                    <div className="col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sticky top-24">
                            <h3 className="text-xl font-bold text-primary dark:text-primary">
                                About the Program
                            </h3>
                            <ul className="mt-4 list-inside text-gray-600 dark:text-gray-300">
                                {sections.map((sectionId) => (
                                    <li key={sectionId}>
                                        <button
                                            onClick={() =>
                                                scrollToSection(sectionId)
                                            }
                                            className={`flex gap-3 py-1 hover:text-primary capitalize ${
                                                activeSection === sectionId
                                                    ? 'text-primary font-bold'
                                                    : ''
                                            }`}
                                        >
                                            {sectionId.replace(/-/g, ' ')}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-9">
                        {course?.about_course && (
                            <div
                                className="rounded-lg shadow-lg p-5 dark:bg-gray-800"
                                id="about-the-program"
                                style={{ scrollMarginTop: '95px' }}
                            >
                                <h3 className="text-xl font-bold text-primary dark:text-primary">
                                    About the Program
                                </h3>
                                <div
                                    className="mt-4 text-gray-600 dark:text-gray-300 add-ul-li custom-html-container"
                                    dangerouslySetInnerHTML={{
                                        __html: course?.about_course?.replace(
                                            /\n/g,
                                            '<br />',
                                        ),
                                    }}
                                ></div>
                            </div>
                        )}
                        <div
                            className="rounded-lg shadow-lg p-5 mt-4 dark:bg-gray-800"
                            id="Course-Insights"
                            style={{ scrollMarginTop: '95px' }}
                        >
                            {/* <p className="text-gray-600 dark:text-gray-300"
                                dangerouslySetInnerHTML={{ __html: courseDetails?.course_meta_data?.what_is_in_program }}>
                            </p> */}
                            <h3 className="text-2xl font-bold text-primary dark:text-primary mb-6">
                                Course Insights
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    {
                                        icon: 'GraduationCap',
                                        title: 'Degree',
                                        value: course?.degree,
                                    },
                                    {
                                        icon: 'UserCheck',
                                        title: 'Eligibility',
                                        value: course?.eligibility,
                                    },
                                    {
                                        icon: 'BookOpen',
                                        title: 'Field of study',
                                        value: course?.field_of_study,
                                    },
                                    {
                                        icon: 'Clock',
                                        title: 'Duration',
                                        value: course?.duration,
                                    },
                                    {
                                        icon: 'Building2',
                                        title: 'School / department',
                                        value: course?.school_department,
                                    },
                                    {
                                        icon: 'DollarSign',
                                        title: 'Tuition fee',
                                        value: course?.tuition_fee,
                                    },
                                    {
                                        icon: 'Award',
                                        title: 'Number of Credits',
                                        value: course?.number_of_credits,
                                    },
                                    {
                                        icon: 'Languages',
                                        title: 'Language of instruction',
                                        value: course?.language,
                                    },
                                    {
                                        icon: 'GraduationCap',
                                        title: 'Scholarship',
                                    },
                                ].map((item, index) => {
                                    const IconComponent =
                                        iconComponents[
                                            item.icon as keyof typeof iconComponents
                                        ]
                                    return (
                                        <div
                                            key={index}
                                            className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-start space-x-4"
                                        >
                                            <div className="bg-primary text-white p-2 rounded-full">
                                                {IconComponent && (
                                                    <IconComponent className="w-6 h-6" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                    {item.title}
                                                </h4>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    {item.value}
                                                </p>
                                                {item.title ===
                                                    'Tuition fee' && (
                                                    <a
                                                        href="#"
                                                        className="text-primary hover:underline mt-1 inline-block"
                                                    >
                                                        Read more
                                                    </a>
                                                )}
                                                {item.title ===
                                                    'Scholarship' && (
                                                    <p
                                                        className="text-gray-600 dark:text-gray-300 mt-1"
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                course?.scholarship ||
                                                                '',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {course?.degree_type && (
                            <div
                                className="rounded-lg shadow-lg p-5 mt-4 bg-white dark:bg-gray-800"
                                id="apply"
                                style={{ scrollMarginTop: '95px' }}
                            >
                                <div className="relative bg-[#D4A088] py-16 px-4 md:px-8">
                                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                                        <h1 className="text-3xl md:text-4xl font-bold text-black">
                                            Applying to <span className='capitalize'>{course?.degree_type}</span>'s Degree
                                            programmes
                                        </h1>
                                        {/* <div className="absolute top-4 right-4 md:static">
                                            <div
                                                className="inline-block bg-[#FFE17F] px-6 py-3 text-black font-semibold rounded-md hover:bg-[#FFD700] transition-colors"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        course?.how_to_apply ||
                                                        '',
                                                }}
                                            />
                                        </div> */}
                                        <button
                                            onClick={() =>
                                                setAreYouSureModal(true)
                                            }
                                            className="text-nowrap bg-primary text-white dark:text-gray-900 font-bold py-3 px-8 rounded hover:bg-primary-light dark:hover:bg-primary-dark transition"
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {course?.course_structure && (
                            <div
                                className="rounded-lg shadow-lg p-5 mt-4 dark:bg-gray-800"
                                id="Course-Structure"
                                style={{ scrollMarginTop: '95px' }}
                            >
                                <h3 className="text-2xl font-bold text-primary dark:text-primary mb-3">
                                    Course Structure
                                </h3>
                                <p
                                    className="text-gray-600 dark:text-gray-300 add-ul-li custom-html-container"
                                    dangerouslySetInnerHTML={{
                                        __html: course?.course_structure,
                                    }}
                                ></p>
                            </div>
                        )}

                        {course?.what_you_will_get && (
                            <div
                                className="rounded-lg shadow-lg p-5 mt-4 dark:bg-gray-800"
                                id="Course-Structure"
                                style={{ scrollMarginTop: '95px' }}
                            >
                                <h3 className="text-2xl font-bold text-primary dark:text-primary mb-3">
                                    What you will get?
                                </h3>
                                <p
                                    className="text-gray-600 dark:text-gray-300 add-ul-li custom-html-container"
                                    dangerouslySetInnerHTML={{
                                        __html: course?.what_you_will_get,
                                    }}
                                ></p>
                            </div>
                        )}

                        {course?.learning_outcome && (
                            <div
                                className="rounded-lg shadow-lg p-5 mt-4 dark:bg-gray-800"
                                id="Learning-Outcomes"
                                style={{ scrollMarginTop: '95px' }}
                            >
                                <h2 className="text-2xl font-bold text-primary dark:text-primary mb-6">
                                    Learning Outcomes
                                </h2>
                                <p
                                    className="text-gray-600 dark:text-gray-300 add-ul-li custom-html-container"
                                    dangerouslySetInnerHTML={{
                                        __html: course?.learning_outcome,
                                    }}
                                ></p>
                            </div>
                        )}
                        {course?.partners && (
                            <div
                                className="rounded-lg shadow-lg p-5 mt-4 dark:bg-gray-800"
                                id="International-Partners"
                                style={{ scrollMarginTop: '95px' }}
                            >
                                <h2 className="text-2xl font-bold text-primary dark:text-primary mb-6">
                                    International Partners
                                </h2>
                                <p
                                    className="text-gray-600 dark:text-gray-300 add-ul-li custom-html-container"
                                    dangerouslySetInnerHTML={{
                                        __html: course?.partners,
                                    }}
                                ></p>
                            </div>
                        )}
                        {course?.collaboration && (
                            <div
                                className="rounded-lg shadow-lg p-5 mt-4 dark:bg-gray-800"
                                id="Industrial-Collaborations"
                                style={{ scrollMarginTop: '95px' }}
                            >
                                <h3 className="text-2xl font-bold text-primary dark:text-primary mb-3">
                                    Industrial Collaborations
                                </h3>
                                <div
                                    className="text-gray-600 dark:text-gray-300 gap-4 add-ul-li custom-html-container"
                                    dangerouslySetInnerHTML={{
                                        __html: course?.collaboration,
                                    }}
                                ></div>
                            </div>
                        )}
                        {course?.career_opportunities && (
                            <div
                                className="rounded-lg shadow-lg p-5 mt-4 dark:bg-gray-800"
                                id="Career-Opportunities"
                                style={{ scrollMarginTop: '95px' }}
                            >
                                <h3 className="text-2xl font-bold text-primary dark:text-primary mb-3">
                                    Career Opportunities
                                </h3>
                                <div
                                    className="text-gray-600 dark:text-gray-300  gap-4 add-ul-li custom-html-container"
                                    dangerouslySetInnerHTML={{
                                        __html: course?.career_opportunities,
                                    }}
                                ></div>
                            </div>
                        )}

                        {course?.course_usp && (
                            <div
                                className="rounded-lg shadow-lg p-5 mt-4 dark:bg-gray-800"
                                id="USP`s-Of-the-Program"
                                style={{ scrollMarginTop: '95px' }}
                            >
                                <h3 className="text-2xl font-bold text-primary dark:text-primary mb-3">
                                    Highlights of the Program
                                </h3>

                                <div
                                    className="leading-relaxed text-gray-600 dark:text-gray-300 add-ul-li custom-html-container"
                                    dangerouslySetInnerHTML={{
                                        __html: course?.course_usp,
                                    }}
                                />
                                {/* </div> */}
                            </div>
                        )}

                        {/* _lp_faqs */}
                        {/* <div className='rounded-lg shadow-lg p-5 mt-4 dark:bg-gray-800' id='faq' style={{ scrollMarginTop: '95px' }}>
                            <h3 className="text-2xl font-bold text-primary dark:text-primary mb-5">Frequently Asked Questions</h3>
                            {
                                courseDetails?.json?.meta_data?._lp_faqs?.map((faq, index) => (
                                    <div key={index} className="mb-4">
                                        <h6 className="text-md font-bold text-primary dark:text-primary">{faq[0]}</h6>
                                        <p className="text-gray-600 dark:text-gray-300">{faq[1]}</p>
                                    </div>
                                ))
                            }
                        </div> */}
                    </div>
                </div>
            </div>
            {areYouSureModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[500px] sm:w-[450px]">
                        <h3 className="text-xl font-bold text-primary dark:text-primary">
                            {formData?.formId ? 'Apply Now - Ready to Take the Next Step?' : 'Are you sure?'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            
                            {formData?.formId ? `You’re just one step away from your dream course!
                                                Show your interest to get more details and guidance, or fill out the application now to start your journey.` : 'Please share your expectation from the course?'}
                        </p>

                        {!formData?.formId && (
                            <textarea
                                placeholder="Expectation (optional)"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full mt-3 p-2 border rounded dark:bg-gray-700 dark:text-white resize-none h-24"
                            ></textarea>
                        )}

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => setAreYouSureModal(false)}
                                className="bg-danger dark:text-gray-900 font-bold py-2 px-6 rounded border text-black dark:bg-white"
                            >
                                May Be Later
                            </button>
                            <button
                                onClick={() =>
                                    applyNow(
                                        Number(course_id),
                                        Number(course?.org_id),
                                        inputValue,
                                    )
                                }
                                className="bg-primary text-white dark:text-gray-900 font-bold py-2 px-6 rounded hover:bg-primary-light dark:hover:bg-primary-dark transition"
                            >
                                I’m Interested
                            </button>

                            {formData?.formId && (
                                <button
                                    onClick={handleFillForm}
                                    className="bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition"
                                >
                                    I’m Ready to Apply
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CourseShow
