import CourseCard from "./AppliedCoursesList"

export default function CoursesGrid() {

  const courses = Array(3).fill({
    title: "Architectural Design & Technology M.Sci",
    university: "Coventry University",
    location: "England",
    duration: "3 years",
    specialists: "6 specialists Available"
  })

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {courses.map((_, index) => (
          <CourseCard key={index} />
        ))}
      </div>
    </div>
  )
}

