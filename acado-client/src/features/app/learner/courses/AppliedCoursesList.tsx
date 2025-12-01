import { useEffect } from "react"
import { useAppliedCourseListStore } from "@app/store/learner/appliedCourseStore"
import { fetchAppliedCourseList } from "@services/learner/AppliedCourseListService"
import type React from "react"
import { Link } from "react-router-dom"

const AppliedCoursesList: React.FC = () => {
  const { courseList, setCourseList, loading, setLoading, error, setError } = useAppliedCourseListStore()
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true)
      setError(''); // Reset error
      try {
        const data = await fetchAppliedCourseList()
        setCourseList(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [setCourseList, setLoading, setError])

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ""
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {[...Array(4)].map((_, index) => (
          <div key={index} className="overflow-hidden border rounded-md p-4">
            <div className="h-48 w-full bg-gray-200 animate-pulse" />
            <div className="mt-4 h-6 w-2/3 bg-gray-200 animate-pulse" />
            <div className="mt-2 h-4 w-full bg-gray-200 animate-pulse" />
            <div className="mt-2 h-4 w-4/5 bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed p-8 text-muted-foreground">
        Error: {error}
      </div>
    )
  }

  return (
    <div className='bg-white p-4 rounded-lg dark:bg-gray-800 overflow-hidden mb-6'>
      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 cursor-pointer lg:grid-cols-3">
        {courseList?.data.map((course) => (
          <div className="group" key={course.ID}>
            <div key={course.ID} className="overflow-hidden border rounded-md">
              <div className="aspect-video relative">
                <img
                  src={course.json.image_url || "/placeholder.svg"}
                  alt={course.json.post_title}
                  className="object-cover h-48 w-full"
                />
              </div>
              <div className="p-2">
                <div className="mt-4">
                  <h3 className="text-lg font-semibold dark:text-primary text-primary line-clamp-2">{course.json.post_title}</h3>
                </div>
                <div className="mt-2">
                  <p className="line-clamp-3 text-sm text-muted-foreground">{stripHtml(course.post_content)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AppliedCoursesList
