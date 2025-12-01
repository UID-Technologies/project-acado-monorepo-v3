import Error from "@/components/shared/Error"
import React from 'react';
import Loading from "@/components/shared/Loading"
import { fetchEventById, fetchInternshipApply } from "@services/public/EventService"
import { useEventDetailsStore as usePublicEventStore } from "@app/store/public/EventStore"
import { useInternshipStore } from '@app/store/learner/internshipStore';
import { fetchInternship } from '@services/learner/InternshipService';
import { ArrowLeft, Calendar } from "lucide-react"
import { useSnackbar } from "notistack"

import { useEffect, useState, useCallback } from "react"
import { RxCross2 } from "react-icons/rx"
import { Link, useNavigate, useParams } from "react-router-dom"
import Content from "./Content"
import type { ContentData } from "@app/types/learner/events"
import { paginateData } from "@app/types/learner/mailbox";

const InternshipPage: React.FC = () => {
    const { setInternship, internship, } = useInternshipStore();

    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const { id } = useParams()
    const {
        setEventDetails: setPublicEventDetail,
        eventdetails,
        error,
        setError,
        loading,
        setLoading,
    } = usePublicEventStore()
    const [showBannerModel, setShowBannerModel] = useState(false)
    const [applying, setApplying] = useState(false)
    const [hasApplied, setHasApplied] = useState(false)

    const loadEventDetails = useCallback(async () => {
        if (!id) {
            enqueueSnackbar("Event not found", { variant: "error" })
            navigate("/events-list")
            return
        }
        setLoading(true)
        setError("")
        try {
            const response = await fetchEventById(id)
            setPublicEventDetail(response)
            // Check if user has already applied (if your API provides this info)
            // setHasApplied(response.hasApplied || false);
        } catch (err) {
            setError("Failed to load event details. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [id, setLoading, setPublicEventDetail, setError, enqueueSnackbar, navigate])


    React.useEffect(() => {
        setLoading(true);
        setError('');
        fetchInternship()
            .then((res) => {
                if (Array.isArray(res)) {
                    setInternship(res);
                } else {
                    setError('Invalid response format');
                }
            })
            .catch((err) => {
                console.error('Fetch Internship Error:', err);
                setError(typeof err === 'string' ? err : err.message || 'Failed to load internships');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [setError, setLoading, setInternship]);

    useEffect(() => {
        loadEventDetails()
    }, [loadEventDetails])

    const showContentDetails = (content: ContentData) => {
        navigate(`/event-activity/${id}/content/${content.id}`)
    }

    const handleApply = async () => {
        if (!id) return

        setApplying(true)
        try {
            await fetchInternshipApply(id)
            setHasApplied(true)
            enqueueSnackbar("Successfully applied for the internship!", { variant: "success" })
        } catch (err) {
            enqueueSnackbar("Failed to apply for internship. Please try again.", { variant: "error" })
        } finally {
            setApplying(false)
        }
    }

    if (loading) return <Loading loading={loading} />
    if (error) return <Error error={error} />

    const jobData = internship.find(item => item.job_status);
    const jobStatus = jobData ? jobData.job_status : "Apply Now";

    return (
        <>
            <div className="flex gap-3 justify-start items-center">
                <Link to="/internship" className="text-primary dark:text-primary">
                    <ArrowLeft size={30} />
                </Link>
                <h1 className="text-3xl font-bold text-start dark:text-primary text-primary">Internship Details</h1>
            </div>

            {/* Event Banner */}
            <div className="bg-white dark:bg-gray-800 mt-4 rounded-lg shadow-md overflow-hidden cursor-pointer mb-10">
                <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/3 cursor-pointer" onClick={() => setShowBannerModel(true)}>
                        <img
                            src={eventdetails?.competitions_details?.program?.image || ""}
                            alt="event"
                            className="h-48 md:h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex-1 p-4 space-y-4 border-l border-gray-200 dark:border-gray-700 dark:bg-gray-900 bg-white opacity-90">
                        <div className="flex justify-between items-start">
                            <h6 className="font-bold text-gray-800 dark:text-white">
                                {eventdetails?.competitions_details?.program?.name}
                            </h6>

                        </div>
                        <div
                            className="text-sm text-gray-600 dark:text-gray-400"
                            dangerouslySetInnerHTML={{ __html: eventdetails?.competitions_details?.program?.description }}
                        ></div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600">
                                {eventdetails?.competitions_details?.program?.com_status?.program_status}
                            </span>
                            <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600">
                                {eventdetails?.competitions_details?.program?.competition_level}
                            </span>
                            <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2">
                                <Calendar size={16} /> {eventdetails?.competitions_details?.program?.start_date}
                            </span>
                            <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2">
                                <Calendar size={16} /> {eventdetails?.competitions_details?.program?.end_date}
                            </span>

                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleApply()
                            }}
                            disabled={applying || hasApplied || jobStatus === "Application Under Process" || jobStatus === "Application Shortlisted"}
                            className={`px-4 py-2 rounded-lg text-white font-medium ${hasApplied
                                ? "dark:bg-gray-200 bg-gray-200 hover:bg-gray-600 dark:text-ac-dark"
                                : applying
                                    ? "bg-gray-400 cursor-not-allowed dark:text-ac-dark"
                                    : "bg-gray-400 hover:bg-gray-300 dark:text-ac-dark"
                                }`}
                        >
                            {jobStatus ?? "Apply Now"}
                        </button>

                    </div>

                </div>

            </div>
            {jobStatus === 'Application Shortlisted' && (
                <>
                    <h1 className="text-3xl font-bold mb-3 text-start dark:text-primary text-primary">
                        Activities
                    </h1>
                    <div className="space-y-4">
                        {eventdetails?.competitions_details?.program?.contents?.length ? (
                            eventdetails.competitions_details.program.contents.map((content, index) => (
                                <div key={index} onClick={() => showContentDetails(content)}>
                                    <Content content={content} />
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400">After Shorlisting Your Profile You can Attempt Activity</p>
                        )}
                    </div>
                </>
            )}





            {showBannerModel && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => setShowBannerModel(false)}
                >
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg relative md:w-1/2 w-11/12">
                        <img
                            src={eventdetails?.competitions_details?.program?.image || ""}
                            alt="event"
                            className="h-96 w-full object-cover"
                        />
                        <h2 className="text-lg font-bold text-gray-800 dark:text-primary text-lightPrimary mt-3">
                            {eventdetails?.competitions_details?.program?.name}
                        </h2>
                        <div
                            className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: eventdetails?.competitions_details?.program?.description }}
                        ></div>
                        <button
                            className="absolute top-2 right-5 border-2 cursor-pointer border-primary mt-3 px-2 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                            onClick={() => setShowBannerModel(false)}
                        >
                            <RxCross2 />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default InternshipPage

