export interface Dimension {
    height?: number;
    width?: number;
}

export interface MultiFileUploadsCount {
    // Add properties if there are any specific fields inside this object
    count?: number;  // Example property
}

export interface DashboardReel {
    id: number;
    title: string;
    description: string;
    created_at: number;
    created_by: number;
    updated_at: number;
    updated_by: number;
    status: string;
    parent_id: number;
    category_id: number;
    content_type: string;
    resource_path: string;
    language: string;
    tag: string | null;
    like_count: number;
    program_content_id: number;
    start_date: number;
    end_date: number;
    is_multilingual: number;
    visibility_value: number;
    visibility: number;
    dimension?: Dimension;
    multi_file_uploads: string[];
    view_count: number;
    multiple_file_upload: string | null;
    user_id: number;
    name: string;
    email: string;
    profile_image: string | null;
    user_status: string;
    user_like_trackings_id: string | null;
    user_liked: number;
    resource_type: string;
    multi_file_uploads_count: MultiFileUploadsCount[];
    thumbnail_url: string;
    is_attempt: number;
    user_submitted_file: string;
    user_submitted_multiple_file: string[];
}

export interface DashboardCarvan {
    id: number;
    title: string;
    organization_name: string;
    org_logo: string;
    description: string;
    created_at: number;
    created_by: number;
    updated_at: number;
    updated_by: number;
    status: string;
    parent_id: number;
    category_id: number;
    content_type: string;
    resource_path: string;
    language: string;
    tag: string | null;
    like_count: number;
    comment_count: number;
    program_content_id: number;
    start_date: number | null;
    end_date: number | null;
    is_multilingual: number;
    visibility_value: number;
    visibility: number;
    dimension?: Dimension;
    multi_file_uploads: string[];
    view_count: number;
    multiple_file_upload: string | null;
    user_id: number;
    name: string;
    email: string;
    profile_image: string | null;
    user_status: string;
    user_like_trackings_id: string | null;
    user_liked: number;
    resource_type: string;
    multi_file_uploads_count: MultiFileUploadsCount[];
    multi_file_uploads_dimension: MultiFileUploadsCount[];
    thumbnail_url: string;
    is_attempt: number;
    user_submitted_file: string;
    user_submitted_multiple_file: string[];
}

export interface JobDashboard {
    tot_domains: number;
    tot_vacancies: number;
    tot_job_roles: number;
    tot_companies: number;
    tot_location: number;
    tot_job_posting: number;
}

export interface InterestArea {
    interestarea: string;
    icon_url: string;
}

export interface ToDoActivities {
    today_classes: unknown[];
    recent_activity: unknown[];
}

export interface Dashboard {
    dashboard_reels_limit: DashboardReel[];
    dashboard_carvan_limit: DashboardCarvan[];
    dashboard_my_courses_limit: unknown[]; // Can be replaced with a specific type if needed
    to_do_activities: ToDoActivities;
    job_dashboard: JobDashboard[];
    interest_area: InterestArea[];
}

export interface DashboardResponse {
    status: number,
    data: {
        banner_link: string,
        banner_url: string, 
        dashboard_carvan_limit: DashboardCarvan[],
        dashboard_my_courses_limit: any,
        interest_area: InterestArea[],
        job_dashboard: JobDashboard[],
        to_do_activities: ToDoActivities


    },
    error: []
}