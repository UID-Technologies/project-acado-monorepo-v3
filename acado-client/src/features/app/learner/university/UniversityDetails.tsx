import React, { useEffect, useState } from 'react'

import {
    fetchUniversityById,
} from '@services/public/UniversitiesService'
import { useUniversityDetailsStore } from '@app/store/public/___universitiesStore'
import { Link, useParams } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { FaStar } from 'react-icons/fa'
import Loading from '@/components/shared/Loading'
import { Alert } from '@/components/ui'
import ProgramCard from '@public/components/ui/ProgramCard'
import { useFreeCourseStore } from '@app/store/public/___LmsCourseStore'
import { fetchFreeCourses } from '@services/public/LmsCourseService'
import { useBrochureLeadStore } from '@app/store/public/BrochureLeadStore'
import { fetchBrochure } from '@services/public/BrochureLeadService'
import { enqueueSnackbar } from 'notistack'
import "@features/app/common/Details.css";

function UniversityDetails() {
    const [tab, setTab] = useState('about')
    const { university_id } = useParams<{ university_id: string }>()
    const queryParams = new URLSearchParams(location.search)
    const [isOpen, setIsOpen] = useState(queryParams.get('isOpen') === 'true')
    const { freeCourses, setFreeCourses } = useFreeCourseStore()
    const { setBrochureLead } = useBrochureLeadStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState('')

    const {
        universityDetails,
        setUniversityDetails,
        error,
        setError,
        loading,
        setLoading,
    } = useUniversityDetailsStore()

    const getUniversityDetails = () => {
        if (!university_id) {
            setError('University ID is required')
            return
        }
        setLoading(true)
        setError('')
        fetchUniversityById(university_id)
            .then((response) => {
                setUniversityDetails(response)
            })
            .catch((error) => {
                setError(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        const params = new URLSearchParams();
        if (university_id) {
            params.append(`org_id`, university_id)
        }
        setLoading(true)
        setError('')
        fetchFreeCourses(params)
            .then((response) => {
                setFreeCourses(response.data)
            })
            .catch((error) => {
                setError(error)
            })
            .finally(() => {
                setLoading(false)
                console.log('Courses fetched')
            })
    }, [setFreeCourses, setLoading, setError, university_id])

    // const getCoursesByUniversityId = () => {
    //     if (!university_id) {
    //         setError('University ID is required');
    //         return
    //     }
    //     setLoading(true)
    //     setError('')
    //     fetchCoursesByUniversityId(university_id)
    //         .then((response) => {
    //             setCourses(response);
    //         })
    //         .catch((error) => {
    //             setError(error)
    //         }).finally(() => {
    //             setLoading(false)
    //         })
    // }

    useEffect(() => {
        getUniversityDetails()
        // getCoursesByUniversityId();
    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        setMessage('')
        const formData = new FormData(e.currentTarget)
        formData.set('university', universityDetails?.name ?? '')
        formData.set(
            'university_sort_name',
            universityDetails?.name?.slice(0, 4) ?? '',
        )

        try {
            await getBrochureLead(formData)
            setIsOpen(false)
            e.currentTarget.reset()
        } catch (error) {
            setMessage('Something went wrong. Please try again.');
            console.log(error);
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return <Loading loading={loading} />
    }

    if (error) {
        return <Alert type="danger" title={error} showIcon={true} />
    }

    const getBrochureLead = async (formData: FormData) => {
        try {
            setLoading(true)
            const brochureLeadData = await fetchBrochure(formData)
            setBrochureLead(brochureLeadData)
            enqueueSnackbar('Lead saved successfully', { variant: 'success' })
            console.log('fetch brochure lead', brochureLeadData)
        } catch (err) {
            setError('Brochure not found')
            enqueueSnackbar('Brochure not found', { variant: 'error' })
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-8">
            {university_id}
            <div
                // style={{
                //     // backgroundImage: `url('/img/event/event.jpg')`,
                //     backgroundImage: universityDetails?.banners.length
                //     ? `url(${ universityDetails.banners[0]})`
                //     : `url('/img/event/event.jpg')`,
                //     backgroundSize: "cover",
                //     backgroundPosition: "center",
                //     height: "500px",
                // }}
                style={{
                    backgroundImage:
                        Array.isArray(universityDetails?.banners) &&
                            universityDetails.banners.length > 0
                            ? `url(${universityDetails.banners[0]})`
                            : `url('/img/event/event.jpg')'`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '500px',
                }}
                className="flex justify-center items-end absolute h-[500px] w-full left-0 top-0"
            >
                <div className="absolute inset-0 bg-gray-900 opacity-50 dark:opacity-70"></div>
            </div>
            <div className="container mx-auto relative mt-16">
                <div
                    style={{
                        backgroundImage: `url(${universityDetails?.banners})`,
                    }}
                    className="w-full h-96 bg-cover bg-center rounded-md relative"
                >
                    {/* logo */}
                    <div className="absolute bottom-[-45px] ml-4 w-24 h-24 bg-white rounded-full border-4 overflow-hidden">
                        <img
                            src={`${universityDetails?.logo}`}
                            alt={universityDetails?.full_name ?? ''}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>
            {/* details */}
            <div className="rounded-md relative mt-16 px-4">
                <h1 className="text-2xl font-bold dark:text-primary text-primary">
                    {universityDetails?.full_name}
                </h1>
                <div className="flex items-center gap-4 mt-2 dark:text-white">
                    <p className="flex gap-1 items-center">
                        <MapPin size={16} /> {universityDetails?.city}
                    </p>
                    <div className="flex gap-2 items-center">
                        <p>Rating 5</p> |
                        <ul className="flex gap-1">
                            <li>
                                <FaStar size={16} className="text-yellow-600" />
                            </li>
                            <li>
                                <FaStar size={16} className="text-yellow-600" />
                            </li>
                            <li>
                                <FaStar size={16} className="text-yellow-600" />
                            </li>
                            <li>
                                <FaStar size={16} className="text-yellow-600" />
                            </li>
                            <li>
                                <FaStar size={16} className="text-yellow-600" />
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Downlod Brochure */}
                {/* <div className='mt-4'>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-primary text-ac-dark px-4 py-2 rounded-md"
                    >
                        View Brochure
                    </button>
                </div> */}
            </div>
            <div className="rounded-md relative px-4">
                {/*  tabs */}
                <div className="mt-4">
                    <div className="container mx-auto">
                        <div className="flex gap-5 border-b">
                            <Link
                                to=""
                                className={`text-primary font-bold py-3 ${tab == 'about' && 'border-b-2 border-primary'}`}
                                onClick={() => setTab('about')}
                            >
                                About
                            </Link>
                            <Link
                                to=""
                                className={`text-primary font-bold py-3 ${tab == 'why' && 'border-b-2 border-primary'}`}
                                onClick={() => setTab('why')}
                            >
                                Why We
                            </Link>
                            <Link
                                to=""
                                className={`text-primary font-bold py-3 ${tab == 'admission' && 'border-b-2 border-primary'}`}
                                onClick={() => setTab('admission')}
                            >
                                Admission
                            </Link>
                            <Link
                                to=""
                                className={`text-primary font-bold py-3 ${tab == 'courses' && 'border-b-2 border-primary'}`}
                                onClick={() => setTab('courses')}
                            >
                                Programs
                            </Link>
                            {/* <Link to='' className={`text-primary font-bold py-3 ${tab == 'placements' && 'border-b-2 border-primary'}`} onClick={() => setTab('placements')}>Placements</Link> */}
                        </div>
                    </div>
                </div>
                {/* tabs data */}
                <div className="container mx-auto mt-4">
                    {tab == 'about' && (
                        <div>
                            <h1 className="text-xl font-bold dark:text-primary text-primary">
                                <span className='relative before:content-[""] before:absolute before:h-1 before:bg-primary before:w-full before:bottom-[-5px]'>
                                    About
                                </span>{' '}
                                {universityDetails?.name}{' '}
                            </h1>
                            <div
                                className="text-sm dark:text-gray-200 mt-8"
                                dangerouslySetInnerHTML={{
                                    __html: universityDetails?.about
                                        ? universityDetails.about
                                        : '',
                                }}
                            ></div>
                            {/* features */}
                            {/* <div className='mt-4'>
                                <ul className='mt-4 dark:text-gray-300'>
                                    <li className='flex gap-4 items-center mb-5'>
                                        <BiRightArrow size={30} className='text-primary' />
                                        <div>
                                            <p className='text-primary text-2xl'>{universityDetails?.org_description}</p>
                                            <span className='text-gray-400'>Languages</span>
                                        </div>
                                    </li>
                                    <li className='flex gap-4 items-center mb-5'>
                                        <BiRightArrow size={30} className='text-primary' />
                                        <div>
                                            <p className='text-primary text-2xl'>{universityDetails?.university_meta_data?.overview_tab_highlights_1_highlights_row_content}</p>
                                            <span className='text-gray-400'>Degree Programmes</span>
                                        </div>
                                    </li>
                                    <li className='flex gap-4 items-center mb-5'>
                                        <BiRightArrow size={30} className='text-primary' />
                                        <div>
                                            <p className='text-primary text-2xl'>{universityDetails?.university_meta_data?.overview_tab_highlights_2_highlights_row_content}</p>
                                            <span className='text-gray-400'>Partner Companies</span>
                                        </div>
                                    </li>
                                    <li className='flex gap-4 items-center mb-5'>
                                        <BiRightArrow size={30} className='text-primary' />
                                        <div>
                                            <p className='text-primary text-2xl'>{universityDetails?.university_meta_data?.overview_tab_highlights_3_highlights_row_content}</p>
                                            <span className='text-gray-400'>Degree Students</span>
                                        </div>
                                    </li>
                                </ul>
                            </div> */}
                        </div>
                    )}
                    {tab == 'why' && (
                        <div>
                            <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-md hover:transform hover:scale-105 transition-all">
                                {/* <h1 className='text-xl font-bold dark:text-primary text-primary'>{universityDetails?.}</h1> */}
                                <div
                                    className="text-sm dark:text-gray-200 mt-2"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            universityDetails?.why_this_university ??
                                            '',
                                    }}
                                ></div>
                            </div>
                            {/* <div className='bg-gray-200 dark:bg-gray-800 p-3 rounded-md mt-4 hover:transform hover:scale-105 transition-all'>
                                <h1 className='text-xl font-bold dark:text-primary text-primary'>{universityDetails?.university_meta_data?.why_university_tab_1_why_university_title}</h1>
                               
                                <div className="text-sm dark:text-gray-200 mt-2" dangerouslySetInnerHTML={{
                                    __html: universityDetails?.university_meta_data?.why_university_tab_1_why_university_description.replace(/\n/g, '<br />') || ''
                                }}></div>
                            </div> */}
                            {/* <div className='bg-gray-200 dark:bg-gray-800 p-3 rounded-md mt-4 hover:transform hover:scale-105 transition-all'>
                                <h1 className='text-xl font-bold dark:text-primary text-primary'>{universityDetails?.university_meta_data?.why_university_tab_2_why_university_title}</h1>
                             
                                <div className="text-sm dark:text-gray-200 mt-2" dangerouslySetInnerHTML={{
                                    __html: universityDetails?.university_meta_data?.why_university_tab_2_why_university_description.replace(/\n/g, '<br />') || ''
                                }}></div>
                            </div> */}
                        </div>
                    )}
                    {tab == 'admission' && (
                        <div>
                            <div
                                className="text-sm dark:text-gray-200 mt-2 custom-html-container"
                                dangerouslySetInnerHTML={{
                                    __html: universityDetails?.admission ?? '',
                                }}
                            ></div>
                        </div>
                    )}

                    {
                        // tab == 'placements' && (
                        //     <div>
                        //         <h1 className="text-xl font-bold dark:text-primary text-primary"><span
                        //             className='relative before:content-[""] before:absolute before:h-1 before:bg-primary before:w-full before:bottom-[-5px]'>Placements</span> {universityDetails?.name} </h1>
                        //         <div className='mt-4'>
                        //             {/* <p className='dark:text-gray-300'>{universityDetails?.university_meta_data?.placements_tab_description}</p> */}
                        //             <div className="text-sm dark:text-gray-200 mt-2" dangerouslySetInnerHTML={{
                        //                 __html: universityDetails?.placements || ''
                        //             }}></div>
                        //         </div>
                        //     </div>
                        // )
                    }

                    {tab == 'courses' && (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {freeCourses?.map((course, index) => (
                                <Link key={index} to={`/courses-show/${course?.id}`} >
                                    <ProgramCard
                                        key={course.id}
                                        program={course}
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold dark:text-primary text-primary">
                                Download Brochure
                            </h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
                                onClick={() => setIsOpen(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-200 mb-1">
                                    Name
                                </label>
                                <input
                                    required
                                    name="name"
                                    type="text"
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium dark:text-gray-200 mb-1">
                                    Email
                                </label>
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium dark:text-gray-200 mb-1">
                                    Mobile
                                </label>
                                <input
                                    required
                                    name="mobile"
                                    type="tel"
                                    pattern="[0-9]{10}"
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium dark:text-gray-200 mb-1">
                                    Education
                                </label>
                                <input
                                    required
                                    name="education"
                                    type="text"
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary dark:text-ac-dark text-ac-dark p-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? 'Downloading...'
                                    : 'Download Brochure'}
                            </button>

                            {message && (
                                <div className="text-red-500 text-sm mt-2">
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UniversityDetails
