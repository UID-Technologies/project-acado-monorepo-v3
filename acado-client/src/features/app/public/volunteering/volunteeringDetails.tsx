import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchEventById } from '@services/public/EventService';
import { useEventDetailsStore } from '@app/store/public/EventStore';
import Loading from "@/components/shared/Loading";
import { Alert } from "@/components/ui";
import { CiStopwatch } from 'react-icons/ci';
import { formatDate } from '@/utils/dateUtils';

const VolunteeringDetails: React.FC = () => {
    const { program_id } = useParams();
    const { setEventDetails, eventdetails, error, setError, loading, setLoading } = useEventDetailsStore();

    useEffect(() => {
        if (!program_id) {
            setError("Invalid Event ID");
        } else {
            setError("");
            setLoading(true);
            fetchEventById(program_id)
                .then((response) => {
                    setEventDetails(response);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error);
                    setLoading(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [program_id]);

    if (loading) {
        return <Loading loading={loading} />;
    }

    if (error) {
        return (
            <Alert title="Error" type="danger" showIcon={true} className="mt-4">
                {error}
            </Alert>
        );
    }

    return (
        <div className="mt-8">
            {/* Banner Section */}
            <div
                style={{
                    backgroundImage: `url('/img/event/event.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "500px",
                }}
                className="relative rounded-lg flex justify-center items-end "
            >
                <div className="absolute inset-0 bg-gray-900 opacity-50 dark:opacity-70 rounded-lg"></div>
                <div className="absolute w-[95%] bottom-[-50%] md:bottom-[-15%] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    {/* banner */}
                    <div className="md:flex">
                        <div>
                            <img src={eventdetails?.competitions_details?.program?.image} alt="logo" className="md:rounded-s-lg rounded-t-lg md:rounded-r-none" />
                        </div>
                        <div className="w-full px-5 py-3">
                            <div className="flex justify-between items-center gap-3 border-b py-4 mb-3 w-full">
                                <h2 className="text-2xl md:text-4xl font-bold text-primary dark:text-primary w-full">
                                    {eventdetails?.competitions_details?.program.name}
                                </h2>
                                <div>
                                    {/* <Link to={`/event-activity/${event_id}`} className="bg-primary text-white dark:text-gray-900 font-bold py-2 px-6 rounded hover:bg-primary-light dark:hover:bg-primary-dark transition">
                                        Join Now
                                    </Link> */}
                                </div>
                            </div>
                            <div className="text-gray-700 dark:text-gray-400 line-clamp-6"
                                dangerouslySetInnerHTML={{ __html: eventdetails?.competitions_details?.program.description }}
                            >
                                {/* {eventdetails?.competitions_details?.program.description} */}
                            </div>
                            {/* time */}
                            <div className="mt-4 flex pb-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <CiStopwatch />
                                    <span>{formatDate(eventdetails?.competitions_details?.program.start_date, "dd MMM yyyy")}</span> &nbsp;-
                                    <span>{formatDate(eventdetails?.competitions_details?.program.end_date, "dd MMM yyyy")}</span>

                                </div>
                            </div>
                            <Link to={`/event-activity/${program_id}`} className="bg-primary text-white dark:text-gray-900 font-bold py-2 px-6 rounded hover:bg-primary-light dark:hover:bg-primary-dark transition">
                                Join Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Event Details Section */}
            
            <div className="container mx-auto mt-72 md:mt-28 w-[95%]">
                {/* Competition Instructions */}
                <div className="mt-8">
                    <h2 className="text-lg font-bold text-primary dark:text-primary mb-3">
                        Programs Details
                    </h2>
                    <div className="text-gray-700 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: eventdetails?.competitions_details?.program.description }}></div>
                    <h2 className="text-lg font-bold text-primary dark:text-primary mb-3">
                       Volunteering Activities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        {
                            eventdetails?.competitions_details?.program?.contents.map((content, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5">
                                    <div className="flex justify-between items-center gap-3 border-b mb-3 pb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                                {content.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {content.description}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="bg-primary text-white dark:text-gray-900 font-bold px-3 py-1 rounded">
                                                {content.status}
                                            </span>
                                        </div>
                                    </div>
                                    {/* time */}
                                    <div className="mt-4">
                                        <div className="flex items-center gap-1">
                                            <CiStopwatch />
                                            <span>{formatDate(content.start_date, "dd MMM yyyy")}</span> &nbsp;-
                                            <span>{formatDate(content.end_date, "dd MMM yyyy")}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className=" font-bold text-primary dark:text-primary mb-3">
                        Event Instructions
                    </h2>
                    {/* faq */}
                    <div>
                        <h3 className="text-xl font-bold mb-2 pb-2 text-primary dark:text-primary">
                            FAQs
                        </h3>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: eventdetails?.competition_instructions?.faq,
                            }}
                            className="text-gray-600 dark:text-gray-300 "
                        ></p>
                    </div>
                    {/* Instructions */}
                    <div className="mt-4">
                        <h3 className="text-xl font-bold  mb-2 pb-2 text-primary dark:text-primary">
                            Instructions
                        </h3>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: eventdetails?.competition_instructions?.instructions,
                            }}
                            className="text-gray-600 dark:text-gray-300"
                        ></p>
                    </div>
                    {/* Whats in */}
                    <div className="mt-4">
                        <h3 className="text-xl font-bold  mb-2 pb-2 text-primary dark:text-primary">
                            WHATS IN IT FOR YOU
                        </h3>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: eventdetails?.competition_instructions?.whats_in,
                            }}
                            className="text-gray-600 dark:text-gray-300"
                        ></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteeringDetails;
