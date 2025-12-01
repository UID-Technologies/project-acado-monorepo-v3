// export type Course = {
//     id: number;
//     short_code: string | null;
//     certificate_id: number;
//     g_score: number | null;
//     is_global_program: number;
//     registration_need_approval: number;
//     name: string;
//     level: string;
//     description: string;
//     image: string;
//     start_date: number;
//     end_date: number;
//     category_id: number;
//     created_by: number;
//     regular_price: number | null;
//     is_structured: boolean | null;
//     is_competition: boolean | null;
//     termination_days: number | null;
//     sale_price: number | null;
//     sis_ref_module_id: string | null;
//     completion: number;
//     score: string;
// };

// export type CoursesData = {
//     status: number;
//     data: {
//         assigned_course: Record<string, Course>;
//         user_interest_university_course: any[]; 
//     };
//     error: string;
// };


export type AppliedCourses = {
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
    post_content: string,
    post_title: string,
    post_status: string,
    post_name: string,
    university_name: string,
    university_id: number,
    university_image_id: number,
    university_image_url: string,
    course_meta_data: {
        what_is_in_program: string
        degree_type:string
        product_testimonials: string
        why_you_should_do_it: string
        total_academic_hours: string
        what_your_will_learn_section: string
        what_is_required_to_enroll_in_course: string
        transform_the_way_we_teach_and_the_way_we_learn: string
    },
}


export type AppliedCoursesResponse = {
    status: number,
    data: AppliedCourses[],
    error: string
}


export type AssignedUniversityCourseRequest = {
   
    program_id: number,
    reason:string,
    wp_center_id: number,
}