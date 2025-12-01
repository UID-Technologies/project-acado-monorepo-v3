import { useEffect, useState } from 'react'
import Loading from '@/components/shared/Loading'
import { Alert } from '@/components/ui'
import { fetchAppliedCourseList } from '@services/learner/AppliedCourseListService'
import { fetchAppliedUniversities } from '@services/learner/AppliedUniversityService'
import { useAppliedCourseListStore } from '@app/store/learner/courseListStore'
import { useAppliedUniversitiesStore } from '@app/store/public/___universitiesStore'
import { Link } from 'react-router-dom'
import ProgramCard from '../../public/components/ui/ProgramCard'

export default function ApplicationPage() {
    const [tab, setTab] = useState('applied course')
    const {
        appliedCourseList,
        setAppliedCourseList,
        error: courseError,
        setError: setCourseError,
        loading: courseLoading,
        setLoading: setCourseLoading,
    } = useAppliedCourseListStore()
    const {
        appliedUniversities,
        setAppliedUniversities,
        error: universityError,
        setError: setUniversityError,
        loading: universityLoading,
        setLoading: setUniversityLoading,
    } = useAppliedUniversitiesStore()

    const getAppliedCourses = async () => {
        setCourseLoading(true)
        setCourseError(null)
        fetchAppliedCourseList()
            .then((courses) => {
                setAppliedCourseList(courses)
            })
            .catch((error) => {
                setCourseError('Failed to fetch applied courses')
            })
            .finally(() => setCourseLoading(false))
    }

    const getAppliedUniversities = async () => {
        setUniversityLoading(true)
        setUniversityError('')
        fetchAppliedUniversities()
            .then((universities) => {
                setAppliedUniversities(universities)
            })
            .catch((error) => {
                setUniversityError('Failed to fetch applied universities')
            })
            .finally(() => setUniversityLoading(false))
    }

    useEffect(() => {
        getAppliedCourses()
        getAppliedUniversities()
    }, [])

    if (courseLoading || universityLoading) {
        return <Loading loading={courseLoading || universityLoading} />
    }

    if (courseError || universityError) {
        return <Alert title={courseError || universityError} type="danger" />
    }

    return (
        <div className="max-w-8xl p-4">
            <div>
                <h1 className="text-3xl font-normal mb-4 text-primary dark:text-primary capitalize">
                    Dashboard Application
                </h1>
                <p className="text-2xl font-normal mb-4">
                    Invest in your Education
                </p>
            </div>

            {/* Responsive Tab Cards */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div
                    className={`w-full bg-gray-800 text-center p-3 rounded-lg cursor-pointer ${tab === 'applied course'
                        ? 'border-2 border-primary'
                        : 'border-2 border-gray-800'
                        }`}
                    onClick={() => setTab('applied course')}
                >
                    <h4 className="text-lg font-semibold capitalize text-primary dark:text-primary">
                        {Array.isArray(appliedCourseList) &&
                            appliedCourseList?.length}
                    </h4>
                    <h4 className="text-lg font-semibold capitalize text-primary dark:text-primary">
                        Applied Courses
                    </h4>
                </div>

                <div
                    className={`w-full bg-gray-800 text-center p-3 rounded-lg cursor-pointer ${tab === 'applied university'
                        ? 'border-2 border-primary'
                        : 'border-2 border-gray-800'
                        }`}
                    onClick={() => setTab('applied university')}
                >
                    <h4 className="text-lg font-semibold capitalize text-primary dark:text-primary">
                        {appliedUniversities?.length}
                    </h4>
                    <h4 className="text-lg font-semibold capitalize text-primary dark:text-primary">
                        Applied University
                    </h4>
                </div>

                {/* <div
                    className={`w-full bg-gray-800 text-center p-3 rounded-lg cursor-pointer ${
                        tab === 'progress courses'
                            ? 'border-2 border-primary'
                            : 'border-2 border-gray-800'
                    }`}
                    onClick={() => setTab('progress courses')}
                >
                    <h4 className="text-lg font-semibold capitalize text-primary dark:text-primary">
                        {appliedCourseList?.length}
                    </h4>
                    <h4 className="text-lg font-semibold capitalize text-primary dark:text-primary">
                        Progress Courses
                    </h4>
                </div> */}
            </div>

            {/* Tab Content */}
            <div className="mt-10">
                {tab === 'applied course' && (
                    <div>
                        <h3 className="text-xl font-semibold text-primary dark:text-primary mb-4">
                            Applied Courses
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {appliedCourseList.map((course) => (
                                <Link
                                    to={`/courses-show/${course.id}`}
                                    className="flex items-center bg-gray-800 rounded-lg"
                                    key={`course-${course.id}`}
                                >
                                    <ProgramCard program={course} />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'applied university' && (
                    <div>
                        <h3 className="text-xl font-semibold text-primary dark:text-primary mb-4">
                            Applied Universities
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {appliedUniversities.map((university) => (
                                <Link
                                    to={`/universities-show/${university.id}`}
                                    className="flex items-center bg-gray-800 rounded-lg"
                                    key={`university-${university.id}`}
                                >
                                    <div className="flex items-center bg-gray-800 rounded-lg">
                                        <img
                                            src={university.logo}
                                            alt={university.name}
                                            className="w-20 h-20 object-contain bg-white rounded-l-lg p-3"
                                        />
                                        <div className="p-3">
                                            <h4>{university.name}</h4>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'progress courses' && (
                    <div>
                        <h3 className="text-xl font-semibold text-primary dark:text-primary mb-4">
                            Progress Courses
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {appliedCourseList.map((course) => (
                                <Link
                                    to={`/courses-show/${course.id}`}
                                    className="flex items-center bg-gray-800 rounded-lg"
                                    key={`course-${course.id}`}
                                >
                                    <ProgramCard program={course} />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
