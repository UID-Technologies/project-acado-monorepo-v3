export type PortfolioAddResponse = {
    status: number
    data: {
        list: string
    }
    error: string
}

export type UserPortfolioResponse = {
    status: number;
    data: UserPortfolio;
    error: string;
};


export type PortfolioAddRequest = {
    name?: string
    lastName?: string
    email?: string
    phone?: string
    headline?: string
    city?: string
    state?: string
    country?: string
    about_me?: string
}

export type PortfolioSocial = {
    mob_num: string,
    email: string,
    linkedin: string,
    facebook: string,
    twitter: string,
    site_url: string,
    bee: string,
    dribble: string,
    insta: string,
    pinterest: string,
    other: string,
    mob_num_hidden: string,
    email_hidden: string,
    id: number
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
    extra_activities: Activity[];
    Education: Activity[];
    Experience: Activity[];
    portfolio_social: PortfolioSocial[];
    profile_completion: number;
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


export type SkillsResponseData = {
    id?: string,
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
    name?: string,
    description?: null
}