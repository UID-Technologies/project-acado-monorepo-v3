interface Program {
    program_content_id: number;
    language_id: number;
    parent_id: number | null;
    title: string;
    image: string;
    created_at: number;
    description: string;
    due_date: number;
    completion: string;
    content_type: string;
    total_coins: number | null;
    duration_in_minutes: number;
    url: string;
    no_pages?: number;
}

export interface Assessment {
    program_content_id: number;
    questions_attempted: number;
    is_completed: boolean;
    score: number;
    attempt_date: number;
    action: string;
    action_title: string;
    asses_status: string;
    attempts_remaining: number;
    program_id: number;
    title: string;
    description: string;
    status: string;
    content_type: string;
    assessment_id: number;
    duration_in_minutes: number;
    negative_marks: number;
    attempt_allowed: number;
    maximum_marks: number;
    que_count: number;
    certificate: number;
    completion: number;
    start_date: number;
    end_date: number;
    overall_score: number;
    overall_result: string;
    url: string;
    total_coins: number | null;
}

export interface Assignment {
    program_id: number;
    program_content_id: number;
    title: string;
    description: string;
    status: string;
    venue: string;
    is_graded: number;
    allow_multiple: number;
    total_attempts: number;
    attempt_details: any[];
    content_type: string;
    maximum_marks: number;
    completion: number;
    start_date: number;
    end_date: number;
    completion_time: number;
    overall_score: number | null;
    overall_result: string;
    url: string;
    total_coins: number | null;
}

export interface ProgramContent {
    sessions: any[];
    learning_shots: learning_shots[];
    assessments: Assessment[];
    assignments: Assignment[];
    polls: any[];
    survey: any[];
    scorm: any[];
}

export interface sessions {
    image: string | null;
    id: number;
    author_id: number;
    reference_id: number;
    reference_author_id: number;
    module_id: number;
    title: string;
    content: string;
    description: string;
    created_at: string;
    content_type: string;
    page_count: number | null;
    expected_duration: number;
    end_date: string;
    start_date: string;
    completion_percentage: number | null;
    user_id: number | null;
    g_score: number | null;
    activity_status: string | null;
    content_type_label: string;
    difficulty_level: string;
    per_completion: number | null;
    language_id: number;
    parent_id: number | null;
    liveclass_action: string;
}



export interface learning_shots {
    program_content_id: number;
    language_id: number;
    parent_id: number | null;
    title: string;
    image: string;
    created_at: number;
    description: string;
    due_date: number;
    completion: string;
    content_type: 'video_yts' | 'notes' | string;
    total_coins: number | null;
    duration_in_minutes: number;
    url: string;
}

export interface ProgramModule {
    id: number;
    name: string;
    image: string;
    start_date: number;
    end_date: number;
    description: string;
    duration_in_days: number;
    total_coins: number | null;
    completion: number;
    content: ProgramContent;
}

export interface ContentResponseData {
    list: ProgramModule;
}

export interface ProgramContentResponse {
    status: number;
    data: ContentResponseData;
    error: any[];
}
