
import Heading from '@/components/heading';
import LoadingSection from '@/components/LoadingSection';
import { Button } from '@/components/ui/ShadcnButton';
import { useEvents } from '@app/hooks/data/collaborate/useEvents';
import { formatedApiDate } from '@/utils/dateFormat';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';


type ResourceCategory = "Masterclass" | "Workshops" | "Industry Visits" | "Competitions" | "Immersion Programs";


const categoryMap: Record<ResourceCategory, number> = {
    Masterclass: 4,
    Workshops: 3,
    "Competitions": 8,
    "Industry Visits": 5,
    "Immersion Programs": 9,
};

const Resources = () => {

    // get ?event_category_id=Workshop from url
    const searchParams = new URLSearchParams(window.location.search);
    const eventCategory = searchParams.get("category") as ResourceCategory;

    const [activeTab, setActiveTab] = useState<ResourceCategory>("Masterclass");
    const categoryId = categoryMap[activeTab];
    const params = new URLSearchParams();
    params.append("event_category_id", categoryId?.toString());
    const { data: events, isLoading, isError } = useEvents(params);

    useEffect(() => {
        console.log("eventCategory", eventCategory);
        if (eventCategory) {
            setActiveTab(eventCategory || "Masterclass");
        }
    }, [eventCategory]);


    return (
        <div>
            <Heading title="On The Agenda" description="Explore upcoming events, workshops, and networking opportunities designed to enhance your skills and connect you with industry professionals." className="mb-0" />
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                {events?.map((event) => (
                    <Link key={event.id} to={`/agenda/details/${event.id}`}>
                        <div className="border rounded-lg shadow overflow-hidden hover:shadow-lg relative hover:transform hover:scale-95 transition-transform duration-300 min-w-[270px]">
                            <div className="relative h-48">
                                <img src={event.image} alt={event.name} className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(event.name);
                                    }}
                                />
                                <span className="absolute top-2 left-0 dark:bg-white text-xs px-3 py-1 rounded-r-full font-medium shadow-sm}">
                                    <img src={event.org_logo} alt={event.name} className="w-12" />
                                </span>
                            </div>
                            <div className="p-4 border-b border-[#7fbC42]">
                                <h3 className="mb-3 text-xl font-semibold line-clamp-2">{event.name ?? '-'}</h3>
                                <p className="mb-3 text-sm line-clamp-3 text-muted-foreground">{stripHtmlTags(event.description)}</p>
                                <div className="className">
                                    <p className='text-cblack text-base'>Mode of Delivery: {event.vanue ?? 'Online'}</p>
                                    <p className='text-cblack text-base'>Date of Event: {formatedApiDate(event.start_date)} - {formatedApiDate(event.end_date)}</p>
                                </div>
                            </div>
                            {
                                event?.skill && <div className="p-4">
                                    <p className="font-medium text-base mb-2">Skill Set:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {event?.skill?.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>}
                            <div className="p-4 flex justify-end">
                                <Button className="w-10px p-4 dark:text-black text-white">Register Now</Button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div>
                {isLoading && <LoadingSection title='Loading events...' isLoading={isLoading} description='Please wait while we fetch the latest events.' />}
                {
                    events && events?.length === 0 && !isLoading && !isError && (
                        <p className="text-center text-gray-500">No {activeTab} found.</p>
                    )
                }
            </div>
        </div>
    )
}
export default Resources
