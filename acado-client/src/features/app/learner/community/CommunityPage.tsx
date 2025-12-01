import React from 'react'
import { Link } from 'react-router-dom';
import { fetchCommunity } from '@services/public/CommunityService';
import { useCommunityStore } from '@app/store/public/communityStore';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';

const Community: React.FC = () => {
    const { communities, setCommunities, error, setError, loading, setLoading } = useCommunityStore();
    React.useEffect(() => {
        setLoading(true);
        setError('');
        fetchCommunity().then((response) => {
            setCommunities(response);
        }).catch((error) => {
            setError(error);
        }).finally(() => {
            setLoading(false);
        });
    }, [setCommunities, setError, setLoading]);


    if (loading) {
        return <Loading loading={loading} />
    }

    if (error) {
        return <Alert type="danger" title={error} />
    }


    return (
        <div>
            <div className="community__content">
                <div className="community__content__title">
                    <h1>Join our community</h1>
                    <p>Join our community and get access to exclusive content, resources, and more.</p>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-5 mt-10'>
                {
                    communities?.map((community) => {
                        return (
                            <Link key={`community-${community?.id}`} to={`/communities/${community?.id}`} className='md:col-span-1 dark:bg-gray-900 shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105
                                rounded-lg'>
                                <div className="rounded overflow-hidden">
                                <div className="relative w-full h-64 overflow-hidden rounded-t-md">
                                        <img
                                            src={community.image}
                                            alt="Community"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="px-3 py-4">
                                        <div className="font-bold text-xl">
                                            {community?.title}
                                        </div>
                                        <p className="text-gray-400 line-clamp-1">
                                            {community?.short_description}
                                        </p>
                                    </div>
                                    <div className="px-6 pt-4 pb-2 border-t">
                                        <ul>
                                            {community?.total_user_joined !== 0 && (
                                                <li className="flex mb-2 justify-between items-center gap-3 md:gap-2">
                                                    <div className="flex gap-24 w-full">
                                                        <span className="w-full">Members</span>
                                                        <span className="">
                                                            {community?.total_user_joined}
                                                        </span>
                                                    </div>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                }
                {
                    communities?.length === 0 && (
                        <div className="text-center col-span-4 bg-white p-4 rounded-lg shadow-lg">
                            <p className="text-gray-400">No community found</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Community
