import { useState } from 'react'

interface Mentor {
  id: string
  name: string
}

interface CustomEvent {
  title: string
  date: Date
  mentorIds: Array<string>
  isZoomMeeting: boolean
}

interface EventPopupProps {
  selectedDate: Date | null
  onClose: () => void
  onAddEvent: (event: CustomEvent) => void
}

// Fake mentor data
const fakeMentors: Mentor[] = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Charlie Davis' },
  { id: '4', name: 'Dana Lee' },
]

export default function EventPopup({ selectedDate, onClose, onAddEvent }: EventPopupProps) {
  const [title, setTitle] = useState('')
  const [isZoomMeeting, setIsZoomMeeting] = useState(false)
  const [selectedMentors, setSelectedMentors] = useState<string[]>([])

  const handleMentorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value)
    setSelectedMentors(selectedOptions)
  }

  const removeMentor = (id: string) => {
    setSelectedMentors((prev) => prev.filter((m) => m !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate && title) {
      onAddEvent({
        title,
        date: selectedDate,
        mentorIds: selectedMentors,
        isZoomMeeting,
      })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {selectedDate ? `Create Event for ${selectedDate.toDateString()}` : 'Create Event'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            className="w-full p-2 mb-4 border rounded"
            required
          />

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isZoomMeeting}
                onChange={(e) => setIsZoomMeeting(e.target.checked)}
                className="mr-2"
              />
              Schedule as Zoom Meeting
            </label>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Select Mentors</label>
            <select
              multiple
              value={selectedMentors}
              onChange={handleMentorChange}
              className="w-full p-2 border rounded h-32"
            >
              {fakeMentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap mt-2 gap-2">
              {selectedMentors.map((id) => {
                const mentor = fakeMentors.find((m) => m.id === id)
                return (
                  <span
                    key={id}
                    className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {mentor?.name}
                    <button
                      onClick={() => removeMentor(id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      type="button"
                    >
                      ×
                    </button>
                  </span>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {isZoomMeeting ? 'Schedule Meeting' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
