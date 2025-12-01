export interface University {
    id: number;
    organization_logo: string;
    name: string;
}

export interface CourseMetaData {
    degree: string;
    banners: string[];
    duration: string;
    language: string;
    partners: string;
    course_usp: string;
    eligibility: string;
    scholarship: string;
    tuition_fee: string;
    about_course: string;
    how_to_apply: string;
    collaboration: string;
    course_heading: string;
    field_of_study: string;
    course_structure: string;
    learning_outcome: string;
    number_of_credits: string;
    school_department: string;
    career_opportunities: string;
}

export interface Course {
    id: number;
    name: string;
    description: string;
    image: string;
    start_date: string;
    end_date: string;
    short_code: string | null;
    country_name: string | null;
    country_id: number | null;
    course_meta_data: CourseMetaData;
    organization: University;
    duration: number;
}

export interface CourseApiResponse {
    status: number;
    data: Course[];
    error: string | null;
}