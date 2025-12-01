export type Organization = {
    id: number
    name: string
    logo: string
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

export type Course = {
    title: string
    isFree: string
    provider: string
    id: number
    name: string
    description: string
    image: string
    start_date: string
    end_date: string
    short_code: string | null
    duration: number
    contry_name: string
    contry_id: string
    organization: Organization
    course_meta_data: CourseMetaData
}

export type Pagination = {
    current_page: number
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    next_page_url: string | null
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
    degree_filter: DegreeFilter;
}
export interface DegreeFilter {
    bachelor: string;
    master: string;
    diploma: string;
}

export type CoursesApiResponse = {
    status: number
    data: Course[]
    pagination: Pagination
    error: string[]
}


// Course Details Types
export type Faculty = {
    id: number
    name: string
    image: string
}

export type Module = {
    id: number
    name: string
    description: string
}

export type ProgramStatus = {
    program_status: string
    program_time: string
}

export type CourseDetails = {
    id: number
    name: string
    description: string
    image: string
    student_enrolled: number
    program_faculty: Faculty[],
    organization: Organization,
    modules: Module[]
    course_skills: string
    program_status: ProgramStatus
}

export type CourseDetailsApiResponse = {
    status: number
    data: CourseDetails
    error: string[]
}

export type ModuleContent = {
    program_content_id: number
    title: string
    content_type: 'notes' | 'assesment' | 'assignment' | 'video'
    start_date: string
    end_date: string
    duration: number
}

export type ModuleCourseDetails = {
    id: number
    name: string
    description: string
}


export type CourseModule = {
    course_details: ModuleCourseDetails,
    module_details: Module,
    contents: ModuleContent[]
}

export type CourseModuleApiResponse = {
    status: number
    data: CourseModule
    error: string[]
}









export type Review = {
    id: number
    name: string
    image: string
    rating: number
    review: string
    date: string
}

export type Testimonial = {
    id: number
    name: string
    image: string
    testimonial: string
    date: string
}

export type Instructor = {
    id: number
    name: string
    image: string
    bio: string
    ratings: number
}


export type Provider = {
    id: number
    name: string
    logo: string
}

// export type Module = {
//     id: number
//     title: string
//     description: string
//     duration: string
//     content: Content[],
//     whats_included?: WhatsIncluded[]
// }

export type WhatsIncluded = {
    title: string
    type: 'video' | 'reading' | 'assignment'
}

// export type Content = {
//     id: number
//     title: string
//     description: string
//     type: 'video' | 'reading' | 'assignment'
//     content: SubContent[]
// }

export type SubContent = {
    title: string
    duration: string
    video_transcript?: string
    video_url?: string
}

export type getCourseByIdResponse = {
    message: string,
    data: Course,
    status: number,
    error: string[]
}

export type getModuleResponse = {
    message: string,
    data: {
        courseDetails: Course,
        moduleDetails: Module
    },
    status: number,
    error: string[]
}

export type getContinueReadingCoursesResponse = {
    message: string,
    data: {
        courses: Course[]
    },
    status: number,
    error: string[]
}