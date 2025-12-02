// courseService.ts
import ApiService from '@services/ApiService';
import { Course, CourseDetails, CoursesApiResponse, CourseDetailsApiResponse, CourseModule, CourseModuleApiResponse, getContinueReadingCoursesResponse } from '@app/types/public/lmsCourses';
import { mapLegacyToNewParams } from '@/utils/apiParamMapper';
import { adaptCoursesResponse, adaptCourseDetailResponse } from '@/utils/apiResponseAdapter';

// Fetch all courses
export async function fetchFreeCourses(query?: URLSearchParams): Promise<CoursesApiResponse> {
    try {
        // Map legacy parameter names to new API parameter names
        const mappedParams = query ? mapLegacyToNewParams(query) : undefined;
        
        const response = await ApiService.fetchDataWithAxios<any>({
            url: `/courses`, // Updated from /v1/free-courses to /courses
            method: 'get',
            params: mappedParams,
        });
        
        // Adapt new API response to legacy format
        return adaptCoursesResponse(response);
    } catch (error) {
        throw error as string;
    }
}



// Fetch course by ID
export async function fetchCourseById(course_id: string): Promise<CourseDetails> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: `/courses/${course_id}`, // Updated from /v1/get-course-details/:id to /courses/:id
            method: 'get',
        });
        
        // Adapt new API response format
        const adaptedData = adaptCourseDetailResponse(response);
        return adaptedData?.data || adaptedData;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchForms() {

    try {
        // const response = await ApiService.fetchDataWithAxios<CourseDetailsApiResponse>({
        //     url: `http://57.159.29.149:4000/forms`,
        //     method: 'get',
        // });
        // return response.data;
        return `{
                "forms": [
                    {
                        "name": "Application Form",
                        "title": "Application Form",
                        "description": "This is test application form description",
                        "universityId": "",
                        "courseIds": [
                            "4895",
                            "7434"
                        ],
                        "fields": [
                            {
                                "fieldId": "68fe9af38bc11c2ae04f881d",
                                "name": "first_name",
                                "label": "First Name",
                                "customLabel": "First Name",
                                "type": "text",
                                "placeholder": "Enter your first name",
                                "required": true,
                                "isVisible": true,
                                "isRequired": true,
                                "categoryId": "68fe9aec8bc11c2ae04f8802",
                                "subcategoryId": "68fe9aec8bc11c2ae04f87fe",
                                "options": [],
                                "validation": [],
                                "order": 1
                            },
                            {
                                "fieldId": "68fe9af38bc11c2ae04f8824",
                                "name": "email",
                                "label": "Email Address",
                                "customLabel": "Email Address",
                                "type": "email",
                                "placeholder": "your.email@example.com",
                                "required": true,
                                "isVisible": true,
                                "isRequired": true,
                                "categoryId": "68fe9aec8bc11c2ae04f8802",
                                "subcategoryId": "68fe9aec8bc11c2ae04f87ff",
                                "options": [],
                                "validation": [],
                                "order": 1
                            },
                            {
                                "fieldId": "68fe9af38bc11c2ae04f882d",
                                "name": "passport_number",
                                "label": "Passport Number",
                                "customLabel": "Passport Number",
                                "type": "text",
                                "required": true,
                                "isVisible": true,
                                "isRequired": true,
                                "categoryId": "68fe9aec8bc11c2ae04f8802",
                                "subcategoryId": "68fe9aec8bc11c2ae04f8800",
                                "options": [],
                                "validation": [],
                                "order": 1
                            }
                        ],
                        "customCategoryNames": {},
                        "status": "draft",
                        "isLaunched": true,
                        "isActive": true,
                        "createdAt": "2025-10-26T22:35:58.054Z",
                        "updatedAt": "2025-10-27T06:22:54.251Z",
                        "endDate": "2025-10-30T22:36:00.000Z",
                        "startDate": "2025-10-01T22:36:00.000Z",
                        "id": "68fea24ee95f59ee6b286d8a"
                    }
                ],
                "pagination": {
                    "page": 1,
                    "limit": 20,
                    "total": 1,
                    "pages": 1
                }
            }`;
    } catch (error) {
        throw error as string;
    }
}

// Fetch module by course and module ID
export async function fetchModuleByCourseId(module_id: string): Promise<CourseModule> {
    try {
        const response = await ApiService.fetchDataWithAxios<CourseModuleApiResponse>({
            url: `/courses/modules/${module_id}`, // Updated endpoint (Note: verify this endpoint exists in acado-api)
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// Fetch continue reading courses
export async function fetchContinueReadingCourses(): Promise<Course[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<getContinueReadingCoursesResponse>({
            url: '/v1/courses/continue-reading',
            method: 'get',
        });
        return response.data.courses;
    } catch (error) {
        throw error as string;
    }
}
