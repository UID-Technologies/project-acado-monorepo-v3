import React, { useState } from 'react';
import { Button } from "@/components/ui/ShadcnButton";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { useOrgPopularCommunityStore } from '../../store/communityStore';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import Swal from 'sweetalert2';
import { joinCommunity } from '../../services/CommunityService';
import Loading from '@/components/shared/Loading';
import { Link } from 'react-router-dom';
import { usePosts } from '../../@hooks/usePost';
import { useIndustries } from '../../@hooks/useIndustry';
import CommunityLayout from '../../layouts';
import WeeklyCalendar from '../../components/Calendar';
import PostCardView from '../../components/CardView';


const Discover: React.FC = () => {


    const [filterCategories,] = React.useState<string[]>([]);
    const { popularCommunities, fetchPopularCommunities, loading } = useOrgPopularCommunityStore();
    const [filter, setFilter] = useState<'all' | 'posts' | 'people' | 'communities' | 'institutes' | 'industries'>('communities');

    const { data, isLoading, error } = useIndustries();
    const { data: posts = [], isError } = usePosts();

    const industries = data?.filter(item => item.type === "industry") ?? [];
    const institutes = data?.filter(item => item.type === "university") ?? [];

    React.useEffect(() => {
        fetchPopularCommunities();
    }, [fetchPopularCommunities]);

    // get communities from org.communites in one variable
    const communities = popularCommunities?.filter((org) => org.communities).flatMap((org) => org.communities) || [];
    // filter communities based on selected categories
    // const categories = Array.from(new Set(communities.map(community => community.domain_name))).sort() || [];
    const filteredCommunities = communities.filter(community => filterCategories.length === 0 || filterCategories?.includes(community?.domain_name ?? ''));


    const joinThisCommunity = (communityId: number) => {
        // Logic to join the community
        Swal.fire({
            title: 'Join Community',
            text: `Are you sure you want to join this community?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Join',
            cancelButtonText: 'No, Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                // Call the API to join the community
                joinCommunity(communityId).then(() => {
                    console.log(`Joined community with ID: ${communityId}`);
                    Swal.fire({
                        title: 'Success',
                        text: 'You have successfully joined the community!',
                        icon: 'success',
                    });
                    fetchPopularCommunities(); // Refresh the communities list after joining
                }).catch((error) => {
                    console.error(`Failed to join community with ID: ${communityId}`, error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to join the community. Please try again later.',
                    });
                }
                );
            }
        });
    };

    if (loading && !popularCommunities) {
        return <Loading loading={loading} />
    }


    if (isLoading && !posts?.length) {
        return <Loading loading={isLoading} />;
    }

    if (isError && !posts?.length) {
        return <div className="text-red-500 text-center">Error: {error?.message}</div>;
    }


    return (
        <CommunityLayout active='discover'>
            <div className="flex flex-col space-y-6 mt-4">
                {/* Main Content */}
                <div className="w-full flex flex-col md:flex-row gap-5 pr-5">
                    {/* Left Column - Communities List */}
                    <div className="w-full md:w-[70%]">
                        <div className='border-x-0 border-t-0 border-b-[1px] rounded-none py-3 px-0'>
                            {/* Header Section */}
                            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    <span className="text-cpink">TrendSurf...</span>
                                </h1>
                            </div>
                            {/* Categories */}
                            <ScrollArea className="w-full whitespace-nowrap pb-2 mb-4">
                                <div className="flex space-x-2 mt-2 px-2">
                                    <div className="flex justify-end cursor-pointer mb-2">
                                        <Button variant={filter === 'posts' ? 'default' : 'outline'} className={filter === 'posts' ? 'dark:text-black text-white' : ''} onClick={() => setFilter('posts')}>Post</Button>
                                    </div>
                                    <div className="flex justify-end cursor-pointer mb-2">
                                        <Button variant={filter === 'communities' ? 'default' : 'outline'} className={filter === 'communities' ? 'dark:text-black text-white' : ''} onClick={() => setFilter('communities')}>Communities</Button>
                                    </div>
                                    <div className="flex justify-end cursor-pointer mb-2">
                                        <Button variant={filter === 'institutes' ? 'default' : 'outline'} className={filter === 'institutes' ? 'dark:text-black text-white' : ''} onClick={() => setFilter('institutes')}>Institute</Button>
                                    </div>
                                    <div className="flex justify-end cursor-pointer mb-2">
                                        <Button variant={filter === 'industries' ? 'default' : 'outline'} className={filter === 'industries' ? 'dark:text-black text-white' : ''} onClick={() => setFilter('industries')}>Industry</Button>
                                    </div>
                                </div>
                            </ScrollArea>
                            {filter === 'institutes' && (
                                <>
                                    {institutes?.map((institute) => (
                                        <Link key={institute.id} to={`/universities-show/${institute?.id}`}>
                                            <Card key={institute.id} className="flex flex-col sm:flex-row gap-4 overflow-hidden border-none shadow-none mb-6 dark:bg-gray-900 bg-gray-100">
                                                <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
                                                    <img
                                                        src={institute?.logo}
                                                        alt={institute?.name}
                                                        className="w-full h-full object-cover object-top border rounded-md"
                                                        onError={(e) => {
                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${institute?.name}&background=random&size=400`;
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                        <div className='flex flex-col gap-0'>
                                                            <h3 className="font-bold text-lg mb-0 pb-0 text-cblack">{institute?.name}</h3>

                                                            <p className="text-cblack text-sm mt-0 pt-0 font-medium">{institute?.country_name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 my-2">
                                                        {/* <span className="text-sm text-cblack ml-1"><span className="font-semibold">{industry.total_user_joined}</span> {industry.total_user_joined <= 1 ? 'Member' : 'Members'}</span> */}
                                                    </div>
                                                    <p className="text-cblack text-sm line-clamp-2 font-normal w-1/2">{institute.org_description}</p>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </>
                            )}
                            {filter === 'industries' && (
                                <>
                                    {industries?.map((industry) => (
                                        <Link key={industry.id} to={`/universities-show/${industry?.id}`} >
                                            <Card key={industry.id} className="flex flex-col sm:flex-row gap-4 overflow-hidden border-none shadow-none mb-6">
                                                <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
                                                    <img
                                                        src={industry?.logo}
                                                        alt={industry?.name}
                                                        className="w-full h-full object-cover object-top border rounded-md"
                                                        onError={(e) => {
                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${industry?.name}&background=random&size=400`;
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                        <div className='flex flex-col gap-0'>
                                                            <h3 className="font-bold text-lg mb-0 pb-0 text-cblack">{industry?.name}</h3>

                                                            <p className="text-cblack text-sm mt-0 pt-0 font-medium">{industry?.country_name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 my-2">
                                                        {/* <span className="text-sm text-cblack ml-1"><span className="font-semibold">{industry.total_user_joined}</span> {industry.total_user_joined <= 1 ? 'Member' : 'Members'}</span> */}
                                                    </div>
                                                    <p className="text-cblack text-sm line-clamp-2 font-normal w-1/2">{industry.org_description}</p>
                                                </div>

                                            </Card>
                                        </Link>
                                    ))}
                                    {
                                        industries?.length === 0 && (
                                            <div className="text-center text-cblack mt-4 py-16">
                                                No Industries found.
                                            </div>
                                        )
                                    }
                                </>
                            )}
                            {filter === 'posts' && (
                                <div className="flex flex-col gap-3 mb-6">
                                    {posts.length > 0 ? (

                                        posts.map((post, index) => (

                                            <PostCardView key={index} post={post} is_repost={post.repost_id == null ? false : true} />
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500">No posts found.</div>
                                    )}
                                </div>
                            )}
                            {filter === 'communities' && (
                                <>
                                    {(() => {
                                        const unjoinedCommunities = filteredCommunities?.filter(
                                            (community) => !community?.user_joined_id
                                        ) || [];

                                        return (
                                            <>
                                                {unjoinedCommunities.length > 0 ? (
                                                    unjoinedCommunities.map((community) => (
                                                        <Link to={`/community/details/${community.id}`} key={community.id}>
                                                            <Card className="flex flex-col sm:flex-row gap-4 overflow-hidden border-none shadow-none mb-6 dark:bg-gray-900 bg-gray-100">
                                                                <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
                                                                    <img
                                                                        src={community?.image}
                                                                        alt={community?.title}
                                                                        className="w-full h-full object-cover object-top border rounded-md"
                                                                        onError={(e) => {
                                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${community?.title}&background=random&size=400`;
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex-1 flex flex-col p-3">
                                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                                        <div className="flex flex-col gap-0">
                                                                            <h3 className="font-bold text-lg text-cblack">{community?.title}</h3>
                                                                            <p className="text-cblack text-sm font-medium">{community?.domain_name}</p>
                                                                        </div>
                                                                        <Button type="button" size="sm" variant="link" onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            joinThisCommunity(community.id);
                                                                        }}>Join Now</Button>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 my-2">
                                                                        <span className="text-sm text-cblack ml-1">
                                                                            <span className="font-semibold">{community.total_user_joined}</span>{" "}
                                                                            {community.total_user_joined <= 1 ? "Member" : "Members"}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-cblack text-sm line-clamp-2 font-normal w-1/2">
                                                                        {stripHtmlTags(community.description)}
                                                                    </p>
                                                                </div>
                                                            </Card>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <div className="text-center text-cblack mt-4 py-16">
                                                        Great job
                                                        You`ve joined all available communities. Stay tuned for new ones
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </>
                            )}

                        </div>
                    </div>

                    <div className="w-full md:w-[30%]">
                        <div className='space-y-5'>
                            <WeeklyCalendar />
                        </div>
                    </div>
                </div>
            </div>
        </CommunityLayout>
    );
};

export default Discover;