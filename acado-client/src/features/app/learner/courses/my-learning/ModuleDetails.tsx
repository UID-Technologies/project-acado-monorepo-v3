/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 20 March 2025
@author:: Edulyst Ventures  
@purpose : This component specifically for the learner to view the course content and navigate through the course content
@dependency :  This component is dependent on the course_id and module_id to fetch the course content

@@ Use case (if any use case) and solutions 

@modification history :

@date : 01 April 2025
@modification : Added Video streaming for the course content

@updatedAt : 16 Sep 2025 optemized the code and api handling with tankstack query

**/

import React, { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Button } from "@/components/ui/ShadcnButton";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import Assignments from "@features/player/assignment";
import ContentTypeIcons from "@features/player/content/icons";
import Assessment from "@features/player/assessment";
import VideoPlayer from "@features/player/video";
import Notes from "@features/player/notes";
import Streaming from "@features/player/stream";
import { Progress } from "@/components/ui/shadcn/progress";
import YoutubeVideoPlayer from "@features/player/youtube";
import { useCourseModuleDetails } from "@app/hooks/data/useCourses";
import { stripHtmlTags } from "@/utils/stripHtmlTags";
import { ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/breadcrumb";
import LockContent from "./LockContent";
import { CommonModuleContent } from "@app/types/learning/courses";

const Player: React.FC = () => {
    const [activeContent, setActiveContent] = useState<CommonModuleContent | null>(null);
    const { courseId, moduleId } = useParams<{ courseId: string, moduleId: string }>();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const contentId = searchParams.get("content_id") || '';
    const [uploadAssignmentDialog, setUploadAssignmentDialog] = useState<boolean>(false);
    const { data: moduleDetails, isLoading, isError, error } = useCourseModuleDetails(moduleId);
    const content = moduleDetails?.contents || [];
    const module = moduleDetails?.module_details;
    const course = moduleDetails?.course_details;
    const nextModule = moduleDetails?.next_module || null;
    const completedContents = content.filter(con => con?.completion);
    const moduleCompletion = Math.round((completedContents.length / content.length) * 100) || 0;

    if (contentId && !activeContent && content.length > 0) {
        const contentItem = content.find(c => c?.program_content_id?.toString() === contentId);
        if (contentItem) {
            setActiveContent(contentItem);
        }
    }
    else {
        if (content.length > 0 && !activeContent) {
            setActiveContent(content[0]);
        }
    }

    const handleContentNavigation = (direction: 'next' | 'prev') => {
        if (!content) return;

        const currentIndex = content.findIndex(c => c.program_content_id === activeContent?.program_content_id) || 0;
        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

        if (newIndex >= 0 && newIndex < content.length) {
            setActiveContent(content[newIndex]);
            updateContentId(content[newIndex].program_content_id);
        }
    };

    const updateContentId = (newContentId: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set("content_id", newContentId.toString());
        window.history.replaceState({}, "", url.toString());
    };

    if (isLoading) return <Loading loading={isLoading} />;
    if (isError) return <Alert title={error.message} type="danger" />;


    const breadcrumbItems = [
        { label: 'Courses', path: '/continue-learning' },
        { label: course?.name || 'Course Details', path: `/course-module/${course?.id}` },
        { label: module?.name || 'Module Details' }
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <div className="grid md:grid-cols-12 gap-5">
                <div className="col-span-1 md:col-span-9">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5">
                        {(activeContent && activeContent?.is_locked !== 1) && (
                            <>
                                <div className="mb-2 flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800 mb-2">{activeContent?.title}</h1>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <ContentTypeIcons content_type={activeContent?.content_type} />
                                            <span className="text-primary">{module?.name}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {activeContent?.content_type === 'assessment' && (
                                            activeContent?.attempt_date ? (
                                                <>
                                                    <Button asChild className="text-white dark:text-black">
                                                        <Link to={`/assessment/attempt/instructions/${courseId}/${activeContent?.program_content_id}`}>
                                                            Re-Attempt
                                                        </Link>
                                                    </Button>

                                                </>
                                            ) : (
                                                <Button asChild className="text-white dark:text-black">
                                                    <Link to={`/assessment/attempt/instructions/${courseId}/${activeContent?.program_content_id}`}>
                                                        Attempt
                                                    </Link>
                                                </Button>
                                            )
                                        )}
                                        {
                                            activeContent?.content_type === 'assignment' && (
                                                <Button title="Upload Assignment" className='text-white dark:text-black' onClick={() => setUploadAssignmentDialog(true)}>
                                                    Upload Assignment
                                                </Button>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className="rounded-lg mb-3">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{activeContent?.description}</p>
                                </div>
                                <ContentRenderer
                                    content={activeContent}
                                    courseId={courseId!}
                                    uploadAssignmentDialog={uploadAssignmentDialog}
                                    setUploadAssignmentDialog={setUploadAssignmentDialog}
                                />
                            </>
                        )}
                        {
                            (activeContent && activeContent?.is_locked === 1) && (
                                <LockContent content_id={activeContent?.program_content_id} />
                            )
                        }
                    </div>
                </div>
                <div className="border-gray-200 col-span-1 md:col-span-3 rounded-lg">
                    <div className="sticky top-20">
                        {content && content.length > 0 ? (
                            <div className="rounded-lg shadow-sm mb-6 bg-gray-100 dark:bg-gray-800">
                                <div className="p-4 border-b border-gray-300">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-sm font-semibold text-gray-800 capitalize">{module?.name}</h2>
                                        <p className="text-xs text-gray-500 mb-2">{moduleCompletion}%</p>
                                    </div>
                                    <div className="h-1 bg-gray-200 rounded">
                                        <Progress value={moduleCompletion} className="h-1 bg-gray-300 rounded" />
                                    </div>
                                </div>
                                <div className="p-2">
                                    <ScrollArea className="max-h-[350px] overflow-auto flex flex-col">
                                        {content.map((contentItem: CommonModuleContent, index: number) => (
                                            <button
                                                key={index}
                                                className={`w-full text-left p-3 rounded-lg transition-colors mb-2 ${activeContent?.program_content_id === contentItem?.program_content_id
                                                    ? "dark:bg-black bg-white text-blue-600"
                                                    : "hover:dark:bg-gray-700 hover:bg-gray-200"
                                                    } !rounded-button whitespace-nowrap`}
                                                onClick={() => { setActiveContent(contentItem); updateContentId(contentItem?.program_content_id) }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ContentTypeIcons content_type={contentItem?.content_type} />
                                                    <div className="w-full">
                                                        <span>{index + 1}</span><span className="flex-1 truncate">.&nbsp;{
                                                            contentItem?.title?.length > 25 ? contentItem?.title?.slice(0, 25) + '...' : contentItem?.title
                                                        }</span>
                                                        <div className="flex justify-between items-center gap-3 mt-1">
                                                            <Progress color="#000" value={parseInt(`${contentItem?.completion}`)} className="h-1 bg-gray-300 rounded" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </ScrollArea>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-600">No modules found</div>
                        )}
                        <div className="mt-6 flex justify-between px-2">
                            <button
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-400 text-gray-700 rounded hover:bg-gray-300 transition-colors !rounded-button whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                                disabled={activeContent?.program_content_id === content[0]?.program_content_id}
                                onClick={() => handleContentNavigation('prev')}
                            >
                                <ChevronRight className="inline-block rotate-180" />
                                Previous
                            </button>
                            <button
                                className={`px-4 py-2 bg-primary text-white dark:text-black rounded hover:bg-primary/50 transition-colors !rounded-button whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed`}
                                disabled={activeContent?.program_content_id === content[content.length - 1]?.program_content_id}
                                onClick={() => handleContentNavigation('next')}
                            >
                                Next
                                <ChevronRight className="inline-block ml-2" />
                            </button>
                        </div>
                        {
                            nextModule && nextModule?.name && (
                                <div className="mt-5">
                                    <span className="dark:text-gray-200 text-xs mt-4">Next Module</span>
                                    <Link to={`/courses/${courseId}/modules/${nextModule?.id}`}>
                                        <div className="p-4 border dark:border-gray-700 mt-2 rounded shadow cursor-pointer group flex justify-between items-center dark:bg-black bg-white">
                                            <div>
                                                <h2 className="text-sm font-semibold text-gray-800 mb-2 group-hover:text-cpink capitalize">
                                                    {nextModule?.name}
                                                </h2>
                                                <p className="line-clamp-2 text-gray-500">{stripHtmlTags(nextModule?.description || '--')}</p>
                                            </div>
                                            <div>
                                                <ChevronRight size={25} className="text-gray-400 group-hover:text-cpink float-right" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div >
        </div >
    );
};


interface ContentRendererProps {
    content: CommonModuleContent;
    courseId: string;
    setUploadAssignmentDialog: React.Dispatch<React.SetStateAction<boolean>>;
    uploadAssignmentDialog: boolean;
}

const ContentRenderer = ({ content, uploadAssignmentDialog, setUploadAssignmentDialog }: ContentRendererProps) => {
    switch (content?.content_type) {
        case "assessment":
            return <Assessment content={content} />;
        case "video":
            return content?.stream_file_id ? (
                <Streaming content={content} videoId={content?.stream_file_id} />
            ) : (
                <VideoPlayer content={content} />
            );
        case "video_yts":
            return <YoutubeVideoPlayer content={content} />;
        case "notes":
            return <Notes content={content} />;
        case "assignment":
            return (
                <Assignments
                    content_url={content?.assignment_file}
                    content_id={content.program_content_id}
                    uploadAssignmentDialog={uploadAssignmentDialog}
                    setUploadAssignmentDialog={setUploadAssignmentDialog}
                />
            );
        case "zoomclass":
            return (
                <div className="rounded-lg overflow-hidden flex justify-center items-center mb-6 bg-gray-100 h-[450px] border py-16">
                    <Button onClick={() => window.open(content?.url, "_blank")}>
                        Join Zoom Class
                    </Button>
                </div>
            );
        default:
            return null;
    }
};

export default Player;
