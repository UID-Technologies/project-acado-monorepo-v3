import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Loader, Clock, Users, CheckCircle, XCircle } from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";

import Loading from "@/components/shared/Loading";
import SafeHtml from "@/components/SafeHtml";
import Content from "./activities/Content";
import { useEventById, useEventApply } from "@app/hooks/data/collaborate/useEvents";
import { formatDate } from "@/utils/commonDateFormat";
import { EventDetails, EventProgramContent, EventProgramDetails } from "@app/types/collaborate/events";
import Error from "@/components/shared/Error";

const EventActivity: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [showBannerModal, setShowBannerModal] = useState(false);

    const { data: eventData, isLoading, isError, error } = useEventById(id);
    const applyMutation = useEventApply();

    const competition = eventData?.competitions_details?.program;
    const competitionInstructions = eventData?.competition_instructions;

    const handleApply = () => {
        if (!id) {
            toast.error("Event ID is missing");
            return;
        }

        applyMutation.mutate(id, {
            onSuccess: () => {
                toast.success("Successfully applied for the Event!");
            },
            onError: (error: Error) => {
                toast.error(error?.message || "Failed to apply for Event. Please try again.");
            },
        });
    };

    const showContentDetails = (content: EventProgramContent) => {
        navigate(`/event-activity/${id}/content/${content.id}`);
    };

    if (isLoading) return <Loading loading />;
    if (isError) return <Error error={error?.message || "Failed to load event details"} />;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 rounded-lg">
            <div>
                {/* Header */}
                <div className="flex gap-3 items-center mb-6">
                    <Link
                        to="/events-list"
                        className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Event Details
                    </h1>
                </div>

                {/* Event Banner */}
                <EventBanner
                    competition={competition}
                    eventData={eventData}
                    showBannerModal={showBannerModal}
                    setShowBannerModal={setShowBannerModal}
                    handleApply={handleApply}
                    applyMutationPending={applyMutation.isPending}
                />

                {/* Skills Section */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Skills you will gain
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {eventData?.job_skill_details?.all_program_skills?.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                        {
                            eventData?.job_skill_details?.all_program_skills?.length === 0 && (
                                <span className="text-gray-600 dark:text-gray-300">
                                    No skills information available.
                                </span>
                            )
                        }
                    </div>
                </section>

                {/* Description Section */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Description
                    </h2>
                    <SafeHtml
                        html={competition?.description || "This workshop introduces participants to macramé as a contemporary design language. Led by Dhagawali, the session explores how knotting techniques (lark's head, square, half hitch, gathering) translate into textures, structures, and modular forms for fashion accents and home décor..."}
                        className="text-gray-700 dark:text-gray-300 leading-relaxed prose dark:prose-invert max-w-none"
                    />
                </section>

                {/* Activities Section */}
                {competition && competition?.contents?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Activities
                        </h2>
                        <div className="space-y-3">
                            {competition.contents.map((content) => (
                                <div
                                    key={content.id}
                                    className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-200"
                                    onClick={() => showContentDetails(content)}
                                >
                                    <Content content={content} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Event Instructions */}
                <EventInstructions instructions={competitionInstructions} />

                {/* Register Button */}
                {/* <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                    <button
                        disabled={Boolean(eventData?.is_assigned) || applyMutation.isPending}
                        className={`${Boolean(eventData?.is_assigned) || applyMutation.isPending
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-primary hover:bg-primary-dark"
                            } text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105`}
                        onClick={handleApply}
                    >
                        {eventData?.is_assigned ? "Enrolled" : "Register"}{" "}
                        {applyMutation.isPending && (
                            <Loader className="inline-block ml-2 animate-spin" size={16} />
                        )}
                    </button>
                </div> */}
            </div>

            {/* Popup Modal */}
            {showBannerModal && (
                <BannerModal
                    competition={competition}
                    onClose={() => setShowBannerModal(false)}
                />
            )}
        </div>
    );
};

export default EventActivity;

interface BannerProps {
    competition?: EventProgramDetails;
    eventData?: EventDetails;
    showBannerModal: boolean;
    setShowBannerModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleApply: () => void;
    applyMutationPending: boolean;
}



const EventBanner: React.FC<BannerProps> = ({
    competition,
    eventData,
    setShowBannerModal,
    handleApply,
    applyMutationPending,
}) => {
    const isDisabled = Boolean(eventData?.is_assigned) || applyMutationPending;



    const StatusIcon = ({ status }: { status?: string }) => {
        switch (status?.toLowerCase()) {
            case "active":
                return <CheckCircle size={16} className="text-green-500" />;
            case "pending":
                return <Clock size={16} className="text-yellow-500" />;
            case "inactive":
            case "closed":
                return <XCircle size={16} className="text-red-500" />;
            default:
                return <CheckCircle size={16} className="text-primary" />;
        }
    };


    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div
                    className="relative w-full md:w-2/5 cursor-pointer"
                    onClick={() => setShowBannerModal(true)}
                >
                    <img
                        src={competition?.image || ""}
                        alt="event"
                    // className="h-64 md:h-full w-full object-contain"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 space-y-4">
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {competition?.name || "THREADS OF EXPRESSION"}
                    </h1>






                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-primary" />
                            <span><strong>Duration:</strong> {competition?.event_details.venue || "10 to 15 hrs"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-primary" />
                            <span><strong>Domain:</strong> {competition?.event_details?.domain_name || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary" />
                            <span>
                                <strong>Date:</strong> {formatDate(competition?.start_date, "DD/MM/YYYY")} -{" "}
                                {formatDate(competition?.end_date, "DD/MM/YYYY")}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusIcon status={competition?.com_status?.program_status} />
                            <span><strong>Status:</strong> {competition?.com_status?.program_status || "Active"}</span>
                        </div>
                    </div>



                    {/* <div className="flex flex-wrap gap-2 pt-2">
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold rounded-full">
                                {competition?.com_status?.program_status || "Active"}
                            </span>
                        </div> */}


                    <button
                        disabled={isDisabled}
                        className={`${isDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-primary hover:bg-primary-dark"
                            } text-white font-bold py-2 px-6 rounded transition-colors mt-4`}
                        onClick={handleApply}
                    >
                        {eventData?.is_assigned ? "Enrolled" : "Apply Now"}{" "}
                        {applyMutationPending && (
                            <Loader className="inline-block ml-2 animate-spin" size={16} />
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
};

const BannerModal: React.FC<{ competition?: EventProgramDetails; onClose: () => void }> = ({
    competition,
    onClose,
}) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        onClick={onClose}
    >
        <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl relative max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <img
                src={competition?.image || ""}
                alt="event"
                className="w-full h-64 object-cover rounded-t-xl"
            />
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {competition?.name || "THREADS OF EXPRESSION"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {competition?.description?.split('.')[0] || "EXPLORING EMBROIDERY AS DESIGN"}
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    <SafeHtml
                        html={competition?.description || ""}
                        className="prose dark:prose-invert leading-relaxed"
                    />
                </div>
            </div>
            <button
                className="absolute top-4 right-4 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={onClose}
            >
                <RxCross2 size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
        </div>
    </div>
);

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
        <section className="mb-20">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Event Instructions
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700">
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
        <h3 className="text-sm md:text-md font-semibold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            {title}
        </h3>
        <SafeHtml
            html={html}
            className="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
        />
    </div>
);
