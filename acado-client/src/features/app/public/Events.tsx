import React, { useEffect, useState } from 'react';
import { fetchEvents } from '@services/public/EventService';
import { useEventStore } from '@app/store/public/EventStore';
import EventCard from '@public/components/ui/EventCard';
import Loading from '@/components/shared/Loading';
import MetaTags from '@/utils/MetaTags';

const Events: React.FC = () => {
    const { events, setEvents, isLoading, setIsLoading, error, setError } = useEventStore();
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [filteredEvents, setFilteredEvents] = useState(events);

    useEffect(() => {
        const loadEvents = async () => {
            setIsLoading(true);
            setError(null); // Clear error at start of load
            try {
                const data = await fetchEvents('event');
                console.log('✅ Events loaded:', data);
                if (data && data.length > 0) {
                    setEvents(data);
                    setError(null); // Explicitly clear error on success
                } else {
                    setEvents([]);
                    setError('No events found');
                }
            } catch (error) {
                console.error('❌ Failed to load events:', error);
                setError(typeof error === 'string' ? error : 'Failed to load events');
                setEvents([]); // Clear events on error
            } finally {
                setIsLoading(false);
            }
        };
        loadEvents();
    }, [setEvents, setIsLoading, setError]);

    // Filter events based on selected status
    useEffect(() => {
        if (!events) return;

        if (statusFilter === 'all') {
            setFilteredEvents(events);
        } else {
            const filtered = events.filter(
                (event) => event.com_status.program_status.toLowerCase() === statusFilter.toLowerCase()
            );
            setFilteredEvents(filtered);
        }
    }, [statusFilter, events]);

    // Get unique status values from events
    const getStatusOptions = () => {
        if (!events) return [];
        const statuses = events.map((event) => event.com_status.program_status);
        return ['all', ...Array.from(new Set(statuses))];
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    return (
        <>
            <MetaTags
                title="Acado Events - Join Amazing Events"
                description="Explore and participate in exciting events at Acado."
                image="https://acado.ai/img/event/event.jpg"
            />

            {/* Hero Section */}
            <section
                style={{
                    backgroundImage: `url('img/event/event.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                className="relative bg-gray-900 rounded-lg mt-10 h-[400px] sm:h-[500px] flex items-center justify-center"
            >
                <div className="absolute inset-0 bg-gray-900 opacity-80 rounded-lg"></div>
                <div className="relative container mx-auto px-5 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary dark:text-primary mb-3">Events</h1>
                    <div className="max-w-3xl mx-auto sm:mx-0">
                        <h1 className="text-4xl sm:text-6xl text-white font-bold">
                            Explore upcoming events
                        </h1>
                        <p className="text-lg sm:text-2xl text-white mt-3">
                            Learning Beyond Boundaries!
                        </p>
                    </div>
                </div>
            </section>

            {/* Events Listing */}
            <div className="px-4 mt-8 text-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-semibold dark:text-primary text-primary">
                        Events
                    </h1>

                    {/* Status Filter Dropdown */}
                    <div className="flex justify-between items-center gap-3 w-full sm:w-auto">
                        <label htmlFor="status-filter" className="text-sm font-medium dark:text-gray-200 text-gray-700">
                            Filter by Status:
                        </label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                     focus:outline-none focus:ring-2 focus:ring-primary
                                     cursor-pointer min-w-[150px]"
                            onChange={handleStatusChange}

                        >
                            {getStatusOptions().map((status) => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'All Events' : status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                {!isLoading && filteredEvents && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Showing {filteredEvents.length} of {events?.length || 0} events
                    </p>
                )}

                {isLoading && (
                    <div className="h-40 flex items-center justify-center">
                        <Loading loading={isLoading} />
                    </div>
                )}

                {error && <div className="text-red-500">{error}</div>}

                {filteredEvents && !isLoading && filteredEvents.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredEvents
                            .slice() // create a copy before sorting (to avoid mutating state)
                            .sort((a, b) => {
                                const statusOrder = {
                                    ongoing: 1,
                                    completed: 2,
                                    upcoming: 3,
                                    cancelled: 4,
                                };

                                const aStatus = a.com_status?.program_status?.toLowerCase() || '';
                                const bStatus = b.com_status?.program_status?.toLowerCase() || '';

                                const aOrder = statusOrder[aStatus] || 99;
                                const bOrder = statusOrder[bStatus] || 99;

                                return aOrder - bOrder;
                            })
                            .map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                    </div>
                )}

                {filteredEvents && !isLoading && filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                            No events found with status &quot;{statusFilter}&quot;
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Events;
