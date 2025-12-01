import React from "react"
import { Alert } from "@/components/ui"
import { useInternshipStore } from "@app/store/learner/internshipStore"
import { fetchInternship } from "@services/learner/InternshipService"
import Loading from "@/components/shared/Loading"
import { Link } from "react-router-dom"
import { Briefcase, MapPin, Clock, Globe, Calendar, EyeIcon, ArrowRight } from "lucide-react"

const Index: React.FC = () => {
  const { setInternship, internship, error, setError, loading, setLoading } = useInternshipStore()

  React.useEffect(() => {
    setLoading(true)
    setError("")
    fetchInternship()
      .then((res) => {
        if (Array.isArray(res)) {
          setInternship(res)
        } else {
          setError("Invalid response format")
        }
      })
      .catch((err) => {
        console.error("Fetch Internship Error:", err)
        setError(typeof err === "string" ? err : err.message || "Failed to load internships")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [setError, setLoading, setInternship])

  if (loading) {
    return <Loading loading={loading} />
  }

  if (error) {
    return <Alert type="warning" title={error} />
  }

  // Helper function to get status color
  const getStatusColor = (status: any) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400"
      case "inactive":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400"
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
    }
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-white p-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 dark:text-primary text-primary">Internship Opportunities</h1>

        <div className="bg-gray-200 dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
            {internship.length > 0 ? (
              internship.map((item) => (
                <Link
                  key={item.id}
                  to={`/internshipDetails/${item.id}`}
                  className="block hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left section with company logo and name */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                          <img src={item.image || "/placeholder.svg"} alt="" className="w-8 h-8 object-cover" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg dark:text-white">{item.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <MapPin size={14} />
                            <span>{item.location || "Remote"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle section with job details */}
                      <div className="flex flex-wrap gap-3 my-2 md:my-0">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm">
                          <Briefcase size={14} />
                          <span>{"Full-time"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm">
                          <Globe size={14} />
                          <span>{"Remote"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm">
                          <Clock size={14} />
                          <span>Exp: {item.experience || "0-1 yr"}</span>
                        </div>
                      </div>

                      {/* Right section with status and apply button */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${getStatusColor(item.job_status)}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current"></span>
                          <span>{item.job_status || "Active"}</span>
                        </div>
                        <Link to={`/internshipDetails/${item.id}`}>
                          <button
                            className="flex items-center gap-2 px-4 py-1.5 bg-primary text-ac-dark dark:text-ac-dark rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"

                          >
                            View
                            <EyeIcon />
                          </button>
                        </Link>

                      </div>
                    </div>

                    {/* Skills section */}
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {(item.skill_names || "Python,JavaScript,React").split(",").map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Duration/Date section */}
                    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>
                        {item.start_date && item.end_date
                          ? `${new Date(item.start_date).toLocaleDateString()} - ${new Date(item.end_date).toLocaleDateString()}`
                          : "Flexible duration"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No internships available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index

