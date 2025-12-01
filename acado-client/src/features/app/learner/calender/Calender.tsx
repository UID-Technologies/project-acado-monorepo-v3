import { useState } from 'react'
import EventPopup from './EventPopUp'
import CalendarGrid from './CalenderGrid'
import CalendarPage from './CalenderPage'


interface CustomEvent {
  title: string
  date: Date
  isZoomMeeting: boolean
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')
  const [events, setEvents] = useState<CustomEvent[]>([])  
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const addEvent = (newEvent: CustomEvent) => { 
    setEvents([...events, newEvent])
  }

  return (
    <div className="container mx-auto p-4">


        <h1 className='mb-10'>Schedule Event/Meeting</h1>
      <CalendarPage
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
      />
      <CalendarGrid
        currentDate={currentDate}
        view={view}
        events={events}  
        onDateClick={(date) => {
          setSelectedDate(date)
          setIsPopupOpen(true)
        }}
      />
      {isPopupOpen && (
        <EventPopup
          selectedDate={selectedDate}
          onClose={() => setIsPopupOpen(false)}
          onAddEvent={addEvent}  
        />
      )}
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => {
          setSelectedDate(new Date())
          setIsPopupOpen(true)
        }}
      >
        Create Event
      </button>
    </div>
  )
}
