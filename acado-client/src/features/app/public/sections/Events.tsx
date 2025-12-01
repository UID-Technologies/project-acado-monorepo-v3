import { usePublicEvents } from '@app/hooks/data/collaborate/useEvents';
import EventCard from '../components/ui/EventCard';
import LoadingSection from '@/components/LoadingSection';
import { Link } from 'react-router-dom';

const Events = () => {
    const { data: events, isLoading } = usePublicEvents();

    // ✅ Step 1: Filter only ongoing events
    const ongoingEvents = events
        ?.filter(event => event?.com_status?.program_status === "Ongoing")
        ?.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

    // ✅ Step 2: Limit to top 4 if needed
    const visibleEvents = ongoingEvents?.slice(0, 4);

    if (ongoingEvents?.length === 0 && !isLoading) return null;

    return (
        <div className='mb-8'>
            <div className='flex justify-between'>
                <h3 className='text-primary dark:text-darkPrimary'>Events</h3>
                <Link to='/events'>
                    <button className='text-primary underline'>View All</button>
                </Link>
            </div>

            <LoadingSection isLoading={isLoading} />

            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4'>
                {visibleEvents?.map(event => (
                    <div key={event.id} className='hover:scale-[1.02] transition-transform'>
                        <EventCard event={event} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
