import { useQuery } from "@tanstack/react-query";
import { fetchIndustry } from "../services/CommunityService";
import { OrgCommunities } from "../@types/community";

export function useCommunities() {
    return useQuery<OrgCommunities[]>({
        queryKey: ["communities"],
        queryFn: fetchIndustry,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
}
