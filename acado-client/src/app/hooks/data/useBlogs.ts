import { useQuery } from "@tanstack/react-query";
import { fetchBlogs } from "@services/learner/BlogServices";
import { Post } from "@app/types/learner/post";


export const useBlogs = () => {
    const queryKey = ['blogs'];
    return useQuery<Array<Post>>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await fetchBlogs();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
