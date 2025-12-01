import React from 'react'
import Banner from '@/assets/images/ellipse.png'
import { Link } from 'react-router-dom'
import { fetchCommunity } from '@services/public/CommunityService'
import { useCommunityStore } from '@app/store/public/communityStore'
import people from '@/assets/images/people.png'
import ai from '@/assets/images/ai.svg'
import { BiChat } from 'react-icons/bi'
import MetaTags from '@/utils/MetaTags'

const Community: React.FC = () => {
    const {
        communities,
        setCommunities,
        error,
        setError,
        loading,
        setLoading,
    } = useCommunityStore()
    React.useEffect(() => {
        setLoading(true)
        fetchCommunity()
            .then((response) => {
                setCommunities(response)
            })
            .catch((error) => {
                setError(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <div className="px-8">
            <MetaTags
                title="Acado Community - Connect & Learn"
                description="Join the Acado community and grow together."
                image="https://elms.edulystventures.com/joy_category/mba_xamk.jpg" // Replace with actual image URL
            />
            {/* this community page comming soon section */}
            <div className="community__content mt-10">
                <div className="community__content__title">
                    <h1>Join our community</h1>
                    <p>
                        Join our community and get access to exclusive content,
                        resources, and more.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10">
                {communities.map((community) => {
                    return (
                        <div
                            className="md:col-span-1 dark:bg-gray-900 bg-white transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105
                                rounded-lg"
                        >
                            <Link to={`/communities/${community.id}`}>
                                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                                    <div className="relative w-full h-64 overflow-hidden rounded-t-md">
                                        <img
                                            src={community.image}
                                            alt="Community"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="px-3 py-4">
                                        <div className="font-bold text-xl dark:text-white">
                                            {community.title}
                                        </div>
                                        <p className="text-gray-400 line-clamp-1">
                                            {community.short_description}
                                        </p>
                                    </div>
                                    <div className="px-6 pt-4 pb-2 border-t">
                                        <ul>
                                            {/* <li className="flex mb-2 items-center gap-3 md:gap-2">
                                                <BiChat className="text-[20px] dark:text-primary" />
                                                <span className="text-[10px]">
                                                    {community.total_content}{' '}
                                                    Discussions
                                                </span>
                                            </li> */}
                                            <li className="flex mb-2 justify-between items-center gap-3 md:gap-2">
                                                {community.total_user_joined !==
                                                    0 && (
                                                    <div className="flex gap-24 w-full">
                                                        <span className="w-full">
                                                            Total Members
                                                        </span>
                                                        <span className="text-primary">
                                                            +
                                                            {
                                                                community.total_user_joined
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Community
