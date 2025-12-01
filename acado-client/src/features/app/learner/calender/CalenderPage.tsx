import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarHeaderProps {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  view: 'month' | 'week'
  setView: (view: 'month' | 'week') => void
}

export default function CalendarPage({ currentDate, setCurrentDate, view, setView }: CalendarHeaderProps) {
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentDate(newDate)
  }

  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <button onClick={() => view === 'month' ? navigateMonth('prev') : navigateWeek('prev')} className="mr-2">
          <ChevronLeft />
        </button>
        <span className="text-lg font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={() => view === 'month' ? navigateMonth('next') : navigateWeek('next')} className="ml-2">
          <ChevronRight />
        </button>
      </div>
      <div>
        <button
          onClick={() => setView('month')}
          className={`mr-2 ${view === 'month' ? 'font-bold' : ''}`}
        >
          Month
        </button>
        <button
          onClick={() => setView('week')}
          className={view === 'week' ? 'font-bold' : ''}
        >
          Week
        </button>
      </div>
    </div>
  )
}

