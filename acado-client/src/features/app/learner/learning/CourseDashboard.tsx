import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen, Video, ClipboardList, PenTool } from 'lucide-react'

interface CourseModule {
  id: string
  title: string
  completion: number
  content: {
    notes: string[]
    videos: string[]
    assessments: string[]
    assignments: string[]
  }
}

export default function CourseDashboard() {
  const [expandedModules, setExpandedModules] = useState<string[]>([])

  const courseModules: CourseModule[] = [
    {
      id: '1',
      title: 'Contemporary Marketing Management (Mar 2024)',
      completion: 13,
      content: {
        notes: ['Introduction to Marketing', 'Market Analysis', 'Consumer Behavior'],
        videos: ['Marketing Fundamentals', 'Market Research Methods'],
        assessments: ['Quiz 1: Marketing Basics', 'Mid-term Assessment'],
        assignments: ['Market Analysis Report', 'Brand Strategy Project']
      }
    },
    {
      id: '2',
      title: 'People Management (Mar 2024)',
      completion: 13,
      content: {
        notes: ['HR Fundamentals', 'Leadership Styles', 'Team Management'],
        videos: ['Leadership in Practice', 'Conflict Resolution'],
        assessments: ['HR Policies Quiz', 'Leadership Assessment'],
        assignments: ['Team Building Plan', 'Performance Review']
      }
    },
    {
      id: '3',
      title: 'Financial Management (Mar 2024)',
      completion: 12,
      content: {
        notes: ['Financial Planning', 'Investment Strategies', 'Risk Management'],
        videos: ['Financial Analysis', 'Investment Basics'],
        assessments: ['Finance Quiz', 'Investment Test'],
        assignments: ['Financial Report', 'Portfolio Management']
      }
    },
    {
      id: '4',
      title: 'Operations & Supply Chain Management (Mar 2024)',
      completion: 8,
      content: {
        notes: ['Supply Chain Basics', 'Operations Planning', 'Logistics'],
        videos: ['Supply Chain Overview', 'Operations Management'],
        assessments: ['Operations Quiz', 'Supply Chain Test'],
        assignments: ['Process Improvement Plan', 'Supply Chain Analysis']
      }
    },
    {
      id: '5',
      title: 'Master Class (Mar 2024)',
      completion: 0,
      content: {
        notes: ['Industry Insights', 'Case Studies', 'Best Practices'],
        videos: ['Expert Sessions', 'Industry Leaders Talk'],
        assessments: ['Final Assessment'],
        assignments: ['Capstone Project']
      }
    }
  ]

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const totalCompletion = courseModules.reduce((acc, module) => acc + module.completion, 0) / courseModules.length

  return (
    <div className="max-w-8xl p-6 dark:bg-gray-900 bg-gray-100 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Master of Business Administration B3 (MAR - 2024) - Semester II
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                The Master of Business Administration (M.B.A) programme (Online Mode) of SASTRA Deemed University is a unique programme carefully curated to address the career progression aspirations of the present-day working professionals. While the academic content covers all the traditional domains of management, due consideration has been given to incorporate demands of a modern and complex business environment.
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-2xl font-semibold text-green-600 dark:text-green-400">{totalCompletion.toFixed(2)}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
            </div>
          </div>
        </div>

        <div className="divide-y dark:divide-gray-700">
          {courseModules.map(module => (
            <div key={module.id} className="bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{module.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {module.completion > 0 ? `Completed - ${module.completion}%` : 'Pending'}
                  </span>
                  {expandedModules.includes(module.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
              </button>

              {expandedModules.includes(module.id) && (
                <div className="px-6 py-4 bg-white dark:bg-gray-800">
                  <div className="grid gap-6">
                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white mb-3">
                        <BookOpen className="w-5 h-5" />
                        Notes
                      </h3>
                      <ul className="space-y-2">
                        {module.content.notes.map((note, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white mb-3">
                        <Video className="w-5 h-5" />
                        Videos
                      </h3>
                      <ul className="space-y-2">
                        {module.content.videos.map((video, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                            {video}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white mb-3">
                        <ClipboardList className="w-5 h-5" />
                        Assessments
                      </h3>
                      <ul className="space-y-2">
                        {module.content.assessments.map((assessment, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                            {assessment}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white mb-3">
                        <PenTool className="w-5 h-5" />
                        Assignments
                      </h3>
                      <ul className="space-y-2">
                        {module.content.assignments.map((assignment, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                            {assignment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
