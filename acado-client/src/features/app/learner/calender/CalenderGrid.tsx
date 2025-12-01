interface CustomEvent {
  title: string
  date: Date
  isZoomMeeting: boolean
}

interface CalendarGridProps {
  currentDate: Date
  view: 'month' | 'week'
  events: CustomEvent[] 
  onDateClick: (date: Date) => void
}

export default function CalendarGrid({ currentDate, view, events, onDateClick }: CalendarGridProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const days = []

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getDaysInWeek = (date: Date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    const days = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }

    return days
  }

  const days = view === 'month' ? getDaysInMonth(currentDate) : getDaysInWeek(currentDate)

  return (
    <div className={`grid ${view === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-1`}>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="text-center font-bold p-2">
          {day}
        </div>
      ))}
      {days.map((day, index) => (
        <div
          key={index}
          className={`border p-2 ${day ? 'cursor-pointer hover:bg-gray-100' : ''}`}
          onClick={() => day && onDateClick(day)}
        >
          {day && (
            <>
              <div className="text-right">{day.getDate()}</div>
              <div>
                {events
                  .filter((event) => event.date.toDateString() === day.toDateString())
                  .map((event, eventIndex) => (
                    <div key={eventIndex} className="text-sm bg-blue-200 p-1 mb-1 rounded">
                      {event.title}
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
