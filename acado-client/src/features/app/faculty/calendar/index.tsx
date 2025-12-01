import React, { useState, useEffect } from 'react'
import {
    Calendar as BigCalendar,
    momentLocalizer,
    View,
} from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import CustomToolbar from '@calendar/components/CustomToolbar'
import Modal from '@calendar/components/Modal'
import ShowModal from '@calendar/components/ShowModal'
import './index.css'
import {
    fetchEvents,
    createEvent,
    deleteEvent,
} from '@calendar/services/CalendarService'
import { useEventStore } from '@calendar/store/CalendarStore'

const localizer = momentLocalizer(moment)

interface Event {
    id: string
    title: string
    start: Date
    end: Date
    description?: string
    link?: string
}

const Calendar: React.FC = () => {
    const { events, setEvents } = useEventStore()

    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const [currentView, setCurrentView] = useState<View>('month')
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
    const [selectedSlot, setSelectedSlot] = useState<{
        start: Date
        end: Date
    } | null>(null)
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
    
    useEffect(() => {
        const loadEvents = async () => {
            try {
                const events = await fetchEvents()
                const formattedEvents = events.map((event) => ({
                    ...event,
                    start: moment(event.start).toDate(),
                    end: moment(event.end).toDate(),
                }))
                setEvents(formattedEvents)
            } catch (error) {
                console.error('Failed to fetch events:', error)
            }
        }

        loadEvents()
    }, [setEvents])

    const handleSelectEvent = (event: Event) => {
        setCurrentEvent(event)
        setShowDetailsModal(true)
    }

    const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
        setSelectedSlot({ start, end })
        setShowModal(true)
    }

    const handleAddEvent = async (newEvent: Event) => {
        try {
            const addedEvent = await createEvent(newEvent)
            if (addedEvent) {
                alert('Event added successfully')
                setEvents([...events, newEvent])
            }
            setShowModal(false)
        } catch (error) {
            console.error('Failed to add event:', error)
        }
    }

    const handleEditEvent = (updatedEvent: Event) => {
        setShowModal(false)
    }

    const handleDeleteEvent = (eventId: string) => {
        setShowModal(false)
        deleteEvent(eventId)
        setEvents(events.filter((event) => event.id !== eventId))
        setCurrentEvent(null)
        setSelectedSlot(null)
    }

    const defaultValues = currentEvent
        ? currentEvent
        : selectedSlot
          ? { title: '', description: '', link: '', ...selectedSlot }
          : undefined

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md w-full max-w-7xl mx-auto overflow-hidden">
            {/* Show Modal */}
            {showDetailsModal && currentEvent && (
                <ShowModal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    onEdit={() => setShowModal(true)}
                    onDelete={() => handleDeleteEvent(currentEvent.id)}
                    event={currentEvent}
                />
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <Modal
                    isOpen={showModal}
                    onSave={currentEvent ? handleEditEvent : handleAddEvent}
                    onClose={() => setShowModal(false)}
                    defaultValues={defaultValues}
                    onDelete={
                        currentEvent
                            ? () => handleDeleteEvent(currentEvent.id)
                            : undefined
                    }
                />
            )}

            {/* Calendar Wrapper */}
            <div className="h-[calc(100vh-10rem)] sm:h-[80vh] min-h-[500px] overflow-x-auto">
                <BigCalendar
                    events={events}
                    step={60}
                    views={['month', 'week', 'day']}
                    localizer={localizer}
                    date={currentDate}
                    view={currentView}
                    onNavigate={setCurrentDate}
                    onView={setCurrentView}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    components={{ toolbar: CustomToolbar }}
                    eventPropGetter={eventStyleGetter}
                />
            </div>
        </div>
    )
}

const eventStyleGetter = (
    event: Event,
    start: Date,
    end: Date,
    isSelected: boolean,
) => ({
    style: {
        backgroundColor: isSelected ? 'lightblue' : 'lightgreen',
        borderRadius: '5px',
        color: 'black',
        padding: '5px',
    },
})

export default Calendar
