import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Plus, X, Video } from 'lucide-react';
import { useCommunityStore } from '@app/store/learner/communityStore';
import { fetchCommunity } from '@services/learner/CommunityService';
import { formatDistanceToNow } from 'date-fns';
import VideoPlayer from '@/components/videoPlayer/VideoPlayer';

export function getRelativeTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
}

interface CommunityPageProps {
    showHeaderAndButton?: boolean;
}

export default function CommunityCard({ showHeaderAndButton = true }: CommunityPageProps) {
    const { community, setCommunity } = useCommunityStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
     const [playingReel, setPlayingReel] = useState(null);
    
    const [newPost, setNewPost] = useState({
        name: '',
        description: '',
        image: '',
        postType: '',
    });

    const handleCloseVideo = () => {
        setPlayingReel(null)
      }
    

    useEffect(() => {
        const getCommunityList = async () => {
            try {
                const postData = await fetchCommunity();
                setCommunity(postData);
                console.log('community data is', community);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        getCommunityList();
    }, [setCommunity]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewPost((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('New post:', newPost);
        setIsDialogOpen(false);
        setNewPost({ name: '', description: '', image: '', postType: '' });
    };

    return (
        <div className="max-w-8xl mx-auto px-4 py-8">
            {showHeaderAndButton && (
                <div className="flex justify-between items-center mb-20">
                    <h1 className="text-3xl font-bold">Community/Post</h1>
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors dark:text-gray-800"
                    >
                        <Plus className="h-5 w-5 dark:text-gray-800" />
                        Create Post
                    </button>
                </div>
            )}

            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="dark:bg-gray-700 rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold dark:text-gray-100">Create New Post</h2>
                            <button onClick={() => setIsDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Post Title
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Post Title"
                                    value={newPost.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Post Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Post Description"
                                    value={newPost.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                    Image URL
                                </label>
                                <input
                                    id="image"
                                    name="image"
                                    type="url"
                                    placeholder="Image URL"
                                    value={newPost.image}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="postType" className="block text-sm font-medium text-gray-700 mb-1">
                                    Post Type
                                </label>
                                <select
                                    id="postType"
                                    name="postType"
                                    value={newPost.postType}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select post type</option>
                                    <option value="article">Article</option>
                                    <option value="question">Question</option>
                                    <option value="discussion">Discussion</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors dark:text-gray-800"
                            >
                                Create Post
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {community && community.length > 0 ? (
                    community.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 transition-transform hover:scale-[1.02]"
                        >
                            <div className="relative aspect-[16/9]">
                                {post.resource_type === 'video' ? (
                                    <VideoPlayer src={post.resource_path || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}  isPlaying={true} onClose={handleCloseVideo}/>
                                ) : (
                                    <img
                                        src={post.thumbnail_url || 'https://elms.edulystventures.com/joy_content/course1.jpeg'}
                                        alt="post"
                                        className="object-cover w-full h-full"
                                    />
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm dark:text-gray-100">{getRelativeTime(post.created_at)}</span>
                                    <span className="text-sm dark:text-gray-100">3 min read</span>
                                </div>

                                <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-primary dark:text-primary">
                                    {post.name}
                                </h3>
                                <p className="dark:text-gray-100 text-sm mb-4 line-clamp-2">
                                    {post.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-6">
                                        <button className="flex items-center gap-1 dark:text-gray-100 dark:hover:text-red-500">
                                            <Heart className="h-5 w-5" />
                                            <span className="text-sm dark:text-gray-100">{post.like_count}</span>
                                        </button>
                                        <button className="flex items-center gap-1 dark:text-gray-100 dark:hover:text-blue-500">
                                            <MessageCircle className="h-5 w-5" />
                                            <span className="text-sm">{post.comment_count}</span>
                                        </button>
                                    </div>
                                    <button className="dark:text-gray-100 hover:text-gray-900">
                                        <Share2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No Community Available</div>
                )}
            </div>
        </div>
    );
}
