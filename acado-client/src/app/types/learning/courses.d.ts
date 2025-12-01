export type ContentType = 'video' | 'notes' | 'assignment' | 'assessment' | 'zoomclass' | 'liveclass' | 'offlineclass' | 'video_yts' | 'audio' | 'scorm' | 'survey' | 'text' | 'external_link';

export type Faculty = {
    id: number
    name: string
    image: string
}

export type CourseDetails = {
    id: number
    name: string
    description: string
    start_date: string
    end_date: string
    image: string
    student_enrolled: number
    program_faculty: Faculty[],
    organization: Organization,
    modules: Module[]
    course_skills: string
    program_status: ProgramStatus
    is_map_id: number | null
    subscription_type: string | null
    is_course_assigned: number
    course_meta: CourseMeta
    JobRoleSkill: {
        skills: string[];
        job_role: string[];
    }
    course_leader_name: string;
    course_leader_email: string;
    course_leader_id: number;
    course_leader_profile_image: string;
    job_role_skill: {
        skills: string[];
        job_role: string[];
    }
}

export type CourseDetailsApiResponse = {
    status: number
    data: CourseDetails
    error: string[]
}


// course module details
export type CommonModuleContent = {
    program_content_id: number
    language_id: number
    parent_id: number
    title: string
    image: string
    description: string
    due_date: string
    completion: number | string
    content_type: 'video' | 'notes' | 'assignment' | 'assessment' | 'zoomclass' | 'liveclass' | 'offlineclass' | 'video_yts' | 'audio' | 'scorm' | 'survey' | 'text' | 'external_link';
    total_coins: number
    no_pages: number
    duration_in_minutes: number
    url: string
    assignment_file: string
    start_date: number
    end_date: number
    attempts_remaining: number
    attempt_date: string | number | null
    score: number
    is_completed: number
    questions_attempted: number
    program_id: number
    overall_score: number
    overall_result: string
    maximum_marks: number
    negative_marks: number
    stream_file_id: string | null
    is_locked: number // 1 = locked, 0 = not locked
}

export type ModuleCourseDetails = {
    id: number
    name: string
    description: string
}


export type CourseModule = {
    course_details: ModuleCourseDetails,
    module_details: Module,
    contents: CommonModuleContent[],
    next_module: Module | null,
    content_count: {
        videos: number
        notes: number
        sessions: number
    }
}

export type CourseModuleApiResponse = {
    status: number
    data: CourseModule
    error: string[]
}

export interface SubmittedAssignment {
    id: number;
    content_id: number;
    user_id: number;
    marks_obtained: number | null;
    is_passed: number;
    user_notes: string | null;
    teacher_notes: string | null;
    review_status: number;
    file: string;
    created_at: number;
    updated_at: number;
    organization_id: number | null;
    teacher_file: string;
    start_date_ts: number | null;
    end_date_ts: number | null;
}

export interface Assignment {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    file: string;
    allow_multiple: number;
    is_graded: number;
    submission_mode: number;
    learner_name: string;
    submission_details: SubmittedAssignment[];
}

export interface AssignmentApiResponse {
    status: number;
    data: {
        assessment_details: Assignment[];
    };
    error: string[];
}

export interface SubmissionApiResponse {
    status: number;
    message: string;
    error: string[];
}