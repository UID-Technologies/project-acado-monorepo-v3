// import React, { lazy } from 'react';
// import { Activity } from '@app/types/learner/events';
// import { Calendar } from 'lucide-react';
// import { CiStopwatch } from "react-icons/ci";
// import { Link } from 'react-router-dom';
// import { formatDate } from '@/utils/commonDateFormat';


// const Assignment = lazy(() => import('./Assignment'));

// type PlayerProps = {
//     content: Activity;
// };

// const getYoutubeEmbedUrl = (url: string) => {
//     const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
//     return videoIdMatch
//         ? `https://www.youtube.com/embed/${videoIdMatch[1]}?modestbranding=1&rel=0&showinfo=0&disablekb=1`
//         : null;
// };

// const Player: React.FC<PlayerProps> = ({ content }) => {
//     const youtubeEmbedUrl = content?.content_type === 'video_yts' ? getYoutubeEmbedUrl(content.content ?? '') : null;
//     const isPdf = content?.content_type === 'notes';
//     const isAssignment = content?.content_type === 'assignment';
//     const isAssessment = content?.content_type === 'assessment';
//     const isVideo = content?.content_type === 'video';
//     const isZoomClass = content?.content_type === 'zoomclass';
//     const isTeamClass = content?.content_type === 'teamsclass';


//     return (
//         <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6">
//             <div className='mb-3 border-b border-gray-200 dark:border-gray-600 pb-3'>
//                 <h1 className="text-2xl font-bold dark:text-primary text-primary">{content?.title}</h1>
//                 <div className='flex items-center gap-2 mt-2'>
//                     <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-1">
//                         <Calendar size={16} />
//                         {formatDate(content?.start_date, "DD/MM/YYYY")} - {formatDate(content?.end_date, "DD/MM/YYYY")}
//                     </span>
//                     <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600">
//                         {content?.difficulty_level}
//                     </span>
//                     <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-1">
//                         <CiStopwatch size={16} /> {content?.duration} mins
//                     </span>
//                 </div>
//             </div>
//             {/* YouTube Video Player */}
//             {youtubeEmbedUrl && (
//                 <div className="mb-6">
//                     <iframe
//                         allowFullScreen
//                         className="w-full h-64 md:h-[30rem] rounded-lg"
//                         src={youtubeEmbedUrl}
//                         title="YouTube video player"
//                         frameBorder="0"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     ></iframe>
//                 </div>
//             )
//             }

//             {
//                 isPdf && (
//                     // PDF Viewer using React-PDF
//                     <div className="mb-6 border border-gray-300 rounded-lg overflow-hidden">
//                         <div className="h-96 md:h-[30rem] overflow-auto">
//                             <iframe
//                                 className="w-full h-full"
//                                 src={`${content?.content}#toolbar=1`}
//                                 title="PDF Viewer"
//                                 frameBorder="0"
//                                 allow="fullscreen"
//                             ></iframe>
//                         </div>
//                     </div>
//                 )
//             }

//             {isAssignment && <Assignment content={content} />}

//             {isAssessment && (
//                 <div className="">
//                     <div className='flex justify-between items-center mb-3 border-b border-gray-200 dark:border-gray-600 pb-3'>
//                         <h1 className="text-xl font-semibold text-accent mb-3">Assessment</h1>
//                         <Link
//                             className="px-4 py-2 bg-primary hover:bg-primary-mild text-ac-dark rounded-lg transition"
//                             to={`/assessmentQuestion/${content?.id}`}> Start Assessment </Link>
//                     </div>
//                     <p className="text-gray-700 dark:text-gray-300 mb-3">
//                         This is an assessment activity. You will be evaluated based on your responses, and you will be graded accordingly. Please make sure you are ready before starting the assessment.
//                     </p>
//                     <p className="text-gray-700 dark:text-gray-300 mb-3">
//                         Click the button above to start the assessment.
//                     </p>
//                 </div>
//             )}
//             {isVideo && content?.content && (
//                 <div className="mb-6">
//                     <video
//                         controls
//                         className="w-full h-64 md:h-[30rem] rounded-lg bg-black"
//                     >
//                         <source src={content?.content} type="video/mp4" />
//                         Your browser does not support the video tag.
//                     </video>
//                     {/* <Streaming videoId={content?.id?.toString() ?? ''} content={content?.content} /> */}
//                 </div>
//             )}
//             {
//                 (!isVideo && content?.content) && (
//                     <a href={content?.content} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary hover:bg-primary-mild text-ac-dark rounded-lg transition">
//                         View Content
//                     </a>
//                 )
//             }
//             {
//                 ((isZoomClass || isTeamClass) && (content?.open_url || content?.zoom_url)) && (
//                     <div className="mb-6">
//                         <a href={content?.open_url || content?.zoom_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary hover:bg-primary-mild text-ac-dark rounded-lg transition">
//                             Join Class
//                         </a>
//                     </div>
//                 )
//             }


