import ApiService from '@services/ApiService'
import { CoursesResponse, Courses } from '@app/types/common/courses';
import { adaptCourseDetailResponse } from '@/utils/courseDetailResponseAdapter';

/**
 * Fetch course metadata from legacy API
 * @deprecated Use fetchCourseDetails() for hybrid approach
 */
export async function fetchLmsCourseMeta(course_id: string): Promise<Courses> {
    try {
        const response = await ApiService.fetchDataWithAxios<CoursesResponse>({
            url: '/get-course-meta',
            method: 'post',
            data: {
                program_id: course_id,
            }
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

/**
 * Fetch course details using hybrid approach
 * 
 * Strategy:
 * 1. Fetch from new API (/courses/:id) for basic details and campaign content
 * 2. Fetch from legacy API (/get-course-meta) for modules, faculty, skills
 * 3. Merge both responses using adapter
 * 
 * @param course_id - Course ID
 * @returns Adapted course object with data from both APIs
 */
export async function fetchCourseDetails(course_id: string): Promise<any> {
    console.log('🔄 Fetching course details (hybrid):', course_id);

    try {
        // Fetch from both APIs in parallel for better performance
        const [newCourseResponse, legacyMetaResponse] = await Promise.allSettled([
            // 1. Fetch from new API
            ApiService.fetchDataWithAxios<any>({
                url: `/courses/${course_id}`,
                method: 'get',
            }),
            // 2. Fetch from legacy API
            ApiService.fetchDataWithAxios<CoursesResponse>({
                url: '/get-course-meta',
                method: 'post',
                data: {
                    program_id: course_id,
                }
            })
        ]);

        // Extract new API data
        let newCourse = null;
        if (newCourseResponse.status === 'fulfilled') {
            newCourse = newCourseResponse.value?.data || newCourseResponse.value;
            console.log('✅ New API fetch successful');
        } else {
            console.error('❌ New API fetch failed:', newCourseResponse.reason);
            throw new Error('Failed to fetch course from new API');
        }

        // Extract legacy API data (optional - don't fail if unavailable)
        let legacyMeta = null;
        if (legacyMetaResponse.status === 'fulfilled') {
            legacyMeta = legacyMetaResponse.value?.data || null;
            console.log('✅ Legacy API fetch successful');
        } else {
            console.warn('⚠️ Legacy API fetch failed (continuing without meta):', legacyMetaResponse.reason);
            // Don't throw - we can still show course details without legacy meta
        }

        // Adapt and merge responses
        const adaptedCourse = adaptCourseDetailResponse(newCourse, legacyMeta);

        console.log('✅ Course details fetched and adapted:', {
            id: adaptedCourse.id,
            name: adaptedCourse.name,
            hasModules: adaptedCourse.modules?.length > 0,
            hasFaculty: adaptedCourse.program_faculty?.length > 0,
        });

        return adaptedCourse;
    } catch (error: any) {
        console.error('❌ Failed to fetch course details:', error);
        throw error?.message || 'Failed to load course details';
    }
}
