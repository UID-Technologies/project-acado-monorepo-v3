import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Event, EventCategory, EventCategoryGroups, EventDetails } from '@app/types/collaborate/events'
import { fetchEventById, fetchEvents, fetchEventCategoryGroups, fetchEventCategory, fetchPublicEvents } from "@services/collaborate/EventService";
import { Activity } from "@app/types/learner/events";
import { fetchEventDetails } from "@services/learner/EventDetailsService";
import { fetchEventApply } from "@services/public/EventService";

/**
 * Hook to fetch paginated events with optional filters
 * @param params - URLSearchParams for filtering events
 * @returns Query result with events array
 */
export const useEvents = (params?: URLSearchParams | null) => {
    return useQuery<Array<Event>>({
        queryKey: ['events', params?.toString()],
        queryFn: async () => {
            const searchParams = params ? new URLSearchParams(params) : new URLSearchParams();
            searchParams.append('type', 'event');
            const res = await fetchEvents(searchParams);
            return res ?? [];
        },
        retry: 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
};

/**
 * Hook to fetch public events (non-authenticated)
 * @param params - URLSearchParams for filtering events
 * @returns Query result with public events array
 */
export const usePublicEvents = (params?: URLSearchParams | null) => {
    return useQuery<Array<Event>>({
        queryKey: ['public-events', params?.toString()],
        queryFn: async () => {
            const res = await fetchPublicEvents(params);
            return res ?? [];
        },
        retry: 2,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

/**
 * Hook to fetch event details by ID
 * @param id - Event ID
 * @returns Query result with event details
 */
export const useEventById = (id: string | undefined) => {
    return useQuery<EventDetails>({
        queryKey: ['event', id],
        queryFn: async () => {
            if (!id) throw new Error('Event ID is required');
            const res = await fetchEventById(id);
            return res;
        },
        enabled: !!id,
        retry: 2,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

/**
 * Hook to fetch event activity details (learner view)
 * @param eventId - Event ID
 * @returns Query result with activity list and instructions
 */
export const useEventActivityDetails = (eventId: string | undefined) => {
    return useQuery<{
        list: Activity[];
        competition_instructions: {
            whats_in?: string;
            instructions?: string;
            faq?: string;
        };
    }>({
        queryKey: ['event-activity-details', eventId],
        queryFn: async () => {
            if (!eventId) throw new Error('Event ID is required');
            const res = await fetchEventDetails(eventId);
            return res;
        },
        enabled: !!eventId,
        retry: 2,
        staleTime: 1000 * 60 * 3, // 3 minutes
        gcTime: 1000 * 60 * 10,
    });
};

/**
 * Hook to fetch event category groups
 * @returns Query result with event category groups
 */
export const useEventCategoryGroups = () => {
    return useQuery<Array<EventCategoryGroups>>({
        queryKey: ['event-category-groups'],
        queryFn: async () => {
            const res = await fetchEventCategoryGroups();
            return res ?? [];
        },
        retry: 2,
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 120, // 2 hours
    });
};

/**
 * Hook to fetch event categories
 * @returns Query result with event categories
 */
export const useEventCategory = () => {
    return useQuery<Array<EventCategory>>({
        queryKey: ['event-categories'],
        queryFn: async () => {
            const res = await fetchEventCategory();
            return res ?? [];
        },
        retry: 2,
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 120, // 2 hours
    });
};

/**
 * Mutation hook to apply/enroll for an event
 * @returns Mutation object with mutate function
 */
export const useEventApply = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventId: string) => {
            if (!eventId) throw new Error('Event ID is required');
            return await fetchEventApply(eventId);
        },
        onSuccess: (_, eventId) => {
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['event-activity-details', eventId] });
        },
        retry: 1,
    });
};

// assessment-result
