import { useEffect } from "react";
import { MessageCircle } from 'lucide-react';
import { fetchPostDetail } from '@services/learner/BlogServices';
import { useBlogDetailStore } from '@app/store/learner/BlogStore';
import { SocialShare } from "@learner/blog/SocialSharePage";
import { useParams } from "react-router-dom";
import { Alert } from "@/components/ui";
import Loading from "@/components/shared/Loading";

export default function NewsLetterDetailPage() {

    const { id } = useParams();
    const { setPostDetail, postDetail, error, setError, loading, setLoading } = useBlogDetailStore();

    const fetchPost = (id: string) => {
        setLoading(true);
        setError("");
        fetchPostDetail(id).then((response) => {
            console.log(response);
            if (!response) {
                setError("News not found");
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


    const socialLinks = [
        { platform: "LinkedIn", url: "https://linkedin.com/in/janesmith", icon: "linkedin" },
    ];


    if (error) {
        return <Alert title={error} type="danger" />;
    }

    if (loading) {
        return <Loading loading={loading} />;
    }



    return (
        <article className="min-h-screen">
            <div className="relative h-[250px] md:h-[450px] bg-[#1A1D29] overflow-hidden rounded-lg">
                <div className="absolute inset-0">
                    <img
                        src={postDetail?.thumbnail_url}
                        alt={postDetail?.title}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                            e.currentTarget.src = "https://ui-avatars.com/api/?name=" + postDetail?.title;
                        }}
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
                <div className="bg-white dark:bg-gray-700 rounded-lg px-6 py-8 md:px-12 md:py-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600 dark:text-primary uppercase">{postDetail?.platform || "PLATFORM"}</span>
                            <span className="text-sm text-gray-500 dark:text-primary">• {postDetail?.read_time || "2 min read"}</span>
                        </div>
                        <SocialShare
                            socialLinks={socialLinks}
                            title={postDetail?.title || "Blog Title"}
                        />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-8 dark:text-primary text-primary">
                        {postDetail?.title}
                    </h1>
                    <div className="max-w-none">
                        <div className="text-sm dark:text-gray-200" dangerouslySetInnerHTML={{
                            __html: postDetail?.description || "Blog Description"
                        }}></div>
                    </div>
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
