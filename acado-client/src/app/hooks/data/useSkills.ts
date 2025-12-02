import { SkillsResponseData, SkillsSuggestion } from "@app/types/learner/portfolio";
import { getSkillsSuggestions, getUserSkills } from "@services/learner/Portfolio";
import { useQuery } from "@tanstack/react-query";

export const useSkillsSuggestions = () => {
    const queryKey = ['skills-suggestions'];
    return useQuery<Array<SkillsSuggestion>>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await getSkillsSuggestions();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

// getUserSkills

export const useUserSkills = () => {
    const queryKey = ['user-skills'];
    return useQuery<Array<SkillsResponseData>>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await getUserSkills();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
