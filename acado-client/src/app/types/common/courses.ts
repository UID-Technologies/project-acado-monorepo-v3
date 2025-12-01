export type Courses = {
    course_heading: string
    banners: string
    degree: string
    eligibility: string
    field_of_study: string
    duration: string
    school_department: string
    tuition_fee: string
    number_of_credits: string
    language: string
    scholarship: string
    how_to_apply: string
    about_course: string
    course_structure: string
    what_you_will_get: string
    learning_outcome: string
    partners: string
    collaboration: string
    career_opportunities: string
    course_usp: string
    course_name:string
    course_image:string
    org_id:number
}

export type CoursesResponse = {
    status: 1 | 0
    data: Courses
    error: string[]
}