import { Mentor } from "@app/types/learner/mentor";
import { fetchMentorList } from "@services/learner/MentorListService";
import { useQuery } from "@tanstack/react-query";

export const useMentors = () => {
    const queryKey = ['mentors-list'];
    return useQuery<Array<Mentor>>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await fetchMentorList();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
