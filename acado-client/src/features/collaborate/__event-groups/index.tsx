import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/ShadcnButton';
import { CalendarDays, MoveRight, Pin, } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '@app/hooks/data/collaborate/useEvents';
import LoadingSection from '@/components/LoadingSection';
import { formatedApiDate } from '@/utils/dateFormat';
import Heading from '@/components/heading';

const Mustattenddetail = () => {


    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    const title = searchParams.get("name") || 'Events';
    const description = searchParams.get("description") || '';

    const params = new URLSearchParams();
    params.append("event_category_id", id || '');
    const { data: events, isLoading, isError } = useEvents(params);

    return (
        <div>
            <Heading title={title} description={description} />
            <div className="rounded-lg overflow-hidden md:overflow-auto w-screen md:w-auto mb-10 mt-4">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                    {events?.map((event) => (
                        <Link key={event.id} to={`/must-attend/details/${event.id}`}>
                            <Card
                                key={event.id}
                                className="border rounded-lg shadow overflow-hidden hover:shadow-lg relative transition-transform duration-300 hover:scale-95 cursor-pointer"
                            >
                                <CardHeader className="py-3">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <h3 className="text-lg font-semibold">{event.name}</h3>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <img src={event.image} alt={event.name} className="h-40 w-full object-cover" />
                                </CardContent>
                                <CardFooter className="flex flex-col items-start gap-3 p-4">
                                    <h5 className="text-md font-semibold line-clamp-1">{event.name}</h5>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CalendarDays className="h-5 w-5 text-cblue" />
                                        <span>
                                            Date of Event: <span className="font-semibold">{formatedApiDate(event.start_date)}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Pin className="h-5 w-5 text-cblue" />
                                        <span>
                                            Location: <span className="font-semibold">{event.location}</span>
                                        </span>
                                    </div>
                                    <div className="w-full flex justify-end">
                                        <Button className="flex items-center gap-2 text-white">
                                            Register Now
                                            <MoveRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}

                </div>
                <div>
                    {isLoading && <LoadingSection title='Loading events...' isLoading={isLoading} description='Please wait while we fetch the latest events.' />}
                    {
                        events && events?.length === 0 && !isLoading && !isError && (
                            <p className="text-center text-gray-500">No {title} found.</p>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Mustattenddetail;
