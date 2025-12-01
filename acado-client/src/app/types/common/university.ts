export type University = {
    term_id: number,
    name: string,
    meta_value: number,
    guid: string,
    university_meta_data: {
        university_domains: [],
        university_tag_line: string,
        university_category_image: string,
        university_download_brochure_url: string,
        university_id_on_lms: number,
        university_location: string,
    }
}

export type UniversityData = {
    message: string,
    status: string,
    data: University[]
}

export type UniversityDetails = {
    id: number;
    org_description: string;
    name: string;
    logo: string;
    address: string;
    country_id: number;
    state_id: string;
    city: string;
    country_name: string;
    state_name: string;
    faq: string;
    rank: string;
    about: string;
    rating: number;
    banners: string[];
    admission: string;
    full_name: string;
    placements: string;
    short_name: string;
    testimonial: string;
    why_this_university: string;
}

export type UniversityDetailsResponse = {
    message: string;
    status: string;
    data: UniversityDetails
}


export type Course = {
    object_id: number,
    term_taxonomy_id: number,
    ID: number,
    json: {
        ID: number,
        post_author: number,
        post_date_gmt: string,
        post_title: string,
        post_status: string,
        post_name: string,
        price_to_sort: number,
        is_sale: number,
        lang: null,
        meta_data: {
            _lp_duration: string
            _lp_students: number
            _lp_faqs: Array<[string, string]>
        },
        author: {
            ID: number,
            user_login: number,
            user_nicename: string,
            user_email: string,
            user_url: null,
            user_register: string,
            display_name: string,
            meta_data: {},
            image_url: string
        },
        image_url: string;
        permalink: string,
        categories: [
            {
                term_id: number,
                name: string,
                slug: string,
                term_group: number,
                term_taxonomy_id: number,
                taxonomy: string,
                description: string,
                parent: number,
                count: number,
                filter: string
            }
        ],
    },
    course_meta_data: {
        course_duration: string,
        courses_location: string,
        courses_degree: string,
        what_is_in_program: string
        product_testimonials: string
        why_you_should_do_it: string
        total_academic_hours: string
        what_your_will_learn_section: string
        what_is_required_to_enroll_in_course: string
        transform_the_way_we_teach_and_the_way_we_learn: string
    }
    university_id: number,
    university_name: string,
    university_image_url: string,
    university_image?: string
}

export type CourseData = {
    message: string,
    status: string,
    data: Course[],
    pagination: object,
    university: University
}


export type CourseDetailsResponse = {
    message: string;
    status: string;
    data: CourseDetails
}


export type AppliedUniversityResponse = {
    message: string;
    status: string;
    data: number[]
}


export type AppliedCourseListResponse = {
    message: string;
    status: string;
    data: CourseDetails[]
}


export interface Organization {
    id: number;
    name: string;
    logo: string;
    country_name: string
    description: string;
    brochure_url: string;
    banner_url: string[] | null;
    university_url: string;
    city: string;
    state_name: string
    type: string;
    organization_logo: string;

}

export interface OrganizationResponse {
    status: number;
    data: Organization[];
}

interface CourseMetaData {
    unknown_key: any | null;
}

export interface CourseDetails {
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
    organization: Organization;
    duration: number;
}

export interface Pagination {
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    current_page: number;
}

export interface CourseMetaResponse {
    status: number;
    data: CourseDetails[];
    pagination: Pagination;
    error: any[];
}
