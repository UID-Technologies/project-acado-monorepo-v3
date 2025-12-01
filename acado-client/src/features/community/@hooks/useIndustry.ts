import { useQuery } from "@tanstack/react-query";
import { fetchIndustry } from "../services/CommunityService";
import { Industry } from "../@types/community";

export function useIndustries() {
  return useQuery<Industry[], Error>({
    queryKey: ["industries"],
    queryFn: fetchIndustry,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
