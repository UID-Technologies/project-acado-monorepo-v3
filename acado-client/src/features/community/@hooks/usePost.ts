import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchIndustryLatestPosts, fetchPinedPosts, fetchPollPosts, fetchPostComments, fetchPosts } from "../services/CommunityService";
import { likePost } from "../services/PostService";
import { getPollResults } from "../services/PollService";
import { IndustryPost, Poll, Post, PostComment } from "../@types/community";
import { PollResult } from "../@types/poll";

export const usePosts = (params?: URLSearchParams) => {
    return useQuery<Array<Post>>({
        queryKey: ['posts', params],
        queryFn: async () => {
            const res = await fetchPosts(params);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


export const usePinnedPost = () => {
    return useQuery<Array<Post>>({
        queryKey: ['pinnedPosts'],
        queryFn: async () => {
            const res = await fetchPinedPosts();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};



export const usePostComments = (postId: number | string) => {
    return useQuery<Array<PostComment>>({
        queryKey: ['postComments', postId],
        queryFn: async () => {
            const res = await fetchPostComments(postId);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


export const useOpinionPolls = () => {
    return useQuery<Array<Poll>>({
        queryKey: ['opinionPolls'],
        queryFn: async () => {
            const res = await fetchPollPosts();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

// usePollResult
export const useOpinionPollResult = (pollId: number) => {
    return useQuery<PollResult>({
        queryKey: ['opinionPollResult', pollId],
        queryFn: async () => {
            const res = await getPollResults(pollId);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

// post like 

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (post: Post) => {
            return await likePost(post);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
};


// Emerging Industries - useEmergingIndustries()

export const useIndustryLatestPosts = () => {
    return useQuery<Array<IndustryPost>>({
        queryKey: ['industryposts'],
        queryFn: async () => {
            const res = await fetchIndustryLatestPosts();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};