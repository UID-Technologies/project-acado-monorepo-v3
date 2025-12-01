import React from 'react'
import { RxCross1 } from 'react-icons/rx'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    onEdit: () => void
    onDelete?: () => void
    event: Event | null
}

interface Event {
    id: string
    title: string
    start: Date
    end: Date
    description?: string
    invited_by_name?: string
    link?: string
}

const ShowModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    event,
    onEdit,
    onDelete,
}) => {
    if (!isOpen || !event) return null

    function formatIndianDateTime(datetime: string | Date | null | undefined) {
        if (!datetime) return 'Invalid date';
      
        let dateObj: Date;
      
        if (typeof datetime === 'string') {
          // Replace only if it's a string in "YYYY-MM-DD HH:mm:ss" format
          dateObj = new Date(datetime.replace(' ', 'T'));
        } else if (datetime instanceof Date) {
          dateObj = datetime;
        } else {
          return 'Invalid date';
        }
      
        return dateObj.toLocaleString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        });
      }
      
      

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-primary text-1xl"
                >
                    <RxCross1 />
                </button>
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <p>
                        <strong>Start:</strong> {formatIndianDateTime(event.start)}
                    </p>
                    <p>
                        <strong>End:</strong> {formatIndianDateTime(event.end)}
                    </p>
                    {event.description && (
                        <p>
                            <strong>Description:</strong> {event.description}
                        </p>
                    )}
                    {event.invited_by_name && (
                        <p>
                            <strong>Invited by:</strong> {event.invited_by_name}
                        </p>
                    )}
                    {event.link && (
                        <p>
                            <strong>Link:</strong>{' '}
                            <a
                                href={event.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {event.link}
                            </a>
                        </p>
                    )}
                </div>
                {!event?.invited_by_name && (
                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            onClick={onEdit}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Edit
                        </button>

                        <button
                            onClick={onDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ShowModal
