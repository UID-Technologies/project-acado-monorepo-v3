import React from "react";
import { fetchNews } from "@services/learner/NewsServices";
import { useNewsStore } from '@app/store/learner/NewsStore';
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiLike, BiRightArrowAlt } from 'react-icons/bi';
import Loading from "@/components/shared/Loading";
import { Eye } from "lucide-react";

const News: React.FC = () => {
    const navigate = useNavigate();
    const { news, setNews, error, setError, loading, setLoading } = useNewsStore();

    useEffect(() => {
        setLoading(true);
        fetchNews().then((data) => {
            setNews(data);
        }).catch((error) => {
            setError(error);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const handleNewsNavigate = (item: any) => {
        navigate(`/newsLetterDetail/${item.id}`, {
            state: { newsDetail: item }
        });
    };

    // Function to handle image loading errors
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, item: any) => {
        const target = e.target as HTMLImageElement;
        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item?.title || 'News')}&background=random&size=256`;
    };

    // Function to get image URL with fallback
    const getImageUrl = (item: any) => {
        return item?.thumbnail_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item?.title || 'News')}&background=random&size=256`;
    };

    return (
        <div className='bg-gray-100 p-4 rounded-lg dark:bg-gray-800 mb-6 overflow-hidden'>
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h1 className="text-primary dark:text-primary">News</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Stay Updated With Our News
                    </p>
                </div>
                <div className="">
                    <Link to="/news-letter" className="text-primary dark:text-primary">
                        View All
                    </Link>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
                {loading && !news.length && <div className='flex justify-center items-center col-span-3 h-48'><Loading loading={loading} /></div>}
                {error && <div>Error: {error}</div>}
                {news && news.length > 0 && news.map((item, index) => (
                    index < 3 &&
                    <div
                        key={item.id}
                        onClick={() => handleNewsNavigate(item)}
                        className='group block md:flex items-center mb-3 rounded transform transition-transform hover:scale-[1.02] cursor-pointer dark:bg-gray-700 bg-white shadow-md overflow-hidden'
                    >
                        <div className="w-full md:w-48 md:min-w-48 h-48 md:h-28 flex-shrink-0">
                            <img
                                src={getImageUrl(item)}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-t md:rounded-l md:rounded-r-none"
                                onError={(e) => handleImageError(e, item)}
                                loading="lazy"
                            />
                        </div>
                        <div className='px-3 py-3 md:py-0 flex-1'>
                            <h6 className='font-semibold capitalize dark:text-primary text-primary'>{
                                item?.title?.length > 60 ? item?.title.substring(0, 60) + '...' : item?.title
                            }</h6>
                            <div 
                                className="line-clamp-2 text-sm dark:text-gray-200 mt-2" 
                                dangerouslySetInnerHTML={{
                                    __html: item?.description
                                }}
                            ></div>
                           
                           
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default News;
