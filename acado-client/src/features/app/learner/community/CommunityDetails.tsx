import React, { useEffect, useState, useCallback } from 'react'
import { fetchCommunity, fetchCommunityById } from '@services/public/CommunityService'
import { fetchCommunityJoin } from '@services/learner/CommunityJoinService'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useCommunityDetailsStore } from '@app/store/learner/communityStore'
import { FaPlus } from 'react-icons/fa6';
import { BsChat, BsHeart, BsPeople } from 'react-icons/bs';
import { CommunityCategory, Post } from '@app/types/learner/community';
import { formatDistanceToNow } from "date-fns";
import { fetchCreateContent } from '@services/learner/CreateContentService';
import { likeCommunity, unlikeCommunity } from '@services/learner/CommunityService'
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { X } from 'lucide-react';
import { set } from 'react-hook-form'


function CommunityDetails() {
    const { id = '209' } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const {
        community,
        setCommunity,
        communityContent,
        setCommunityContent,
        error,
        setError,
        loading,
        setLoading,
    } = useCommunityDetailsStore()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [communities, setCommunities] = useState<any[]>([])
    const [communityJoinLoading, setCommunityJoinLoading] = useState<boolean>(false)
    const [likedCommunities, setLikedCommunities] = useState<{ [key: number]: boolean }>({})
    const [showModal, setShowModal] = React.useState<boolean>(false)

    const fetchCommunityDetails = async () => {
        setError('')
        setLoading(true)
    
        if (!id) {
            setError('Community not found.')
            setLoading(false)
            return
        }
    
        try {
            const response = await fetchCommunityById(id)
    
            setCommunity(response?.category as unknown as CommunityCategory)
    
            // Reverse the list so the last post comes on top
            const reversedList = Array.isArray(response?.list) ? [...response.list].reverse() : []
    
            setCommunityContent(reversedList as unknown as Post[])
    
            const initialLikedCommunities: { [key: number]: boolean } = reversedList.reduce((acc: { [key: number]: boolean }, community: Post) => {
                acc[community.id] = community.user_liked === 1
                return acc
            }, {})
    
            setLikedCommunities(initialLikedCommunities)
    
        } catch (error: any) {
            console.log('Error:', error)
            setError(error.message || 'Failed to load community details.')
        } finally {
            setLoading(false)
        }
    }
    

    useEffect(() => {
        fetchCommunityDetails()
    }, [id])

    const [newPost, setNewPost] = useState({
        name: '',
        description: '',
        image: '',
        postType: '',
    })

    const [formData, setFormData] = useState({
        category_id: id,
        title: '',
        description: '',
        content_type: 'carvaan',
        post_type: '',
        status: 1,
        aspect_ratio: '',
        dimension: { height: 0, width: 0 },
        thumbnail: null as File | null,
        file: null as File | null,
    })

    const handleInputChanged = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        if (file) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                thumbnail: file,
            }));
        }
    }

    const toggleModal = () => {
        setShowModal(!showModal)
    }

    const handleCommunityContent = (communityItem: Post) => {
        navigate(`/communities/content/${communityItem.id}`, {
            state: { content: communityItem },
        })
    }

    // Join Community
    const handleCommunityJoin = async () => {
        const categoryIds = communities.map((c) => c.id.toString())
        const mergedCategoryIds = id ? [id, ...categoryIds] : categoryIds
        try {
            setCommunityJoinLoading(true)
            await fetchCommunityJoin(mergedCategoryIds.join(','))

            community.user_mapping_id = 1;
            community.total_user_joined += 1;

        } catch (err: any) {
            setError(err.message || 'Failed to join community.')
        } finally {
            setCommunityJoinLoading(false)
        }
    }
        
    const handleSubmit = async () => {
        console.log('Form Data:', formData)
        toggleModal()

        if (!formData) {
            setError('Community not found.')
            return
        }

        try {
            setLoading(true)
            await fetchCreateContent(formData)
            fetchCommunityDetails()
        } catch (err: any) {
            setError(err.message || 'Failed to load community details.')
        } finally {
            setLoading(false)
        }
    }

    const formatNumber = (num: number): string => {
        return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
      };

    const toggleLike = async (id: number) => {
        try {
            if (likedCommunities[id]) {
                await unlikeCommunity(id)
            } else {
                await likeCommunity(id)
            }
            const updatedCommunities = communityContent.map((communityItem) => {
                if (communityItem.id === id) {
                    return {
                        ...communityItem,
                        like_count: likedCommunities[id]
                            ? communityItem.like_count - 1
                            : communityItem.like_count + 1,
                    }
                }
                return communityItem;
            })
            setCommunityContent(updatedCommunities);
            setLikedCommunities((prev) => ({
                ...prev,
                [id]: !prev[id],
            }))
        } catch (error) {
            console.error('Failed to toggle like:', error)
        }
    }

    if (loading) {
        return <Loading loading={loading} />
    }

    if (error) {
        return <Alert type="danger" showIcon={true} title={error} />
    }

    return (
        <>
            <div>
                <div className="relative h-[300px] md:h-[400px] bg-[#1A1D29] overflow-hidden rounded-lg">
                    <div className="absolute inset-0">
                        <img
                            src={
                                'https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/un_title.png'
                            }
                            alt={community?.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div className="rounded-lg shadow -mt-72 md:max-w-5xl mx-auto dark:bg-gray-900 bg-white relative">
                    <div className="relative p-3 flex justify-between">
                        <div>
                            <h3 className="dark:text-primary text-primary w-full">
                                {community?.title}
                            </h3>
                            <div className="flex items-center">
                                <BsPeople className="dark:text-primary text-primary" />
                                <span className="dark:text-primary text-primary ml-2">
                                    {community?.total_user_joined} Members
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {/* <div>
                                {community?.user_mapping_id && (
                                    <div
                                        className="bg-primary dark:text-ac-dark text-white px-3 flex items-center gap-2 p-2 rounded-md cursor-pointer"
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        <FaPlus />
                                        <button>Create Post</button>
                                    </div>
                                )}
                            </div> */}
                            {community?.user_mapping_id && (
                                // joinend community
                                <div>
                                    <div className="bg-gray-700 dark:bg-gray-100 text-ac-dark px-3 flex items-center gap-2 p-2 rounded-md cursor-pointer">
                                        <button>Joined</button>
                                    </div>
                                </div>
                            )}
                            {community?.user_mapping_id == null && (
                                <div>
                                    <div
                                        className="bg-primary dark:text-ac-dark text-white px-3 flex items-center gap-2 p-2 rounded-md cursor-pointer"
                                        onClick={handleCommunityJoin}
                                    >
                                        <button>Join Community</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {isDialogOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="dark:bg-gray-700 rounded-lg p-6 w-full max-w-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold dark:text-gray-100">
                                        Create New Post
                                    </h2>
                                    <button
                                        onClick={() => setIsDialogOpen(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Post Title
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Post Title"
                                            value={newPost.name}
                                            onChange={handleInputChanged}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Post Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Post Description"
                                            value={newPost.description}
                                            onChange={handleInputChanged}
                                            required
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="image"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Image URL
                                        </label>
                                        <input
                                            id="image"
                                            name="image"
                                            type="url"
                                            placeholder="Image URL"
                                            value={newPost.image}
                                            onChange={handleInputChanged}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="postType"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Post Type
                                        </label>
                                        <select
                                            id="postType"
                                            name="postType"
                                            value={newPost.postType}
                                            onChange={handleInputChanged}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">
                                                Select post type
                                            </option>
                                            <option value="article">
                                                Article
                                            </option>
                                            <option value="question">
                                                Question
                                            </option>
                                            <option value="discussion">
                                                Discussion
                                            </option>
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

                    <div className="p-3">
                        <p className="text-lg text-justify">
                            {community?.description}
                        </p>
                    </div>
                </div>
                {/* communitie content */}
                <div className="relative md:max-w-5xl mx-auto">
                    {Array.isArray(communityContent) &&
                        communityContent.map((communityItem: Post) => (
                            <div
                                key={`communitylist-${communityItem.id}`}
                                className="dark:bg-gray-900 bg-white mt-5 transition-transform rounded-lg shadow cursor-pointer p-4"
                            >
                                <div
                                    onClick={() =>
                                        handleCommunityContent(communityItem)
                                    }
                                >
                                    <div className="flex justify-start items-center gap-2 mb-3">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${communityItem?.created_by_name}&background=random&color=fff`}
                                            alt={
                                                communityItem.organization_name
                                            }
                                            className="w-10 h-10 rounded-full"
                                        />
                      
                                        <div>
                                            <h3 className="font-bold capitalize text-sm dark:text-white">
                                                {communityItem?.created_by_name}
                                            </h3>
                                            <p className="text-xs opacity-55 dark:text-gray-200">
                                                {formatDistanceToNow(
                                                    new Date(
                                                        communityItem?.created_at *
                                                            1000,
                                                    ),
                                                    { addSuffix: true },
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="inset-0 w-full h-full">
                                        <img
                                            src={communityItem.thumbnail_url}
                                            alt={communityItem.title}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                        <div className="">
                                            <h2 className="font-bold text-xl dark:text-white">
                                                {communityItem.title}
                                            </h2>
                                            <p
                                                className="text-sm dark:text-gray-200 line-clamp-[8]"
                                                dangerouslySetInnerHTML={{
                                                    __html: communityItem.description,
                                                }}
                                            />
                                            <div className="mt-3">
                                                <a
                                                    className="text-primary"
                                                    onClick={() =>
                                                        handleCommunityContent(
                                                            communityItem,
                                                        )
                                                    }
                                                >
                                                    Read More ...
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-3 z-30">
                                    <div className="flex gap-4">
                                        <div className="flex gap-1 items-center">
                                            {/* Like Button */}
                                            <button
                                                onClick={() =>
                                                    toggleLike(communityItem.id)
                                                }
                                                className="flex items-center space-x-1 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            >
                                                {likedCommunities[
                                                    communityItem.id
                                                ] ? (
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
                                                    <BsHeart className="h-4 w-4 dark:text-gray-300" />
                                                )}
                                                <span className="text-xs dark:text-gray-300">
                                                    {formatNumber(
                                                        communityItem.like_count,
                                                    )}
                                                </span>
                                            </button>

                                            <button onClick={() => handleCommunityContent(communityItem)} className="flex items-center space-x-1 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                <BsChat className="h-4 w-4 dark:text-gray-300" />
                                                <span className="text-xs dark:text-gray-300">
                                                    {formatNumber(
                                                        communityItem.comment_count,
                                                    )}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                {communityContent.length === 0 && (
                    <div className="flex items-center ">
                        {/* no post avilable add first post */}
                        <div>
                            <p className="text-gray-400">
                                No content found, You can add first content to
                                click on create content button
                            </p>
                        </div>
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">
                                Create Content
                            </h2>
                            <div>
                                <label className="block mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />

                                <label className="block mt-4 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />

                                <label className="block mt-4 mb-2">
                                    Post Type{' '}
                                </label>
                                <input
                                    type="text"
                                    name="post_type"
                                    placeholder="post type"
                                    value={formData.post_type}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />

                                <label className="block mt-4 mb-2">
                                    Thumbnail
                                </label>
                                <input
                                    type="file"
                                    name="thumbnail"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border rounded"
                                />

                                <label className="block mt-4 mb-2">
                                    File (Image/Video)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            file: e.target.files
                                                ? e.target.files[0]
                                                : null,
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                    onClick={toggleModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-primary text-white px-4 py-2 rounded"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* bottom and top center and right 0 */}
            <div className="fixed right-0 bottom-[20%]">
                <Link
                    to="/communities"
                    className="bg-primary text-white p-3 rounded-l-full py-5 flex flex-col items-center gap-2 cursor-pointer"
                >
                    {/* Explore More */}
                    <h6 className="text-white">E</h6>
                    <h6 className="text-white">x</h6>
                    <h6 className="text-white">p</h6>
                    <h6 className="text-white">l</h6>
                    <h6 className="text-white">o</h6>
                    <h6 className="text-white">r</h6>
                    <h6 className="text-white">e</h6>
                    <br />
                    <h6 className="text-white">M</h6>
                    <h6 className="text-white">o</h6>
                    <h6 className="text-white">r</h6>
                    <h6 className="text-white">e</h6>
                </Link>
            </div>
        </>
    )
}

export default CommunityDetails



// import React, { useEffect, useState, useCallback } from 'react'
// import { fetchCommunityById, fetchCommunity } from '@services/public/CommunityService'
// import { fetchCommunityJoin } from '@services/learner/CommunityJoinService'
// import { useParams, useNavigate, Link } from 'react-router-dom'
// import Loading from '@/components/shared/Loading'
// import { Alert } from '@/components/ui'
// import { BsPeople } from 'react-icons/bs'
// import { FaPlus } from 'react-icons/fa'
// import { fetchCreateContent } from '@services/learner/CreateContentService'
// import { useCreateContentStore } from '@app/store/learner/createContentStore'

// const CommunityDetails: React.FC = () => {
//     const { id } = useParams<{ id: string }>()
//     const navigate = useNavigate()
//     const [loading, setLoading] = useState<boolean>(false)
//     const [error, setError] = useState<string | null>(null)
//     const [community, setCommunity] = useState<any>(null)
//     const [communities, setCommunities] = useState<any[]>([])
//     const [communityJoinLoading, setCommunityJoinLoading] = useState<boolean>(false)
//     const [showModal, setShowModal] = useState<boolean>(false)
//     const { createContent, setCreateContent } = useCreateContentStore();


//     const [formData, setFormData] = useState({
//         category_id: id,
//         title: '',
//         description: '',
//         content_type: 'carvaan',
//         post_type: '',
//         status: 1,
//         aspect_ratio: '',
//         dimension: { height: 0, width: 0 },
//         thumbnail: null,
//         file: null
//     })

//     const fetchAllCommunities = useCallback(async () => {
//         try {
//             setLoading(true)
//             const response = await fetchCommunity()
//             const filteredCommunities = response.filter(
//                 (c: any) => c.total_user_joined === 1,
//             )
//             setCommunities(filteredCommunities)
//         } catch (err: any) {
//             setError(err.message || 'Failed to load communities.')
//         } finally {
//             setLoading(false)
//         }
//     }, [])


//     const getCreateContent = useCallback(async () => {
//         if (!formData) {
//             setError('Community not found.')
//             return
//         }

//         try {
//             setLoading(true)
//             const data = await fetchCreateContent(formData)
//             setCommunity(data)
//         } catch (err: any) {
//             setError(err.message || 'Failed to load community details.')
//         } finally {
//             setLoading(false)
//         }
//     }, [formData])



//     const fetchCommunityDetails = useCallback(async () => {
//         if (!id) {
//             setError('Community not found.')
//             return
//         }
//         try {
//             setLoading(true)
//             const data = await fetchCommunityById(id)
//             setCommunity(data)
//         } catch (err: any) {
//             setError(err.message || 'Failed to load community details.')
//         } finally {
//             setLoading(false)
//         }
//     }, [id])

//     const handleCommunityJoin = async () => {
//         const categoryIds = communities.map((c) => c.id.toString())
//         const mergedCategoryIds = id ? [id, ...categoryIds] : categoryIds
//         try {
//             setCommunityJoinLoading(true)
//             await fetchCommunityJoin(mergedCategoryIds.join(','))
//             setCommunity((prev: any) => {
//                 return {
//                     ...prev,
//                     category: {
//                         ...prev.category,
//                         user_mapping_id: 1,
//                     },
//                 }
//             })

//         } catch (err: any) {
//             setError(err.message || 'Failed to join community.')
//         } finally {
//             setCommunityJoinLoading(false)
//         }
//     }

//     const handleCommunityContent = (communityItem: any) => {
//         navigate(`/communities/content/${communityItem.id}`, {
//             state: { content: communityItem },
//         })
//     }

//     useEffect(() => {
//         fetchAllCommunities()
//         fetchCommunityDetails()
//     }, [fetchAllCommunities, fetchCommunityDetails])

//     if (loading || communityJoinLoading) {
//         return <Loading loading={loading || communityJoinLoading} />
//     }

//     if (error) {
//         return <Alert type="danger" showIcon={true} title={error} />
//     }

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target
//         setFormData({ ...formData, [name]: value })
//     }

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setFormData({ ...formData, file: e.target.files[0] })
//         }
//     }

//     const toggleModal = () => {
//         setShowModal(!showModal)
//     }

//     const handleSubmit = async () => {
//         console.log('Form Data:', formData)
//         toggleModal()
//         getCreateContent();
//     }


//     return (
//         <div>
//             <div
//                 className="rounded-lg relative"
//                 style={{
//                     backgroundImage: `url('${community?.category?.image || ''}')`,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                     height: '200px',
//                 }}
//             >
//                 <div className="bg-black bg-opacity-60 w-full h-full rounded-lg absolute"></div>
//                 <div className="relative p-3 flex justify-between">
//                     <div className="md:py-4">
//                         <h1 className="text-white w-full">
//                             {community?.category?.title}
//                         </h1>
//                         <div className="flex items-center">
//                             <BsPeople className="text-white" />
//                             <span className="text-white ml-2">
//                                 {community?.category?.total_user_joined} Members
//                             </span>
//                         </div>
//                     </div>
//                     <div className='flex gap-3'>
//                         <div className='block'>
//                             {community?.category?.user_mapping_id == null && (
//                                 <button
//                                     className="bg-primary text-ac-dark px-4 py-2 rounded-lg"
//                                     onClick={handleCommunityJoin}
//                                 >
//                                     Join
//                                 </button>
//                             )}

//                             {
//                                 community?.category?.user_mapping_id && (
//                                     <button
//                                         className="bg-gray-200 text-ac-dark px-4 py-2 rounded-lg"
//                                     >
//                                         Joined
//                                     </button>
//                                 )
//                             }
//                         </div>
//                         <div>
//                             <div className="bg-primary flex items-center gap-2 p-2 rounded-md text-white cursor-pointer" onClick={toggleModal}>
//                                 <FaPlus className='dark:text-ac-dark' />
//                                 <button className='dark:text-ac-dark'>Create Content</button>
//                             </div>

//                             {showModal && (
//                                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//                                     <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-lg w-96">
//                                         <h2 className="text-xl font-bold mb-4">Create Content</h2>
//                                         <div>
//                                             <label className="block mb-2">Title</label>
//                                             <input type="text" name="title" placeholder='title' value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded" />

//                                             <label className="block mt-4 mb-2">Description</label>
//                                             <textarea name="description" placeholder='description' value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded" />



//                                             <label className="block mt-4 mb-2">Post Type </label>
//                                             <input type="text" name="post_type" placeholder='post type' value={formData.post_type} onChange={handleInputChange} className="w-full p-2 border rounded" />



//                                             <label className="block mt-4 mb-2">Thumbnail</label>
//                                             <input type="file" name="thumbnail" onChange={handleFileChange} className="w-full p-2 border rounded" />

//                                             <label className="block mt-4 mb-2">File (Image/Video)</label>
//                                             <input type="file" accept="image/*,video/*" onChange={(e) => setFormData({ ...formData, file: e.target.files ? e.target.files[0] : null })} className="w-full p-2 border rounded" />

//                                         </div>


//                                         <div className="flex justify-end mt-4">
//                                             <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={toggleModal}>
//                                                 Cancel
//                                             </button>
//                                             <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleSubmit}>
//                                                 Submit
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//             </div>


//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-10">
//                 {Array.isArray(community?.list) &&
//                     community?.list.map((communityItem: any) => (
//                         <div
//                             key={`communitylist-${communityItem.id}`}
//                             onClick={() =>
//                                 handleCommunityContent(communityItem)
//                             }
//                             className="dark:bg-gray-900 bg-white transition-transform hover:scale-95 rounded-lg shadow-lg cursor-pointer px-5 py-2"
//                         >
//                             <img
//                                 src={communityItem.thumbnail_url}
//                                 alt={communityItem.title}
//                                 className="w-full max-h-52 object-cover rounded-t-lg"
//                             />
//                             <div className="py-4">
//                                 <h2 className="font-bold text-xl dark:text-white">
//                                     {communityItem.title}
//                                 </h2>
//                                 <p
//                                     className="line-clamp-4 text-sm dark:text-gray-200"
//                                     dangerouslySetInnerHTML={{
//                                         __html: communityItem.description,
//                                     }}
//                                 />
//                             </div>
//                         </div>
//                     ))}
//             </div>
//         </div>
//     )
// }

// export default CommunityDetails
