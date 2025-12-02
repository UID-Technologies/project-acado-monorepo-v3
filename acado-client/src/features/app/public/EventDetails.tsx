import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import { useEventById } from "@app/hooks/data/collaborate/useEvents";
import { formatDate } from "@/utils/dateUtils";
import SafeHtml from "@/components/SafeHtml";
import LoadingSection from "@/components/LoadingSection";
import { Button } from "@/components/ui/ShadcnButton";
import { CompetitionsInstructions, EventProgramContent, EventProgramDetails } from "@app/types/collaborate/events";
import { BsCalendarFill, BsCheckCircleFill, BsClockFill, BsXCircleFill } from "react-icons/bs";
import { PiUserFill } from "react-icons/pi";

const EventDetails: React.FC = () => {
    const { event_id } = useParams();
    const [showBannerModal, setShowBannerModal] = useState(false);
    const { data: eventData, isLoading, isSuccess } = useEventById(event_id);

    const competition = eventData?.competitions_details?.program;
    const competitionInstructions = eventData?.competition_instructions;

    if (isLoading) return <LoadingSection isLoading title="Loading Event Details..." />;

    if (!isSuccess || !competition) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                {/* Back Button */}
                <Link
                    to="/events"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors mb-4 sm:mb-6"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium">Back to Events</span>
                </Link>

                {/* Event Banner */}
                <EventBanner
                    competition={competition}
                    event_id={event_id!}
                    showBannerModal={showBannerModal}
                    setShowBannerModal={setShowBannerModal}
                />

                {/* Skills Section */}
                {eventData?.job_skill_details?.all_program_skills?.length > 0 && (
                    <section className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            Skills you will gain
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {eventData.job_skill_details.all_program_skills.map((skill: any, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm font-medium rounded-full"
                                >
                                    {typeof skill === 'string' ? skill : skill.skill_name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Description Section */}
                <EventDescription competition={competition} />

                {/* Activities Section */}
                <EventActivities contents={competition?.contents} />

                {/* Event Instructions */}
                <EventInstructions instructions={competitionInstructions} />
            </div>

            {/* Image Modal */}
            {showBannerModal && (
                <BannerModal
                    competition={competition}
                    onClose={() => setShowBannerModal(false)}
                />
            )}
        </div>
    );
};

export default EventDetails;

interface EventBannerProps {
    competition: EventProgramDetails;
    event_id: string;
    showBannerModal: boolean;
    setShowBannerModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventBanner: React.FC<EventBannerProps> = ({
    competition,
    event_id,
    setShowBannerModal
}) => {
    const StatusIcon = ({ status }: { status?: string }) => {
        switch (status?.toLowerCase()) {
            case "active":
            case "ongoing":
                return <BsCheckCircleFill size={16} className="text-green-500 shrink-0" />;
            case "pending":
                return <BsClockFill size={16} className="text-yellow-500 shrink-0" />;
            case "inactive":
            case "closed":
            case "completed":
                return <BsXCircleFill size={16} className="text-red-500 shrink-0" />;
            default:
                return <BsCheckCircleFill size={16} className="text-primary shrink-0" />;
        }
    };

    const formatEventDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-GB', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div
                    className="relative w-full lg:w-2/5 bg-gray-100 dark:bg-gray-900 flex items-center justify-center cursor-pointer min-h-[250px] sm:min-h-[300px]"
                    onClick={() => setShowBannerModal(true)}
                >
                    <img
                        src={competition?.image || "/img/event/event.jpg"}
                        alt={competition?.name || "Event"}
                        className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 sm:p-6 space-y-4">
                    {/* Title */}
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                        {competition?.name}
                    </h1>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-700 dark:text-gray-300">
                        {/* Event Date */}
                        {competition?.event_details?.event_datetime && (
                            <div className="flex items-start gap-2">
                                <BsClockFill size={16} className="text-primary shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-gray-900 dark:text-gray-200">Event Date: </span>
                                    <span className="text-gray-700 dark:text-gray-300">{formatEventDate(competition.event_details.event_datetime)}</span>
                                </div>
                            </div>
                        )}

                        {/* Domain */}
                        {competition?.event_details?.functional_domain && (
                            <div className="flex items-start gap-2">
                                <PiUserFill size={18} className="text-primary shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-gray-900 dark:text-gray-200">Domain: </span>
                                    <span className="text-gray-700 dark:text-gray-300">{competition.event_details.functional_domain}</span>
                                </div>
                            </div>
                        )}

                        {/* Registration Dates */}
                        <div className="flex items-start gap-2">
                            <BsCalendarFill size={16} className="text-primary shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-gray-900 dark:text-gray-200">Registration: </span>
                                <span className="text-gray-700 dark:text-gray-300">
                                    {formatEventDate(competition?.start_date)} - {formatEventDate(competition?.end_date)}
                                </span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-start gap-2">
                            <StatusIcon status={competition?.com_status?.program_status} />
                            <div>
                                <span className="font-semibold text-gray-900 dark:text-gray-200">Status: </span>
                                <span className="capitalize text-gray-700 dark:text-gray-300">{competition?.com_status?.program_status || "Active"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Join Button */}
                    {competition?.com_status?.program_status === "Ongoing" && (
                        <div className="pt-2">
                            <Button asChild className="w-full sm:w-auto">
                                <Link
                                    to={`/event-activity/${event_id}`}
                                    className="inline-flex items-center justify-center"
                                >
                                    Join Now
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BannerModal: React.FC<{ competition: EventProgramDetails; onClose: () => void }> = ({
    competition,
    onClose,
}) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
        onClick={onClose}
    >
        <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl relative max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Close Button */}
            <button
                className="absolute top-3 right-3 z-10 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                aria-label="Close modal"
                onClick={onClose}
            >
                <RxCross2 size={24} className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* Image */}
            <div className="overflow-auto max-h-[90vh]">
                <img
                    src={competition?.image || "/img/event/event.jpg"}
                    alt={competition?.name || "Event"}
                    className="w-full h-auto object-contain bg-gray-100 dark:bg-gray-900"
                />
            </div>
        </div>
    </div>
);

const EventDescription: React.FC<{ competition: EventProgramDetails }> = ({ competition }) => (
    <section className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Description
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <SafeHtml
                html={competition?.description || "No description available."}
                className="text-gray-900 dark:text-gray-100 leading-relaxed prose prose-gray dark:prose-invert max-w-none prose-sm sm:prose-base [&_*]:text-gray-900 dark:[&_*]:text-gray-100"
            />
        </div>
    </section>
);

const EventActivities: React.FC<{ contents?: EventProgramContent[] }> = ({ contents }) => {
    if (!contents?.length) return null;

    return (
        <section className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Activities
            </h2>
            <div className="space-y-3 sm:space-y-4">
                {contents.map((content, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                            <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    {content?.title}
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {content?.description}
                                </p>
                            </div>
                            <span className="bg-primary text-white dark:text-gray-900 font-semibold px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap self-start">
                                {content?.status}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={16} className="shrink-0 text-gray-600 dark:text-gray-400" />
                                <span>{formatDate(content?.start_date)}</span>
                                {content?.end_date && (
                                    <>
                                        <span className="mx-1">–</span>
                                        <span>{formatDate(content?.end_date)}</span>
                                    </>
                                )}
                            </div>
                            {content?.expected_duration && (
                                <div className="flex items-center gap-1.5">
                                    <Clock size={16} className="shrink-0 text-gray-600 dark:text-gray-400" />
                                    <span>{content.expected_duration}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const EventInstructions: React.FC<{ instructions?: CompetitionsInstructions }> = ({ instructions }) => {
    if (!instructions) return null;

    const { faq, instructions: instr, whats_in } = instructions;
    if (!faq && !instr && !whats_in) return null;

    return (
        <section className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Event Instructions
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-200 dark:border-gray-700">
                {whats_in && <InstructionBlock title="What's In It For You" html={whats_in} />}
                {instr && <InstructionBlock title="Instructions" html={instr} />}
                {faq && <InstructionBlock title="FAQs" html={faq} />}
            </div>
        </section>
    );
};

const InstructionBlock: React.FC<{ title: string; html: string }> = ({
    title,
    html,
}) => (
    <div className="first:pt-0 pt-4 first:border-t-0 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {title}
        </h3>
        <SafeHtml
            html={html}
            className="text-gray-900 dark:text-gray-100 leading-relaxed html-content prose prose-gray prose-sm sm:prose-base dark:prose-invert max-w-none prose-span:text-black"
        />
    </div>
);
