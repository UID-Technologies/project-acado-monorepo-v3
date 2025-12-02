import { Community } from "@app/types/common/community";
import { fetchCommunity } from "@services/public/CommunityService";
import { useQuery } from "@tanstack/react-query";

export function useCommunities() {
    return useQuery<Community[]>({
        queryKey: ["communities"],
        queryFn: fetchCommunity,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
}
