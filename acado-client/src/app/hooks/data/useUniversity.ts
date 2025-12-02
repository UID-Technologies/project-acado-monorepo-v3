import { useQuery } from "@tanstack/react-query";
import { fetchUniversities } from "@services/elms/UniversityService";
import { University } from "@app/types/elms/university";

export const useUniversities = () => {
    const queryKey = ['universities'];
    return useQuery<Array<University>>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await fetchUniversities();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
