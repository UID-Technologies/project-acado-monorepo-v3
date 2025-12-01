import ApiService from '@services/ApiService';
import { CourseListResponse } from '@app/types/learner/courseList';
import { Course, CourseData } from '@app/types/common/university';
import { AppliedCoursesResponse, AppliedCourses, AssignedUniversityCourseRequest } from '@app/types/learner/courses';

export async function fetchCourseList(): Promise<CourseListResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<CourseListResponse>({
            url: '/courses-list',
            method: 'get',
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}


// get applied course where enrolled
export async function fetchEnrolledCourses(): Promise<AppliedCourses[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AppliedCoursesResponse>({
            url: `/applied-course`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


export async function applyCourse(courseReqeust: AssignedUniversityCourseRequest): Promise<AppliedCourses> {
    try {
        const response = await ApiService.fetchDataWithAxios<AppliedCoursesResponse>({
            url: `/user-course-lead`,
            method: 'post',
            data: courseReqeust
        });
        return response.data[0];
    } catch (error) {
        throw error as string;
    }
}

export async function applyCourse2(courseReqeust: AssignedUniversityCourseRequest): Promise<AppliedCourses> {
    try {
        // alert(courseReqeust.program_id);
        // const response = await ApiService.fetchDataWithAxios<AppliedCoursesResponse>({
        //     url: 'http://57.159.29.149:4000/forms/by-course/7434',
        //     method: 'get',
        //     // data: courseReqeust
        // });
        function encodeAuthData(authData) {
            // Encode the authentication data as base64
            const jsonString = JSON.stringify(authData);
            return btoa(encodeURIComponent(jsonString));
        }

        const response = `{
                            "formId": "68fea24ee95f59ee6b286d8a",
                            "name": "Application Form",
                            "title": "Application Form",
                            "status": "draft",
                            "allForms": [
                                {
                                    "formId": "68fea24ee95f59ee6b286d8a",
                                    "name": "Application Form",
                                    "title": "Application Form",
                                    "status": "draft"
                                }
                            ]
                        }`;
        const res = JSON.parse(response);
        // alert(res.formId); 

        if(res.formId !== undefined){
            // FRONTEND_URL = http://57.159.29.149:8080
            const userData = localStorage.getItem('sessionUser');
            const userDataParsed = JSON.parse(userData);
            // alert(userDataParsed.state.user.name)
            // return false;
            const mockLearnerAuthData = {
                email: userDataParsed.state.user.email,
                role: userDataParsed.state.user.role,
                name: userDataParsed.state.user.name,
                userId: userDataParsed.state.user.id
            };
            const encodedAuth = encodeAuthData(mockLearnerAuthData);

            window.open(`http://57.159.29.149:8080/user/login?formId=${res.formId}&auth=${encodedAuth}`, '_blank'); 
        }
        // console.log("response.res")
        // console.log(response.res)
        return response.res;
    } catch (error) {
        throw error as string;
    }

}
