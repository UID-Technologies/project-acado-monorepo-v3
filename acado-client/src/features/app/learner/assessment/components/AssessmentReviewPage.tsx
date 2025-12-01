import { useState } from "react"
import { useParams } from "react-router-dom"
import Button from "@/components/ui/Button"
import Scoreboard from "./Scoreboard"
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { FaRegCheckCircle, FaRegQuestionCircle } from "react-icons/fa"
import { HiRefresh } from "react-icons/hi"
import { useAssessmentReview } from "@app/hooks/data/useCourses"

const CheckIcon = () => (
  <FaRegCheckCircle />
)

const XIcon = () => (
  <IoIosCloseCircleOutline />
)
const ChevronDownIcon = () => (
  <FaAngleDown />
)
const ChevronUpIcon = () => (
  <FaAngleUp />
)
const QuestionIcon = () => (
  <FaRegQuestionCircle />
)
const RefreshIcon = () => (
  <HiRefresh />

)


export default function AssessmentReviewPage() {

  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [showScoreboard, setShowScoreboard] = useState(false);

  const { id } = useParams()

  const { data: assessmentReview } = useAssessmentReview(id);
  // Calculate stats
  const stats = {
    percentage: Math.round(((assessmentReview?.score ?? 0) / 100) * 100),
    correct: assessmentReview?.questions?.filter((question) => {
      return question.correct_options[0] === (question.is_correct ? "true" : "false")
    }).length ?? 0,
    total: assessmentReview?.questions?.length ?? 0,
    wrong: (assessmentReview?.questions?.length ?? 0) - (assessmentReview?.questions?.filter((question) => {
      return question.correct_options[0] === (question.is_correct ? "true" : "false")
    }).length ?? 0),
  }

  // Filter questions based on selected filter
  const filteredQuestions = assessmentReview?.questions?.filter((question) => {
    const isCorrect = question?.correct_options?.includes(question?.question_options[0]?.user_answer?.toString() ?? "")
    if (filterType === "all") return true
    if (filterType === "correct") return isCorrect
    if (filterType === "incorrect") return !isCorrect
    return true
  })

  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (showScoreboard) {
    return (
      <Scoreboard
        assessmentData={{
          score: assessmentReview?.score || 0,
          total_questions: assessmentReview?.questions?.length || 0,
          correct_answers: stats.correct,
          wrong_answers: stats.wrong,
          attempt_count: assessmentReview?.attempt_count || 1,
          // questions: assessmentReview?.questions || [],

          batch_average: {
            score: 75, // Replace with actual batch average from API if available
            correct_answers: Math.round((assessmentReview?.questions?.length || 0) * 0.75), // Example
            time_per_question: 30, // Example
            accuracy: 75 // Example
          }
        }}
      />
    );
  }

  return (
    <div className="container px-4 py-8 max-w-8xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-primary">Assessment Review</h1>
        <Button onClick={() => setShowScoreboard(true)}>Scoreboard</Button>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 text-sm mb-2">Completed on {completionDate}</p>
      </div>

      {/* Score Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center mb-2">
            <span className="text-3xl font-bold text-blue-500">{stats.percentage}%</span>
          </div>
          <p className="text-gray-800 font-semibold">Overall Score</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="mb-2">
            <QuestionIcon />
          </div>
          <span className="text-3xl font-bold">{stats.total}</span>
          <p className="text-gray-600">Total Questions</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="mb-2 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckIcon />
          </div>
          <span className="text-3xl font-bold text-green-600">{stats.correct}</span>
          <p className="text-gray-600">Correct Answers</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="mb-2 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <XIcon />
          </div>
          <span className="text-3xl font-bold text-red-600">{stats.wrong}</span>
          <p className="text-gray-600">Wrong Answers</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="mb-2">
            <RefreshIcon />
          </div>
          <span className="text-3xl font-bold text-purple-600">{assessmentReview?.attempt_count ?? 1}</span>
          <p className="text-gray-600">Attempts</p>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Performance Overview</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div className="bg-black rounded-full h-4" style={{ width: `${stats.percentage}%` }}></div>
        </div>
        <div className="flex justify-between text-sm">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Questions Review */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Questions Review</h2>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md ${filterType === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}
              onClick={() => setFilterType("all")}
            >
              All Questions
            </button>
            <button
              className={`px-4 py-2 rounded-md ${filterType === "correct" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}
              onClick={() => setFilterType("correct")}
            >
              Correct Only
            </button>
            <button
              className={`px-4 py-2 rounded-md ${filterType === "incorrect" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}
              onClick={() => setFilterType("incorrect")}
            >
              Incorrect Only
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions &&
            filteredQuestions.map((question, index) => {
              const userAnswer = question?.question_options[0]?.user_answer ?? 1
              const isCorrect = question?.correct_options?.includes(userAnswer.toString())
              const isExpanded = expandedQuestion === question?.question_id
              const bgColor = isCorrect ? "bg-green-50" : "bg-red-50"
              const borderColor = isCorrect ? "border-green-200" : "border-red-200"

              return (
                <div
                  key={question.question_id}
                  className={`border rounded-lg ${isExpanded ? borderColor : "border-gray-200"}`}
                >
                  <div
                    className={`p-4 flex items-start justify-between cursor-pointer ${isExpanded ? bgColor : ""}`}
                    onClick={() => setExpandedQuestion(isExpanded ? null : question.question_id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">Question {index + 1}:</span>
                        {isCorrect ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckIcon />
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XIcon />
                          </span>
                        )}
                      </div>
                      <p className="font-medium">{question?.question}</p>
                    </div>
                    <button
                      className="ml-4 text-gray-500 hover:text-gray-700"
                      aria-label={isExpanded ? "Collapse question details" : "Expand question details"}
                    >
                      {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t">
                      <div className="pt-4 space-y-3">
                        {question?.question_options &&
                          question?.question_options.map((option, optIndex) => {
                            const isSelected = userAnswer === optIndex + 1
                            const isCorrectOption = question.correct_options.includes((optIndex + 1).toString())

                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg ${isCorrectOption
                                  ? "bg-green-50 border border-green-200"
                                  : isSelected
                                    ? "bg-red-50 border border-red-200"
                                    : "bg-gray-50 border border-gray-200"
                                  }`}
                              >
                                <div className="flex items-center">
                                  <span className="flex-1">{option.option_statement}</span>
                                  {isCorrectOption && (
                                    <span className="text-green-600">
                                      <CheckIcon />
                                    </span>
                                  )}
                                  {isSelected && !isCorrectOption && (
                                    <span className="text-red-600">
                                      <XIcon />
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700">Explanation:</p>
                          <p className="mt-1 text-sm text-gray-600">
                            {/* {question.explanation || "No explanation available."} */}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

