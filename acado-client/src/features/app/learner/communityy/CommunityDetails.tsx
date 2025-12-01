import React, { useEffect, useState, useCallback } from 'react'
import { fetchCommunityById, fetchCommunity } from '@services/public/CommunityService'
import { fetchCommunityJoin } from '@services/learner/CommunityJoinService'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Loading from '@/components/shared/Loading'
import { Alert } from '@/components/ui'
import { BsPeople } from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'
import { fetchCreateContent } from '@services/learner/CreateContentService'
import { useCreateContentStore } from '@app/store/learner/createContentStore'

const CommunityDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [community, setCommunity] = useState<any>(null)
    const [communities, setCommunities] = useState<any[]>([])
    const [communityJoinLoading, setCommunityJoinLoading] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const { createContent, setCreateContent } = useCreateContentStore();


    const [formData, setFormData] = useState({
        category_id: id,
        title: '',
        description: '',
        content_type: 'carvaan',
        post_type: '',
        status: 1,
        aspect_ratio: '',
        dimension: { height: 0, width: 0 },
        thumbnail: null,
        file: null
    })

    // Fetch Communities
    const fetchAllCommunities = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetchCommunity()
            const filteredCommunities = response.filter(
                (c: any) => c.total_user_joined === 1,
            )
            setCommunities(filteredCommunities)
        } catch (err: any) {
            setError(err.message || 'Failed to load communities.')
        } finally {
            setLoading(false)
        }
    }, [])


    const getCreateContent = useCallback(async () => {
        if (!formData) {
            setError('Community not found.')
            return
        }

        try {
            setLoading(true)
            const data = await fetchCreateContent(formData)
            setCommunity(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load community details.')
        } finally {
            setLoading(false)
        }
    }, [formData])




    // Fetch Community by ID
    const fetchCommunityDetails = useCallback(async () => {
        if (!id) {
            setError('Community not found.')
            return
        }
        try {
            setLoading(true)
            const data = await fetchCommunityById(id)
            setCommunity(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load community details.')
        } finally {
            setLoading(false)
        }
    }, [id])

    // Join Community
    const handleCommunityJoin = async () => {
        const categoryIds = communities.map((c) => c.id.toString())
        const mergedCategoryIds = id ? [id, ...categoryIds] : categoryIds
        try {
            setCommunityJoinLoading(true)
            await fetchCommunityJoin(mergedCategoryIds.join(','))

            // change the state of the community
            setCommunity((prev: any) => {
                return {
                    ...prev,
                    category: {
                        ...prev.category,
                        user_mapping_id: 1,
                    },
                }
            })

        } catch (err: any) {
            setError(err.message || 'Failed to join community.')
        } finally {
            setCommunityJoinLoading(false)
        }
    }

    // Navigate to Community Content
    const handleCommunityContent = (communityItem: any) => {
        navigate(`/communities/content/${communityItem.id}`, {
            state: { content: communityItem },
        })
    }

    // Fetch Data on Mount
    useEffect(() => {
        fetchAllCommunities()
        fetchCommunityDetails()
    }, [fetchAllCommunities, fetchCommunityDetails])

    if (loading || communityJoinLoading) {
        return <Loading loading={loading || communityJoinLoading} />
    }

    if (error) {
        return <Alert type="danger" showIcon={true} title={error} />
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    // Handle File Change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] })
        }
    }

    // Handle Modal Toggle
    const toggleModal = () => {
        setShowModal(!showModal)
    }

    // Handle Form Submission
    const handleSubmit = async () => {
        console.log('Form Data:', formData)
        toggleModal()
        getCreateContent();
    }


    return (
        <div>
            {/* Community Banner */}
            <div
                className="rounded-lg relative"
                style={{
                    backgroundImage: `url('${community?.category?.image || ''}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '200px',
                }}
            >
                <div className="bg-black bg-opacity-60 w-full h-full rounded-lg absolute"></div>
                <div className="relative p-3 flex justify-between">
                    <div className="md:py-4">
                        <h1 className="text-white w-full">
                            {community?.category?.title}
                        </h1>
                        <div className="flex items-center">
                            <BsPeople className="text-white" />
                            <span className="text-white ml-2">
                                {community?.category?.total_user_joined} Members
                            </span>
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <div className='block'>
                            {community?.category?.user_mapping_id == null && (
                                <button
                                    className="bg-primary text-ac-dark px-4 py-2 rounded-lg"
                                    onClick={handleCommunityJoin}
                                >
                                    Join
                                </button>
                            )}

                            {
                                community?.category?.user_mapping_id && (
                                    <button
                                        className="bg-gray-200 text-ac-dark px-4 py-2 rounded-lg"
                                    >
                                        Joined
                                    </button>
                                )
                            }
                        </div>
                        <div>
                            {/* Create Content Button */}
                            <div className="bg-primary flex items-center gap-2 p-2 rounded-md text-white cursor-pointer" onClick={toggleModal}>
                                <FaPlus className='dark:text-ac-dark' />
                                <button className='dark:text-ac-dark'>Create Content</button>
                            </div>

                            {/* Modal */}
                            {showModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                    <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-lg w-96">
                                        <h2 className="text-xl font-bold mb-4">Create Content</h2>
                                        <div>
                                            <label className="block mb-2">Title</label>
                                            <input type="text" name="title" placeholder='title' value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded" />

                                            <label className="block mt-4 mb-2">Description</label>
                                            <textarea name="description" placeholder='description' value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded" />



                                            <label className="block mt-4 mb-2">Post Type </label>
                                            <input type="text" name="post_type" placeholder='post type' value={formData.post_type} onChange={handleInputChange} className="w-full p-2 border rounded" />



                                            <label className="block mt-4 mb-2">Thumbnail</label>
                                            <input type="file" name="thumbnail" onChange={handleFileChange} className="w-full p-2 border rounded" />

                                            <label className="block mt-4 mb-2">File (Image/Video)</label>
                                            <input type="file" accept="image/*,video/*" onChange={(e) => setFormData({ ...formData, file: e.target.files ? e.target.files[0] : null })} className="w-full p-2 border rounded" />

                                        </div>


                                        <div className="flex justify-end mt-4">
                                            <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={toggleModal}>
                                                Cancel
                                            </button>
                                            <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleSubmit}>
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>


            {/* Community List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-10">
                {Array.isArray(community?.list) &&
                    community?.list.map((communityItem: any) => (
                        <div
                            key={`communitylist-${communityItem.id}`}
                            onClick={() =>
                                handleCommunityContent(communityItem)
                            }
                            className="dark:bg-gray-900 bg-white transition-transform hover:scale-95 rounded-lg shadow-lg cursor-pointer px-5 py-2"
                        >
                            <img
                                src={communityItem.thumbnail_url}
                                alt={communityItem.title}
                                className="w-full max-h-52 object-cover rounded-t-lg"
                            />
                            <div className="py-4">
                                <h2 className="font-bold text-xl dark:text-white">
                                    {communityItem.title}
                                </h2>
                                <p
                                    className="line-clamp-4 text-sm dark:text-gray-200"
                                    dangerouslySetInnerHTML={{
                                        __html: communityItem.description,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default CommunityDetails
