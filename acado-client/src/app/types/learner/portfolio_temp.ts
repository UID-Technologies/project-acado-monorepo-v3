export type PortfolioSocial = {
    mob_num?: string | null;
    email?: string | null;
    linkedin?: string | null;
    facebook?: string | null;
    twitter?: string | null;
    site_url?: string | null;
    bee?: string | null;
    dribble?: string | null;
    insta?: string | null;
    pinterest?: string | null;
    other?: string | null;
    mob_num_hidden?: string | null;
    email_hidden?: string | null;
    id?: number;
  };
  
export type PortfolioSocialResponseData = {
    list: string
};

export type PortfolioSocialResponse = {
    status: number;
    data: PortfolioSocialResponseData;
    error: string;
};

export type Portfolio = {
    portfolio_title: string;
    portfolio_link: string;
    action: string;
    portfolio_key: string;
    edit_url_portfolio: string;
    edit_image_type: string;
    desc: string;
    image_name: string;
    portfolio_file: string;
    id: number;
};


export type UserPortfolioResponse = {
    status: number;
    data: UserPortfolio;
    error: string;
};


export type UserPortfolio = {
    image: string;
    name: string;
    resume: Array<{ url: string }>;
    profile_video: string;
    profile_video_cdn: string;
    portfolio_profile: portfolio_profile[];
    base_file_url: string;
    open_to_work: string;
    skill: SkillsResponseData[];
    portfolio: Portfolio[];
    certificate: Activity[];
    Project: Activity[];
    extra_activities: Activity[];
    Education: Activity[];
    Experience: Activity[];
    portfolio_social: PortfolioSocial[];
    profile_completion: number;
    recent_activity: Array<any>;
    resume_parser_data: Array<any>;
    resume_parser_data_count: number;
};

export type portfolio_profile = {
    name: string,
    headline: string,
    country: string,
    city: string,
    lastName: string,
    email: string,
    phone: string,
    state: string,
    about_me: string,
    id: number
}

export type Activity = {
    activity_type: string,
    title?: string,
    description?: string,
    start_date?: string,
    percentage?: string,
    end_date?: string,
    institute?: string,
    certificate?: string,
    action?: string,
    professional_key?: string,
    edit_url_professional?: string,
    employment_type?: string,
    currently_work_here?: string,
    curricular_type?: string,
    image_name?: string,
    id?: number,
    // new fields
    study_field?: string,
    location?: string,
    grade?: string,
};

export type ActivityResponseData = {
    list: string
};

export type ActivitySaveResponse = {
    status: number;
    data: ActivityResponseData;
    error: string;
};


// Activities 

// 1. Education

export type EducationActivity = {
    institute: string;
    degree: string;
    study_field: string;
    start_date: string;
    end_date: string;
    description: string;
    grade: string;
    location: string;
    activity_type?: string;
    id?: number;
}

// 2. Experience

export type ExperienceActivity = {
    institute: string;
    title: string;
    start_date: string;
    end_date: string;
    description: string;
    location: string;
    activity_type?: string;
    employment_type?: string;
    id?: number;
}

// 3. CertificateActivity

export type CertificateActivity = {
    institute: string;
    title: string;
    start_date: string;
    end_date: string;
    image_name?: string;
    id?: number;
    certificate?: File;
}


export interface ProjectActivity {
    title: string;
    institute: string;
    start_date: string;
    end_date?: string;
    action: string;
    certificate: File;
}

// skills Suggestion Data

export type SkillsSuggestionResponseData = {
    id: number,
    name: string,
    description: string,
    organization_id: number,
    status: string,
    created_at: string,
    updated_at: string,
    parent_id: null
}

export type SkillsSuggestionResponse = {
    status: number;
    data: SkillsSuggestionResponseData[];
    error: string;
};

export type SkillAddResponse = {
    status: number;
    data: string;
    error: string;
};

// Skills

export type SkillsRequest = {
    skill_id: number
    self_proficiency: string
}


export type SkillsResponseData = {
    id?: number,
    organization_id?: number,
    user_id?: number,
    skill_id: number,
    self_proficiency?: string,
    assesed_proficiency?: null,
    assessment_content_id?: null,
    assessment_score?: null,
    assesed_date?: null,
    status?: string,
    created_at?: string,
    updated_at?: string,
    name?: number,
    description?: null
}


export type SkillsResponse = {
    status: number;
    data: SkillsResponseData[];
    error: string;
};