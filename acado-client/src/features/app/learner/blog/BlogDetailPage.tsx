import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { fetchPostDetail } from '@services/learner/BlogServices';
import { useBlogDetailStore } from '@app/store/learner/BlogStore';
import { MessageCircle, Share2Icon } from 'lucide-react';
import { useEffect, useState } from "react";
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import { useParams } from "react-router-dom";

export default function BlogDetailPage() {
    const { id } = useParams();
    const { setPostDetail, postDetail, error, setError, loading, setLoading } = useBlogDetailStore();
    const fetchPost = (id: string) => {
        setLoading(true);
        setError("");
        fetchPostDetail(id).then((response) => {
            console.log(response);
            if (!response) {
                setError("Blog not found");
                return;
            }
            setPostDetail(response);
        }).catch((error) => {
            setError(error);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        if (!id) {
            setError("Blog not found");
            return;
        }

        fetchPost(id);

    }, [id]);

   
    const [copied, setCopied] = useState(false);
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (error) {
        return <Alert title={error} type="danger" />;
    }

    if (loading) {
        return <Loading loading={loading} />;
    }

    return (
        <article className="min-h-screen">
            <div className="relative h-[300px] md:h-[400px] bg-[#1A1D29] overflow-hidden rounded-lg">
                <div className="absolute inset-0">
                    <img
                        src={postDetail?.thumbnail_url || "https://default-image-url.com"}
                        alt={postDetail?.title}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
          
            <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
                <div className="bg-white dark:bg-gray-700 rounded-xl px-6 py-8 md:px-12 md:py-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600 dark:text-primary uppercase">{postDetail?.platform || "PLATFORM"}</span>
                            <span className="text-sm text-gray-500 dark:text-primary">• {postDetail?.read_time || "2 min read"}</span>
                        </div>
                        <div className="relative flex gap-2">
                            <button
                                onClick={handleCopyLink}
                                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                            >
                                <Share2Icon className="text-gray-600 dark:text-gray-200" />
                            </button>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                                <FaFacebook className="w-5 h-5 text-white" />
                            </a>
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                                <FaLinkedin className="w-5 h-5 text-white" />
                            </a>
                            {copied && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs px-3 py-1 rounded">
                                    Link Copied!
                                </div>
                            )}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                        {postDetail?.title}
                    </h1>
                    <div
                        className="text-sm dark:text-gray-200"
                        dangerouslySetInnerHTML={{ __html: postDetail?.description || "" }}
                    ></div>
                </div>
            </div>
            <button
                className="fixed bottom-6 right-6 bg-[#1A1D29] text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                aria-label="Open chat"
            >
                <MessageCircle className="w-6 h-6" />
            </button>
        </article>
    );
}
