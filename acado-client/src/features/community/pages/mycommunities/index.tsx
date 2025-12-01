import { EllipsisVertical, VolumeX } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/shadcn/dropdown-menu';
import { Link } from 'react-router-dom';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { useSessionUser } from '@app/store/authStore';
import { muteCommunity, leaveCommunity } from '../../services/CommunityService';
import Swal from 'sweetalert2';
import Loading from '@/components/shared/Loading';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/ShadcnButton';
import { CommunityCategory } from '../../@types/community';
import { useOrgPopularCommunityStore } from '../../store/communityStore';
import CommunityLayout from '../../layouts';
import WeeklyCalendar from '../../components/Calendar';
import Report from '../../components/report';

interface CommunitySection {
    title: string;
    communities: CommunityCategory[];
    isAdmin?: boolean;
    isYourCommunity?: boolean;
}


const MyCommunities = () => {
    const { popularCommunities, fetchPopularCommunities, loading } = useOrgPopularCommunityStore();
    const { id } = useSessionUser((state) => state.user);
    const [reportSelectedCommunity, setReportSelectedCommunity] = useState<CommunityCategory | null>(null);
    const [reportOpen, setReportOpen] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        fetchPopularCommunities(1);
    }, [fetchPopularCommunities]);

    // Prepare community sections
    const getCommunitySections = useCallback((): CommunitySection[] => {
        const addedCommunityIds = new Set<number>();

        const getUniqueCommunities = (communities: CommunityCategory[]) =>
            communities.filter((community) => {
                if (addedCommunityIds.has(community.id)) return false;
                addedCommunityIds.add(community.id);
                return true;
            });

        const adminCommunities = getUniqueCommunities(
            popularCommunities.flatMap((org) => org.communities.filter((community: CommunityCategory) => community.created_by_admin && community.user_joined_id)));


        const yourCommunities = getUniqueCommunities(
            popularCommunities.flatMap((org) => org.communities.filter((community: CommunityCategory) => community.user_joined_id && !community.created_by_admin)));

        const industryCommunities = getUniqueCommunities(
            popularCommunities.filter((org) => org.org_type === 'industry').flatMap((org) => org.communities));

        const otherOrgSections = popularCommunities
            .filter((org) => org.org_type !== 'industry' && org.org_name !== 'CodeEdu')
            .map((org) => ({
                title: org.org_name,
                communities: getUniqueCommunities(org.communities.filter((community: CommunityCategory) => community.created_by !== id))
            })).filter((section) => section.communities.length > 0);

        const otherCommunities = getUniqueCommunities(
            popularCommunities.flatMap((org) =>
                org.communities.filter((community: CommunityCategory) =>
                    community.created_by !== id &&
                    !community.created_by_admin &&
                    !community.user_joined_id)));

        return [
            { title: 'CODE Community', communities: adminCommunities, isAdmin: true },
            { title: 'Your Communities', communities: yourCommunities, isYourCommunity: true },
            ...otherOrgSections,
            { title: 'Industry & Experts Community', communities: industryCommunities },
            { title: 'Other Communities', communities: otherCommunities },
        ];
    }, [popularCommunities, id]);



    // Mutations
    const leaveMutation = useMutation({
        mutationFn: ({ communityId }: { communityId: number }) => leaveCommunity(communityId),
        onSuccess: (_, { communityId }) => {
            Swal.fire({
                title: 'Success',
                text: 'You have successfully left the community!',
                icon: 'success',
            });
            popularCommunities.forEach((org) => {
                org.communities = org.communities.filter((community: CommunityCategory) => community.id !== Number(communityId));
            });
            queryClient.setQueryData(['popularCommunities'], popularCommunities);

        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            Swal.fire({
                title: 'Error',
                text: error.message || 'Failed to leave the community. Please try again later.',
                icon: 'error',
            });
        },
    });

    const muteMutation = useMutation({
        mutationFn: ({ communityId }: { communityId: number; isMute: boolean }) => muteCommunity(communityId),
        onSuccess: (_, { isMute, communityId }) => {
            Swal.fire({
                title: 'Success',
                text: `You have successfully ${isMute ? 'muted' : 'unmuted'} the community!`,
                icon: 'success',
            });
            popularCommunities.forEach((org) => {
                org.communities.forEach((community: CommunityCategory) => {
                    if (community.id === Number(communityId)) {
                        community.is_mute = isMute;
                    }
                });
            });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            Swal.fire({
                title: 'Error',
                text: error.message || 'Failed to mute the community. Please try again later.',
                icon: 'error',
            });
        },
    });

    // Action Handlers
    const handleLeaveCommunity = (community: CommunityCategory) => {
        Swal.fire({
            title: 'Leave Community',
            text: 'Are you sure you want to leave this community?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Leave',
            cancelButtonText: 'No, Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                leaveMutation.mutate({ communityId: community.id });
            }
        });
    };

    const handleMuteCommunity = (community: CommunityCategory) => {
        const isMute = !community.is_mute;
        Swal.fire({
            title: `${isMute ? 'Mute' : 'Unmute'} Community`,
            text: `Are you sure you want to ${isMute ? 'mute' : 'unmute'} this community? You will ${isMute ? 'not receive notifications' : 'receive notifications again'
                }.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Yes, ${isMute ? 'Mute' : 'Unmute'}`,
            cancelButtonText: 'No, Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                muteMutation.mutate({ communityId: community.id, isMute });
            }
        });
    };

    // Reusable Community Card Component
    const CommunityCard = ({ community }: { community: CommunityCategory }) => (
        <div className="border p-3 rounded-lg mt-4 flex items-start gap-4 justify-between dark:bg-black">
            <Link to={`/community/mycommunities/${community.id}`} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div
                        className="rounded-lg items-center justify-center border col-span-1 md:min-w-14 hidden md:block"
                        style={{ backgroundImage: `url('${community.image ?? `https://ui-avatars.com/api/?name=${community.title}`}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                    <div className="space-y-1 col-span-4">
                        <h2 className="text-sm md:text-lg font-semibold text-nowrap text-[#273454] truncate">{community.title}</h2>
                        <p className="text-xs font-medium text-[#273454] text-nowrap line-clamp-1 truncate dark:text-gray-300">{stripHtmlTags(community.description)}</p>
                        <p className="text-xs font-medium text-[#273454]dark:text-gray-300 mb-1">
                            <span className="font-semibold">{community.total_user_joined}</span>{' '}
                            {community.total_user_joined <= 1 ? 'Member' : 'Members'}
                        </p>
                    </div>
                </div>
            </Link>
            <div className="flex items-center gap-2">
                {community.is_mute === 1 && <VolumeX size={20} strokeWidth={1.5} className='text-red-500 cursor-pointer' onClick={() => handleMuteCommunity(community)} />}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <EllipsisVertical className="h-4 w-4 text-cblack" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40" side="left" align="start">
                    <>
                        <DropdownMenuItem className='cursor-pointer' onClick={() => handleMuteCommunity(community)}>
                            {community.is_mute ? 'Unmute' : <span>Mute</span>}
                        </DropdownMenuItem>
                        <DropdownMenuItem className='cursor-pointer' onClick={() => handleLeaveCommunity(community)}><span className='hover:text-red-500'>Leave Community</span></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className='cursor-pointer'
                            onClick={() => {
                                setReportSelectedCommunity(community);
                                setReportOpen(true);
                            }}
                        >
                            <span className="text-[#FF0000]">Report</span>
                        </DropdownMenuItem>
                    </>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    if (loading) {
        return <Loading loading={loading} />;
    }

    return (
        <CommunityLayout active="mycommunities">
            <div className="grid grid-cols-1 lg:grid-cols-[70%_28%] gap-6 mt-4">
                <div>
                    <div>
                        {getCommunitySections().filter((section) => section.title === "CODE Community")
                            .map((section, index) => (
                                <div key={index} className="bg-card text-card-foreground p-4 shadow-none border-[0.5px] rounded-lg mb-6 dark:bg-gray-900 dark:border-gray-500">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h1 className="text-[22px]">
                                                <span className="text-[#273454] dark:text-white">Acado Community</span>
                                            </h1>
                                        </div>
                                    </div>

                                    {section.communities.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                                            {section.communities.map((community) => (
                                                <CommunityCard
                                                    key={community.id}
                                                    community={community}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                            <img
                                                src="/img/others/comm-img.png"
                                                alt="Empty state"
                                                className="w-60 h-60 mb-8"
                                            />

                                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                                Not much to see here
                                            </h2>
                                            <p className="text-gray-500 mb-6 max-w-md">
                                                Start by joining communities to bring this page to life.
                                            </p>

                                            <Link to="/community/discover">
                                                <Button className="bg-[#00A8E9] hover:bg-[#008ec5] text-white px-6 py-2 rounded-md">
                                                    Explore Community
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <WeeklyCalendar />
                </div>
            </div>
            <Report communityId={reportSelectedCommunity?.id} open={reportOpen} onOpenChange={setReportOpen} />
        </CommunityLayout>
    );
};

export default MyCommunities;
