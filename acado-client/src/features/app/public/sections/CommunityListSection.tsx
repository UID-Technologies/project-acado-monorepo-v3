import LoadingSection from '@/components/LoadingSection';
import { useCommunities } from '@app/hooks/data/useCommunity';
import React from 'react';
import { Link } from 'react-router-dom';

const Community: React.FC = () => {

    const { data: communities = [], isLoading, isError } = useCommunities();

    if (isError) {
        return null;
    }

    return (
        <div className="community mb-10 px-3">
            <LoadingSection isLoading={isLoading} title='Communities' />
            <div className='grid grid-cols-1 md:grid-cols-4 gap-5 px-7 md:px-0'>
                {
                    communities.map((community, index) => {
                        return (
                            <div key={index} className='md:col-span-1 dark:bg-gray-900 bg-white transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105
                                rounded-lg'>
                                <Link to={`/communities/${community.id}`}>
                                    <div className="rounded overflow-hidden shadow-lg">
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
                                            <p className="text-gray-400">
                                                {community.description}
                                            </p>
                                        </div>
                                        <div className="px-6 pt-4 pb-2 border-t">
                                            <ul>
                                                {/* <li className="flex mb-2 items-center gap-3 md:gap-2">
                                                    <BiChat className='text-[20px] dark:text-primary' />
                                                    <span className="text-[10px]">{community.total_content} Discussions</span>
                                                </li> */}
                                                <li className="flex mb-2 justify-between items-center gap-3 md:gap-2">
                                                    {community.total_user_joined !== 0 && (
                                                        <div className="flex gap-24 w-full">
                                                            <span className="w-full">Total Members</span>
                                                            <span className="text-primary">+
                                                                {community.total_user_joined}
                                                            </span>
                                                        </div>
                                                    )
                                                    }
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )

}

export default Community;
