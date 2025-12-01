import React, { useEffect, useCallback } from 'react';
import { fetchCommunity } from '@services/public/CommunityService';
import { useCommunityStore } from '@app/store/public/communityStore';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';

const SelfCommunity: React.FC = () => {
    const { communities, setCommunities, error, setError, loading, setLoading } = useCommunityStore();
    const navigate = useNavigate();

    const loadCommunities = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetchCommunity();
            setCommunities(response);
        } catch (err) {
            console.error('Error fetching communities:', err);
            setError('Failed to load communities. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [setCommunities, setError, setLoading]);

    useEffect(() => {
        loadCommunities();
    }, [loadCommunities]);

    const handleAttemptButton = (communityId: number) => {
        navigate(`/self-assessmentList/${communityId}`, { state: { category_id: communityId } });
    };

    if (loading && communities.length === 0) {
        return <Loading loading={loading} />;
    }

    if (error) {
        return <Alert title={`Error: ${error}`} type="danger" />;
    }

    return (
        <div>
            <div className="community__content">
                <div className="community__content__title">
                    <h3 className="text-3xl font-bold text-primary dark:text-primary">
                        Participate in Our Assessment
                    </h3>
                    <p>
                        Join the assessment within our community and unlock valuable insights, personalized feedback, and more opportunities to grow.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
                {communities.map((community) => (
                    <div
                        className="rounded overflow-hidden shadow-lg w-full hover:transform hover:scale-105 transition duration-300"
                        key={community.id}
                    >
                        <img
                            className="w-full h-48 object-cover"
                            src={community.image}
                            alt={community.title}
                        />
                        <div className="px-3 py-4 dark:bg-gray-900">
                            <div className="font-bold text-xl dark:text-white">{community.title}</div>
                            <p className="text-gray-400">{community.description}</p>
                            <div className="flex justify-center pt-3 w-full">
                                <button
                                    className="w-full bg-primary text-ac-dark px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
                                    onClick={() => handleAttemptButton(community?.id)}
                                >
                                    Start Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SelfCommunity;
