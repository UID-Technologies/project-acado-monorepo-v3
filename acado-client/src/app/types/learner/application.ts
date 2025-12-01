export interface Application {
    applied_courses: number;
    applied_university: number;
    inprogress_course: number;
    selected_course: number;
}

export interface Data {
    applied_courses: number;
    applied_university: number;
    inprogress_course: number;
    selected_course: number;
}

export interface ApplicationData {
    status: number;
    data: Data;
    error: string;
}
