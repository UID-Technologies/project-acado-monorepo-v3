import Loading from "@/components/shared/Loading"
import { Alert } from "@/components/ui"
import { fetchFreeCourses } from "@services/public/LmsCourseService"
import { useFreeCourseStore } from "@app/store/public/___LmsCourseStore"
import { Eye, ThumbsUp } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"

function LMSCourseList() {
    const { freeCourses, loading, error, setFreeCourses, setLoading, setError } = useFreeCourseStore()

    useEffect(() => {
        setLoading(true)
        setError("")
        fetchFreeCourses()
            .then((response) => {
                setFreeCourses(response.data)
            })
            .catch((error) => {
                setError(error)
            })
            .finally(() => {
                setLoading(false)
                console.log("Courses fetched")
            })
    }, [setFreeCourses, setLoading, setError])

    if (loading && !freeCourses.length) {
        return <Loading loading={loading} />
    }

    if (error) {
        return <Alert type="danger" title={error} />
    }

    const courses = freeCourses.slice(0, 3) ?? []

    return (
        <section className="min-h-screen dark:bg-gray-900 bg-white text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="dark:text-primary text-primary text-3xl font-bold mb-2">Explore Courses</h1>
                        <p className="text-gray-400 text-xl">Stay Updated With Our Latest Courses</p>
                    </div>
                    <Link to='/freeCourseDetail/' className="dark:text-primary text-primary hover:text-primary text-lg">
                        View All
                    </Link>
                </div>

                <div className="space-y-4">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            to={`/course-module/${course.id}`}
                            className="block dark:bg-gray-800 bg-gray-300 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row h-full group items-center rounded transform transition-transform hover:scale-[1.02] cursor-pointer dark:bg-gray-700 bg-gray-200">
                                <div className="md:w-1/3 h-60 md:h-auto relative">
                                    <img
                                        src={course.image || "/placeholder.svg"}
                                        alt={course.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <span className="absolute top-4 right-4 dark:bg-primary bg-white text-black px-3 py-1 rounded text-sm font-medium">
                                        Free
                                    </span>
                                </div>
                                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold dark:text-primary text-primary mb-3 truncate">
                                            {course.name}
                                        </h2>

                                        {/* <p className="line-clamp-3 text-sm dark:text-gray-200 text-gray-500">{course.description}</p> */}
                                          <p
                                    dangerouslySetInnerHTML={{
                                        __html: course?.description.length > 300 ? course?.description.substring(0, 300) + "..." : course?.description,
                                    }}
                                    className="text-gray-600 dark:text-gray-300"
                                ></p>
                                    </div>

                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default LMSCourseList

