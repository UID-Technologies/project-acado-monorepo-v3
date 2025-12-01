import React from "react";
import { useLocation } from "react-router-dom";
import { Alert, Button } from '@/components/ui';
import { getCommentsList, sendComment } from "@services/learner/CommunityService";
import { BsChat } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";

export default function Content() {
    const location = useLocation();
    const { content } = location.state || {};
    const post_id = location.pathname.split('/').pop();

    const [showResources, setShowResources] = React.useState(false);
    const [showResourceIndex, setShowResourceIndex] = React.useState(0);
    const [comment, setComment] = React.useState('');

    interface Comment {
        name: string;
        submit_date: string;
        content: string;
    }

    const [comments, setComments] = React.useState<Comment[]>([]);

    const fetchComments = async () => {
        const response = await getCommentsList(post_id);
        setComments(response);
        localStorage.setItem(`comments_${post_id}`, JSON.stringify(response));
    };

    const handleSubmitComment = async () => {
        if (!comment.trim()) return;

        try {
            await sendComment(post_id, comment);
            setComment('');
            fetchComments(); // Refresh the comments
        } catch (error) {
            console.error("Failed to send comment:", error);
        }
    };

    React.useEffect(() => {
        if (post_id) {
            fetchComments();
        }
    }, [post_id]);

    if (!content) {
        return <Alert title="Content not found" type="warning" />;
    }

    const checkResourceType = (resource_path: string): 'img' | 'video' | 'pdf' | 'unknown' => {
        const resourceTypeMap: { [key: string]: 'img' | 'video' | 'pdf' | 'unknown' } = {
            jpg: 'img',
            png: 'img',
            jpeg: 'img',
            mp4: 'video',
            pdf: 'pdf',
        };
        const extension = resource_path.split('.').pop()?.toLowerCase();
        return extension && resourceTypeMap[extension] ? resourceTypeMap[extension] : 'unknown';
    };

    return (
        <article className="min-h-screen">
            <div className="relative h-[300px] md:h-[400px] bg-[#1A1D29] overflow-hidden rounded-lg">
                <div className="absolute inset-0">
                    <img
                        src={content.thumbnail_url || 'https://default-image-url.com'}
                        alt={content.title}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-64 relative z-10">
                {!showResources && (
                    <div className="bg-white dark:bg-gray-700 rounded-xl px-6 py-8 md:px-12 md:py-10">
                        <div className="flex justify-between gap-4">
                            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-8">
                                {content.title}
                            </h1>
                            <Button
                                className="border dark:border-gray-300"
                                onClick={() => setShowResources(true)}
                            >
                                Resources
                            </Button>
                        </div>
                        <div className="max-w-none">
                            <div
                                className="text-sm dark:text-gray-200"
                                dangerouslySetInnerHTML={{ __html: content?.description }}
                            />
                        </div>
                    </div>
                )}

                {showResources && (
                    <div className="bg-white dark:bg-gray-700 rounded-xl px-6 py-8 md:px-12 md:py-10">
                        <div className="flex justify-between gap-4">
                            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-8">
                                Resources
                            </h1>
                            <Button onClick={() => setShowResources(false)}>
                                Back
                            </Button>
                        </div>
                        <div className="max-w-none">
                            {content.resource_path && (
                                <div>
                                    {content.multi_file_uploads.map((file: any, index: number) => (
                                        <div key={index} className="mb-6">
                                            <div
                                                className="flex items-center gap-4 rounded-lg cursor-pointer p-3 border mb-3"
                                                onClick={() => setShowResourceIndex(index)}
                                            >
                                                <span>Content {index + 1}</span>
                                            </div>
                                            <div className={`flex items-center gap-4 rounded-lg overflow-hidden ${index === showResourceIndex ? 'block' : 'hidden'}`}>
                                                {checkResourceType(file) === 'img' && (
                                                    <img src={file} alt="Resource" className="w-full" />
                                                )}
                                                {checkResourceType(file) === 'video' && (
                                                    <video controls src={file} className="w-full" />
                                                )}
                                                {checkResourceType(file) === 'pdf' && (
                                                    <embed src={file} type="application/pdf" width="100%" height="600px" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 mt-8">
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-8">
                        Comments
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Add a comment"
                                className="w-full p-3 border rounded-lg"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSubmitComment();
                                    }
                                }}
                            />
                            <div className="absolute right-3 top-1">
                                <button
                                    className="p-2"
                                    onClick={handleSubmitComment}
                                >
                                    <IoMdSend size={25} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="comments">
                    {comments?.map((comment, index) => (
                        <div
                            key={index}
                            className="dark:bg-gray-900 bg-white mt-5 transition-transform rounded-lg shadow cursor-pointer p-4"
                        >
                            <div className="flex justify-start items-center gap-2 mb-3">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${comment?.name}&background=random&color=fff`}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <h3 className="font-bold text-base capitalize dark:text-white">
                                        {comment?.name}
                                    </h3>
                                    <p className="text-xs opacity-35 dark:text-gray-200">
                                        {new Date(comment?.submit_date).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })} - {new Date(comment?.submit_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p>{comment?.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="w-12 h-12 fixed bottom-6 right-6 z-10 bg-[#1A1D29] rounded-full flex justify-center items-center cursor-pointer hover:transform hover:scale-105 transition-transform"
                onClick={() =>
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth',
                    })
                }
            >
                <BsChat size={30} className="text-white" />
            </button>
        </article>
    );
}
