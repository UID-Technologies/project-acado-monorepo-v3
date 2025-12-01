import React, { lazy, useEffect, useMemo, useState } from 'react';
import Loading from '@/components/shared/Loading';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/ShadcnButton';
import { Plus, Scroll } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePosts } from './@hooks/usePost';
import CommunityLayout from './layouts';
import WeeklyCalendar from './components/Calendar';

const PostCardView = lazy(() => import('./components/CardView'));

const Wall = () => {


    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<'all' | 'my'>('all');

    const params = useMemo(() => {
        const p = new URLSearchParams();
        if (filter === 'my') {
            p.append('my_post', '1');
        }
        return p;
    }, [filter]);

    const { data: posts = [], isLoading, isError, error } = usePosts(params);

    const myPosts = () => {
        if (filter === 'my') {
            setFilter('all');
        } else {
            setFilter('my');
        }
    };

    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ['posts', params],
        });
    }, [filter]);


    if (isLoading && !posts?.length) {
        return <Loading loading={isLoading} />;
    }

    if (isError && !posts?.length) {
        return <div className="text-red-500 text-center">Error: {error.message}</div>;
    }


    return (
        <CommunityLayout active='mywall'>
            <div className="grid grid-cols-1 lg:grid-cols-[70%_28%] gap-6 mt-4">
                <div>
                    <div className="flex items-center justify-end gap-2">
                        <div className="flex justify-end cursor-pointer mb-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={myPosts}
                            >
                                <Scroll size={18} strokeWidth={2} />
                                My Post
                            </Button>
                        </div>
                        <div className="flex justify-end cursor-pointer mb-2">
                            <Link to="/community/myposts/createpost">
                                <Button size="sm" className='dark:text-black text-white'>
                                    <Plus size={18} strokeWidth={2} />
                                    Create Post
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        {posts && posts.map((post, index) => (<PostCardView key={index} post={post} is_repost={post.repost_id == null ? false : true} />))}
                    </div>
                </div>
                <div>
                    <WeeklyCalendar />
                    {/* <OpinionPoll /> */}
                    {/* <Pinned /> */}
                </div>
            </div>
        </CommunityLayout>
    )
}


export default Wall