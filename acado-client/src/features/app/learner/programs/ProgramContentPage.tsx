import type React from "react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Error from "@/components/shared/Error"
import Loading from "@/components/shared/Loading"
import { fetchProgramContent } from "@services/learner/ProgramContentService"
import { useProgramContentStore } from "@app/store/learner/programContentStore"
import { Calendar, AlarmClock, ClockIcon as ClockAlertIcon } from "lucide-react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import eventImage from "/img/event/event_banner.png"

const ProgramContentPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const module_id = location.state?.module_id

  const [showDialog, setShowDialog] = useState(false)
  const [selectedZoomClass, setSelectedZoomClass] = useState<any>(null)

  const { setProgramContent, programContent, error, setError, isLoading, setIsLoading } = useProgramContentStore()

  useEffect(() => {
    const fetchModule = async () => {
      if (!module_id) return
      setError(null)
      setIsLoading(true)
      try {
        const contentResp = await fetchProgramContent(module_id)
        setProgramContent(contentResp[0])
      } catch (err) {
        setError("Failed to load module")
      } finally {
        setIsLoading(false)
      }
    }

    fetchModule()
  }, [module_id])

  const handleCardClick = (content: any) => {
    switch (content?.content_type) {
      case "assignment":
        navigate("/assignment", { state: { program_content_id: content?.program_content_id } })
        break
      case "assessment":
        navigate("/assessmentAttempt", { state: { assessmentDetails: content } })
        break
      case "zoomclass":
        setSelectedZoomClass(content)
        setShowDialog(true)
        break
      default:
        console.error("Unknown content type:", content?.content_type)
    }
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setSelectedZoomClass(null)
  }

  const renderAssessments = (assessments: any[]) => {
    return (
      assessments &&
      assessments?.map((assessment) => (
        <div key={assessment?.program_content_id} className="border p-4 rounded shadow-sm mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{assessment?.title}</h3>
              <p>{assessment?.description}</p>
              <button onClick={() => handleCardClick(assessment)} className="text-primary">
                Attempt Assessment
              </button>
            </div>
            <div className="h-16 w-16">
              <CircularProgressbar
                value={Number(assessment?.completion || 0)}
                text={`${assessment?.completion || 0}%`}
                styles={buildStyles({
                  textSize: "16px",
                  pathColor: "#4caf50",
                  textColor: "#4CAF50",
                  trailColor: "#d6d6d6",
                })}
              />
            </div>
          </div>
        </div>
      ))
    )
  }

  const renderLearningShots = (learningShots: any[]) =>
    learningShots?.map((shot) => (
      <div key={shot?.program_content_id} className="border bg-white dark:bg-gray-800 p-4 rounded shadow-sm mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{shot?.title}</h3>
            <p>{shot?.description}</p>
            <a href={shot?.url} className="text-primary" target="_blank" rel="noreferrer">
              View Content
            </a>
          </div>
          <div className="h-16 w-16">
            <CircularProgressbar
              value={Number(shot?.completion || 0)}
              text={`${shot?.completion || 0}%`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: "#4caf50",
                textColor: "#4CAF50",
                trailColor: "#d6d6d6",
              })}
            />
          </div>
        </div>
      </div>
    ))

  const renderAssignments = (assignments: any[] | undefined) =>
    (assignments || []).map((assignment) => (
      <div key={assignment?.program_content_id} className="border p-4 rounded shadow-sm mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{assignment?.title}</h3>
            <p>{assignment?.description}</p>
            <a href={assignment?.url} className="text-primary">
              View Assignment
            </a>
          </div>
          <div className="h-16 w-16">
            <CircularProgressbar
              value={Number(assignment?.completion || 0)}
              text={`${assignment?.completion || 0}%`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: "#4caf50",
                textColor: "#4CAF50",
                trailColor: "#d6d6d6",
              })}
            />
          </div>
        </div>
      </div>
    ))

  if (isLoading) {
    return <Loading loading={isLoading} />
  }

  if (error) {
    return <Error error={error} />
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-3 text-start dark:text-primary text-primary">Program Details</h1>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer mb-10"
        onClick={() => handleCardClick(programContent?.content)}
      >
        <div className="relative">
          <img src={eventImage || "/placeholder.svg"} alt="event" className="h-48 w-full object-cover" />
          <span className="absolute top-0 right-0 bg-primary text-ac-dark px-2 py-1 text-xs font-semibold rounded-bl-lg">
            STATUS
          </span>
        </div>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900 bg-white opacity-90 w-full">
          <div className="flex items-center justify-between">
            <h6 className="font-bold text-gray-800 dark:text-white">{programContent?.name}</h6>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary text-ac-dark dark:bg-primary">
              Medium
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">{programContent?.description}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2">
              <ClockAlertIcon size={16} /> {programContent?.duration_in_days}
            </span>
            <div className="h-12 w-12">
              <CircularProgressbar
                value={Number(programContent?.completion)}
                text={`${programContent?.completion}%`}
                styles={buildStyles({
                  textSize: "12px",
                  pathColor: "#4caf50",
                  textColor: "#4CAF50",
                  trailColor: "#d6d6d6",
                  backgroundColor: "#3e98c7",
                })}
              />
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-primary dark:text-primary">Learning Contents</h1>

      <div className="mt-4">
        <h3 className="text-xl font-semibold dark:text-gray-200 mb-2">Learning Shots </h3>
        {Array.isArray(programContent?.content?.learning_shots) &&
          programContent?.content?.learning_shots?.length > 0 ? (
          renderLearningShots(programContent?.content?.learning_shots)
        ) : (
          <center>
            <p>No learning shots available.</p>
          </center>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold dark:text-gray-200 mb-2">Sessions</h3>
        {Array.isArray(programContent?.content?.sessions) && programContent?.content?.sessions?.length > 0 ? (
          programContent?.content?.sessions.map((sessions) => (
            <div key={sessions?.program_content_id} className="border p-4 rounded shadow-sm mb-4">
              <h4>{sessions?.title}</h4>
              <p>{sessions?.description}</p>
              <a href={sessions?.url} className="text-primary">
                View {sessions?.content_type}
              </a>
            </div>
          ))
        ) : (
            <div className="border p-4 border-gray-600 rounded shadow-sm mb-4 flex justify-center items-center h-40">
            <p>No sessions available.</p>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">Assignments</h3>
        {Array.isArray(programContent?.content?.assignments) && programContent?.content?.assignments.length > 0 ? (
          renderAssignments(programContent?.content?.assignments)
        ) : (
          <div className="border border-gray-600 p-4 rounded shadow-sm mb-4 flex justify-center items-center h-40">
            <p>No assignments available.</p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold dark:text-gray-200 mb-2">Assessments </h3>
        {Array.isArray(programContent?.content?.assessments) && programContent?.content?.assessments?.length > 0 ? (
          renderAssessments(programContent?.content?.assessments)
        ) : (
            <div className="border border-gray-600 p-4 rounded shadow-sm mb-4 flex justify-center items-center h-40">
            <p>No assessments available.</p>
          </div>
        )}
      </div>
      {showDialog && selectedZoomClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-primary text-lightPrimary mb-4 text-center">
              {selectedZoomClass?.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{selectedZoomClass?.description}</p>
            <div className="flex items-center mt-3 gap-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2">
                <Calendar size={16} /> {selectedZoomClass?.created_at}
              </span>
              <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2">
                <Calendar size={16} /> {selectedZoomClass?.start_date}
              </span>
            </div>
            <div className="flex items-center mt-3 gap-2 mb-10">
              <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2">
                <AlarmClock size={16} /> {selectedZoomClass?.Duration || "00:00"}
              </span>
              <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2">
                <Calendar size={16} /> Presenter: {selectedZoomClass?.presenter_name || ""}
              </span>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={handleCloseDialog} className="bg-gray-300 text-black">
                Close
              </button>
              <button
                onClick={() => window.open(selectedZoomClass?.zoom_url, "_blank")}
                className="bg-primary text-white"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProgramContentPage

