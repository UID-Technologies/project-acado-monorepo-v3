import { useQuery } from "@tanstack/react-query";
import { Organization } from "@app/types/collaborate/organization";
import { Course } from "@app/types/common/university";
import { fetchOrganizationById, fetchOrganizationCourses } from "@features/community/services/UniversityService";

export const useOrganizationById = (id: string | undefined) => {
    const queryKey = ['organization', id];
    return useQuery<Organization>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await fetchOrganizationById(id);
            console.log("In Focus Data:", res);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
    });
};

export const useOrganizationCourses = (id: string | undefined) => {
    const queryKey = ['organization-courses', id];
    return useQuery<Array<Course>>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await fetchOrganizationCourses(id);
            console.log("Organization Courses Data:", res);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
    });
}
