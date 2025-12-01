import { Alert } from '@/components/ui';
import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from '@/components/shared/Loading';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Player from './Player';
import SafeHtml from '@/components/SafeHtml';
import { ArrowLeft } from 'lucide-react';
import { useEventActivityDetails } from '@app/hooks/data/collaborate/useEvents';
import Error from '@/components/shared/Error';

const EventActivity: React.FC = () => {
    const { event_id, content_id } = useParams<{ event_id: string, content_id: string }>();

    if (!event_id || !content_id) {
        return <Alert title='Event Activity Not Found.' type='danger' />
    }

    const { data: eventDetails, isLoading, isError, error } = useEventActivityDetails(event_id);

    // Memoized calculations for current activity and navigation
    const { currentContent, nextActivity, prevActivity } = useMemo(() => {
        if (!eventDetails?.list || eventDetails.list.length === 0) {
            return {
                currentContent: null,
                nextActivity: null,
                prevActivity: null
            };
        }

        const currentIndex = eventDetails.list.findIndex(
            (content) => content.id === parseInt(content_id)
        );

        return {
            currentContent: currentIndex >= 0 ? eventDetails.list[currentIndex] : null,
            nextActivity: currentIndex < eventDetails.list.length - 1 ? eventDetails.list[currentIndex + 1] : null,
            prevActivity: currentIndex > 0 ? eventDetails.list[currentIndex - 1] : null
        };
    }, [eventDetails, content_id]);

    if (isLoading) {
        return <Loading loading={isLoading} />
    }

    if (isError) {
        return <Error error={error?.message || 'Failed to load event activity content.'} />
    }

    if (!currentContent) {
        return <Alert title='Activity Not Found.' type='danger' />
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
                <div className='md:col-span-12 flex items-center gap-3'>
                    <div>
                        <Link to={`/event-activity/${event_id}`} className='text-primary flex items-center gap-2 mb-4'>
                            <ArrowLeft size={30} />
                        </Link>
                    </div>
                    <div className='mb-4'>
                        <h1 className="text-2xl font-bold dark:text-primary text-primary">Event Activity</h1>
                    </div>
                </div>
                <div className='md:col-span-9'>
                    <Player content={currentContent} />
                    <EventInstructions instructions={eventDetails?.competition_instructions} />
                </div>
                <div className='md:col-span-3'>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sticky top-20">
                        <div>
                            <div className='flex justify-between items-center'>
                                {prevActivity && (
                                    <Link
                                        to={`/event-activity/${event_id}/content/${prevActivity.id}`}
                                        className='flex justify-start w-full cursor-pointer'
                                    >
                                        <span className="px-2 py-2 text-primary rounded-lg transition hover:transform hover:scale-110">
                                            <FaChevronLeft size={24} />
                                        </span>
                                    </Link>
                                )}
                                <h2 className="text-2xl font-bold dark:text-primary text-primary">Activities</h2>
                                {nextActivity && (
                                    <Link
                                        to={`/event-activity/${event_id}/content/${nextActivity.id}`}
                                        className='flex justify-end w-full cursor-pointer'
                                    >
                                        <span className="px-2 py-2 text-primary rounded-lg transition hover:transform hover:scale-110">
                                            <FaChevronRight size={24} />
                                        </span>
                                    </Link>
                                )}
                            </div>
                            {eventDetails?.list?.map((activity, index) => {
                                const isActive = currentContent.id === activity.id;
                                return (
                                    <Link
                                        key={activity.id}
                                        to={`/event-activity/${event_id}/content/${activity.id}`}
                                        className='cursor-pointer'
                                    >
                                        <div className={`border border-primary rounded-lg shadow-md p-3 mt-3 flex justify-between items-center transition-colors ${isActive ? 'bg-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                            <h3 className={`text-lg font-semibold line-clamp-1 ${isActive ? 'dark:text-dark text-white' : 'dark:text-primary text-primary'}`}>
                                                {index + 1}. {activity.title}
                                            </h3>
                                            <FaChevronRight size={24} className={isActive ? 'text-white' : 'text-primary'} />
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


interface InstructionProps {
    instructions?: {
        faq?: string;
        instructions?: string;
        whats_in?: string;
    };
}

const EventInstructions: React.FC<InstructionProps> = ({ instructions }) => {
    if (!instructions) return null;
    const { faq, instructions: instr, whats_in } = instructions;
    if (!faq && !instr && !whats_in) return null;

    return (
        <section className="mt-6">
            <h2 className="text-lg font-bold !text-primary mb-3">
                Event Instructions
            </h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl space-y-4">
                {faq && <InstructionBlock title="FAQs" html={faq} />}
                {instr && <InstructionBlock title="Instructions" html={instr} />}
                {whats_in && (
                    <InstructionBlock title="WHATS IN IT FOR YOU" html={whats_in} />
                )}
            </div>
        </section>
    );
};

const InstructionBlock: React.FC<{ title: string; html: string }> = ({
    title,
    html,
}) => (
    <div>
        <h3 className="text-xl font-bold mb-2 !text-primary">{title}</h3>
        <SafeHtml html={html} className="text-gray-600 dark:text-gray-300" />
    </div>
);

export default EventActivity
