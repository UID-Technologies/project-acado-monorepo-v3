import React, { useEffect } from 'react'
import { useEventStore } from '@app/store/learner/____EventStore';
import { fetchEvent } from '@services/learner/EventService';
import Loading from '@/components/shared/Loading';
import Error from '@/components/shared/Error';
import { Link } from 'react-router-dom';

function Events() {

    const { events, setEvents, loading, setLoading, error, setError } = useEventStore();

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchEvent().then((eventData) => { setEvents(eventData) }).catch((error) => {
            setError(error);
        }).finally(() => {
            setLoading(false);
        });
    }, [setEvents]);

    if (loading) {
        return <Loading loading={loading} />;
    }

    if (error) {
        return <Error error={error} />;
    }

    return (
        <div className='bg-gray-100 p-4 rounded-lg  dark:bg-gray-800 mt-4'>
            <h1 className='font-semibold capitalize text-lg mb-1'>Events</h1>
            {events && events?.length > 0 &&
                events?.map((eventItem, index) => {
                    if (index > 2) return null;
                    return (
                        <Link key={index} to={`/event-activity/${eventItem.id}`} className="bg-white grid grid-cols-12 dark:bg-gray-800 border rounded-lg shadow-md overflow-hidden cursor-pointer mb-2">
                            <div className="relative col-span-12 md:col-span-4 lg:col-span-4 bg-cover bg-center bg-gray-300">
                                <img src={eventItem.image} alt={eventItem.name} className="w-full h-24 object-cover" />
                            </div>
                            <div className="col-span-12 md:col-span-8 lg:col-span-8 dark:bg-gray-900 bg-white opacity-90 w-full px-2 py-2">
                                <h6 className="font-bold text-gray-800 dark:text-white text-[11px] line-clamp-2"> {eventItem.name}</h6>
                                <p dangerouslySetInnerHTML={{ __html: eventItem.description }} className="text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2 whitespace-pre-line"></p>
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default Events
