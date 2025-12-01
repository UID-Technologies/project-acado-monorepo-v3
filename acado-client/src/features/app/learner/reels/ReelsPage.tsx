import { Heart, Play, X } from 'lucide-react';
import { useState, useEffect } from "react";
import { IoPerson } from 'react-icons/io5';
import { fetchReels, incrementViewCount,likeReel, unlikeReel  } from '@services/learner/ReelsService';
import { useReelsStore } from '@app/store/learner/reelsStore';
import { stripHtmlTags } from '@/utils/stripHtmlTags';

export default function ReelsGrid() {
  const { reels, setReels, setError, setIsLoading } = useReelsStore();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [playingReel, setPlayingReel] = useState<any | null>(null);
  const [likedReels, setLikedReels] = useState<{ [key: number]: boolean }>({});
  const [commentOpen, setCommentOpen] = useState<number | null>(null);
  const [expandedDescription, setExpandedDescription] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    setIsLoading(true);
    fetchReels()
      .then((response) => {
        setReels(response);
        const initialLikedReels = response.reduce((acc: { [key: number]: boolean }, reel: any) => {
          acc[reel.id] = reel.user_liked === 1;
          return acc;
        }, {});
        setLikedReels(initialLikedReels);
      })
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  }, []);

  const formatNumber = (num: number): string => {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
  };

  const handlePlayVideo = (reel: any) => {
    incrementViewCount(reel.id);
    setPlayingReel(reel.resource_path);
  };

  const handleCloseVideo = () => {
    setPlayingReel(null);
  };

  const toggleLike = async (id: number) => {
    try {
      if (likedReels[id]) {
        await unlikeReel(id);
      } else {
        await likeReel(id);
      }
      const updatedReels = reels.map((reel) => {
        if (reel.id === id) {
          return {
            ...reel,
            like_count: likedReels[id] ? reel.like_count - 1 : reel.like_count + 1,
          };
        }
        return reel;
      });
      setReels(updatedReels);
      setLikedReels((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));


      console.log("Liked Reel ID:", id);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const toggleComment = (id: number) => {
    setCommentOpen(commentOpen === id ? null : id);
    console.log("Comment Box Toggled for ID:", id);
  };

  const toggleDescription = (id: number) => {
    setExpandedDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-8">
      <div className="mx-auto max-w-8xl">
        <h1 className="mb-8 text-3xl font-bold dark:text-primary text-primary">
          Trending Reels
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reels &&
            reels.map((reel) => (
              <div
                key={reel.id}
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-700 shadow-md transition-all hover:shadow-xl"
                onMouseEnter={() => setHoveredId(reel.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Video Thumbnail */}
                <div
                  className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                  onClick={() => handlePlayVideo(reel)}
                >
                  <img
                    src={reel.thumbnail_url || "/placeholder.svg"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {hoveredId === reel.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity">
                      <Play className="h-16 w-8 text-white opacity-80" />
                    </div>
                  )}
                  {/* User Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex justify-center items-center overflow-hidden rounded-full border-2 border-white">
                        <IoPerson size={20} className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {reel?.name}
                        </p>
                        {/* <p className="text-xs text-gray-300">{user?.role}</p> */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactions (Like & Comment) */}
                <div className="flex items-center justify-between p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formatNumber(reel.view_count)} views
                  </p>
                  <div className="flex space-x-4">
                    {/* Like Button */}
                    <button
                      onClick={() => toggleLike(reel.id)}
                      className="flex items-center space-x-1 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {likedReels[reel?.id] ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="red"
                          viewBox="0 0 24 24"
                          stroke="none"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      ) : (
                        <Heart className="h-4 w-4 dark:text-gray-300" />
                      )}
                      <span className="text-xs dark:text-gray-300">
                        {formatNumber(reel?.like_count)}
                      </span>
                    </button>

                    {/* Comment Button
                    <button
                      onClick={() => toggleComment(reel?.id)}
                      className="relative flex items-center space-x-1 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <MessageCircle className="h-4 w-4 dark:text-gray-300" />
                      <span className="text-xs dark:text-gray-300">100+</span>
                    </button> */}
                    {/* <button className="flex items-center space-x-1 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <Share2 className="h-4 w-4 dark:text-gray-300" />
                      <span className="text-xs dark:text-gray-300">{formatNumber(reel?.view_count)}</span>
                    </button> */}
                  </div>
                </div>
                <hr />

                {/* Description with Show More/Show Less */}
                {
                  reel?.description !== "" && <p className="dark:text-gray-100 m-2">
                    {expandedDescription[reel?.id] ? stripHtmlTags(reel?.description) : `${stripHtmlTags(reel?.description)?.slice(0, 100)}...`}
                  </p>
                }
                <button
                  className="text-primary dark:text-primary text-sm p-2"
                  onClick={() => toggleDescription(reel?.id)}
                >
                  {expandedDescription[reel?.id] ? 'Show Less' : 'Show More'}
                </button>

                {/* Comment Box (with Close Button) */}
                {commentOpen === reel?.id && (
                  <div className="absolute left-0 right-0 bottom-0 bg-white dark:bg-gray-700 shadow-lg rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        Write a comment...
                      </p>
                      <button
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900"
                        onClick={() => toggleComment(reel.id)}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <textarea className="w-full mt-2 p-2 border rounded-md dark:bg-gray-800 dark:text-white" />
                    <button className="mt-2 bg-primary dark:bg-primary text-white py-1 px-3 rounded-md">
                      Post
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {playingReel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50" onClick={handleCloseVideo}>
          <div className="relative w-11/12 max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <button onClick={handleCloseVideo} className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black">
              <X className="h-6 w-6" />
            </button>
            <video src={playingReel} controls className="w-full h-[80vh] object-contain" autoPlay />
          </div>
        </div>
      )}
    </div>
  );
}
