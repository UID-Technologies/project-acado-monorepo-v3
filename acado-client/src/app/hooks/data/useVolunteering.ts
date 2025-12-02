import { useQuery } from "@tanstack/react-query";
import { fetchVolunteering } from "@services/learner/EventService";
import { Event } from "@app/types/learner/events";
import { fetchVolunteeringEvents } from "@services/public/EventService";
import { Event as PublicEvent } from '@app/types/public/event';

export const useVolunteering = () => {
    const queryKey = ['volunteering'];
    return useQuery<Array<Event>>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await fetchVolunteering();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const usePublicVolunteering = () => {
    const queryKey = ['public-volunteering'];
    return useQuery<Array<PublicEvent>>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await fetchVolunteeringEvents();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