//             <p className="text-gray-700 dark:text-gray-300 mt-4" dangerouslySetInnerHTML={{ __html: content?.description }}></p>
//         </div>
//     );
// };

// export default Player;

import React, { lazy, useRef, useState, useEffect, useCallback } from 'react';
import { Activity } from '@app/types/learner/events';
import { Calendar } from 'lucide-react';
import { CiStopwatch } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/commonDateFormat';
import { saveContentCompletion } from '@services/learning/CourseService';
import PdfRender from '@features/player/pdf';
import { useAssessmentResult } from '@app/hooks/data/useCourses';
import AssessmentScoreboard from './AssessmentScoreboard';

const Assignment = lazy(() => import('./Assignment'));

type PlayerProps = {
    content: Activity;
};

// Debounce hook
const useDebounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(callback: T, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    return useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
};

const getYoutubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch
        ? `https://www.youtube.com/embed/${videoIdMatch[1]}?modestbranding=1&rel=0&showinfo=0&disablekb=1`
        : null;
};

const Player: React.FC<PlayerProps> = ({ content }) => {

    const videoRef = useRef<HTMLVideoElement>(null);
    const [completion, setCompletion] = useState(content?.completion_percentage || 0);
    const [lastSavedCompletion, setLastSavedCompletion] = useState(content?.completion_percentage || 0);
    const youtubeEmbedUrl = content?.content_type === 'video_yts' ? getYoutubeEmbedUrl(content.content ?? '') : null;
    const isPdf = content?.content_type === 'notes';
    const isAssignment = content?.content_type === 'assignment';
    const isAssessment = content?.content_type === 'assessment';
    const isVideo = content?.content_type === 'video';

    // Fetch assessment result if it's an assessment
    const { data: assessmentResult } = useAssessmentResult(
        isAssessment ? content?.id?.toString() : undefined
    );


    // Function to save progress
    const saveProgress = useCallback(async (currentTime: number, duration: number, isPlaying: boolean = true) => {
        if (!content?.id || !duration || currentTime === 0) {
            return;
        }

        // Don't save if video is completed (currentTime equals or exceeds duration)
        if (currentTime >= duration) {
            return;
        }

        // Convert to percentage
        const percentage = (currentTime / duration) * 100;
        const roundedPercentage = Math.floor(percentage);

        // Only save if completion percentage increased by at least 1% and is playing
        if (roundedPercentage > lastSavedCompletion && isPlaying) {
            try {
                const formData = new FormData();
                formData.append('bookmark', Math.floor(currentTime).toString()); // Time in seconds
                formData.append('content_id', content.id.toString());
                formData.append('completion', roundedPercentage.toString());

                await saveContentCompletion(formData);
                console.log("Progress saved:", roundedPercentage + "%");
                setCompletion(roundedPercentage);
                setLastSavedCompletion(roundedPercentage);
            } catch (error) {
                console.error("Error saving progress:", error);
            }
        }
    }, [content?.id, lastSavedCompletion]);

    // Debounced save progress function
    const debouncedSaveProgress = useDebounce(saveProgress, 3000); // 3 seconds debounce

    // Handle time update for progress tracking
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;

        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        const isPlaying = !videoRef.current.paused && !videoRef.current.ended;

        if (duration && currentTime > 0) {
            // Update local completion state immediately for UI
            const percentage = (currentTime / duration) * 100;
            const roundedPercentage = Math.floor(percentage);

            if (roundedPercentage > completion) {
                setCompletion(roundedPercentage);
            }

            // Debounced API call
            debouncedSaveProgress(currentTime, duration, isPlaying);
        }
    };

    // Handle video completion
    const handleVideoEnded = async () => {
        if (!videoRef.current || !content?.id) return;

        const duration = videoRef.current.duration;

        // Mark as 100% completed when video ends
        try {
            const formData = new FormData();
            formData.append('bookmark', Math.floor(duration).toString());
            formData.append('content_id', content.id.toString());
            formData.append('completion', '100');

            await saveContentCompletion(formData);
            console.log("Video completed: 100%");
            setCompletion(100);
            setLastSavedCompletion(100);
        } catch (error) {
            console.error("Error marking video as completed:", error);
        }
    };

    // Periodic progress saving (every 10 seconds) as backup
    useEffect(() => {
        if (!isVideo || !videoRef.current) return;

        const interval = setInterval(() => {
            if (videoRef.current) {
                const currentTime = videoRef.current.currentTime;
                const duration = videoRef.current.duration;
                const isPlaying = !videoRef.current.paused && !videoRef.current.ended;

                if (duration && currentTime > 0 && isPlaying) {
                    const percentage = (currentTime / duration) * 100;
                    const roundedPercentage = Math.floor(percentage);

                    // Only save if there's significant progress not captured by timeupdate
                    if (roundedPercentage > lastSavedCompletion + 5) {
                        saveProgress(currentTime, duration, isPlaying);
                    }
                }
            }
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, [isVideo, content?.id, lastSavedCompletion, saveProgress]);

    // Initialize lastSavedCompletion when content changes
    useEffect(() => {
        if (content?.completion_percentage !== undefined) {
            setLastSavedCompletion(Number(content.completion_percentage));
            setCompletion(Number(content.completion_percentage));
        }
    }, [content?.completion_percentage]);

    return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className='mb-3 border-b border-gray-200 dark:border-gray-600 pb-3'>
                <h1 className="text-2xl font-bold dark:text-primary text-primary capitalize">{content?.title}</h1>
                <div className='flex items-center gap-2 mt-2'>
                    <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-1">
                        <Calendar size={16} />
                        {formatDate(content?.start_date, "DD/MM/YYYY")} - {formatDate(content?.end_date, "DD/MM/YYYY")}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600">
                        {content?.difficulty_level}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-1">
                        <CiStopwatch size={16} /> {content?.duration} mins
                    </span>
                </div>
            </div>

            {/* YouTube Video Player */}
            {youtubeEmbedUrl && (
                <div className="mb-6">
                    <iframe
                        allowFullScreen
                        className="w-full h-64 md:h-[30rem] rounded-lg"
                        src={youtubeEmbedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                </div>
            )}

            {isPdf && (
                <div className="mb-6 border border-gray-300 rounded-lg overflow-hidden">
                    <div className="h-96 md:h-[30rem] overflow-auto">
                        {/* <iframe
                            className="w-full h-full"
                            src={`${content?.content}#toolbar=1`}
                            title="PDF Viewer"
                            frameBorder="0"
                            allow="fullscreen"
                        ></iframe> */}
                        <PdfRender fileUrl={content?.content || ''} />
                    </div>
                </div>
            )}

            {isAssignment && <Assignment content={content} />}

            {isAssessment && (
                <div>
                    {/* Assessment Scoreboard - Show if there's a result */}
                    {assessmentResult && <AssessmentScoreboard result={assessmentResult} />}

                    {/* Assessment Instructions and Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className='flex justify-between items-center mb-3 border-b border-gray-200 dark:border-gray-600 pb-3'>
                            <h1 className="text-xl font-semibold text-accent mb-3">Assessment</h1>
                            {content?.can_reattempt &&
                                <div>
                                    {
                                        (content?.action === 'Not Attempted' || content?.action === 'Attempt') && (
                                            <Link
                                                className="px-4 py-2 bg-primary hover:bg-primary-mild text-ac-dark rounded-lg transition"
                                                to={`/assessmentQuestion/${content?.id}`}
                                            >
                                                Start Assessment
                                            </Link>
                                        )
                                    }
                                    {
                                        content?.action === 'View Result' && (
                                            <Link className="px-4 py-2 bg-primary hover:bg-primary-mild text-ac-dark rounded-lg transition" to={`/assessmentResult/${content?.id}`}>
                                                View Result
                                            </Link>
                                        )
                                    }
                                </div>
                            }
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                            This is an assessment activity. You will be evaluated based on your responses, and you will be graded accordingly. Please make sure you are ready before starting the assessment.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                            Click the button above to start the assessment.
                        </p>
                    </div>
                </div>
            )
            }

            {
                isVideo && content?.content && (
                    <div className="mb-6">
                        <video
                            ref={videoRef}
                            controls
                            className="w-full h-64 md:h-[30rem] rounded-lg bg-black"
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={handleVideoEnded}
                        >
                            <source src={content?.content} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        {/* Progress indicator */}
                        {/* {completion > 0 && completion < 100 && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Progress: {completion}%
                        </div>
                    )} */}
                        {/* {completion === 100 && (
                        <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-semibold">
                            ✓ Completed
                        </div>
                    )} */}
                    </div>
                )
            }

            {
                <div>
                    {
                        content && content?.liveclass_action === "Join Class" && (
                            <div className="mb-6">
                                {
                                    (content.open_url || content.zoom_url) && (
                                        <a href={`${content.open_url || content.zoom_url}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary hover:bg-primary-mild text-ac-dark rounded-lg transition">
                                            Join Class
                                        </a>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            }

            <p className="text-gray-700 dark:text-gray-300 mt-4" dangerouslySetInnerHTML={{ __html: content?.description }}></p>
        </div >
    );
};

export default Player;
