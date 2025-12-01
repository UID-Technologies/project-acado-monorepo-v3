import React from 'react';
import { CiStopwatch } from 'react-icons/ci';
import { Event } from '@app/types/public/event';
import { formatDate } from '@/utils/dateUtils';
import { Link } from 'react-router-dom';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { Badge } from '@/components/ui/shadcn/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface EventCardProps {
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {


    const statusClass = () => {
        switch (event.com_status?.program_status) {
            case 'Ongoing':
                return 'bg-green-500 text-white px-2 py-1 rounded-md text-xs absolute top-2 right-2';
            case 'Completed':
                return 'bg-red-500 text-white px-2 py-1 rounded-md text-xs absolute top-2 right-2';
            default:
                return 'bg-gray-500 text-white px-2 py-1 rounded-md text-xs absolute top-2 right-2';
        }
    }

    return (
        <Card className='p-0 flex flex-col justify-between h-full'>
            <CardHeader className='p-0 h-48 overflow-hidden relative'>
                <img src={event.image} alt={event.name} className="rounded-t w-full object-cover" />
                <div className="absolute -top-1.5 bg-black bg-opacity-50 w-full h-full"></div>
                <Badge className={statusClass()}>{event.com_status?.program_status}</Badge>
            </CardHeader>
            <CardContent className='pt-2 flex flex-col gap-2'>
                <h6 className="font-semibold text-primary dark:text-primary">{event.name}</h6>
                <div className="dark:text-white text-gray-700 line-clamp-2 mt-2">
                    {stripHtmlTags(event.description)}
                </div>
                <div className="flex items-center dark:text-gray-300 text-gray-700">
                    <CiStopwatch />
                    <span className="ml-1">{formatDate(event.start_date, "dd MMM yyyy")}</span> &nbsp;-
                    <span className="ml-1">{formatDate(event.end_date, "dd MMM yyyy")}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Link to={`/events/${event.id}`}>
                    <button className="bg-primary px-3 py-2 mt-2 rounded-md text-ac-dark">View Details</button>
                </Link>
            </CardFooter>
        </Card>
    )
}

export default EventCard
