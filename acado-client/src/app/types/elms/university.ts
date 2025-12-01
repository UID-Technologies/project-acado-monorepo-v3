export interface University {
    id: number;
    name: string;
    logo: string;
    org_description: string;
    brochure_url: string;
    banners: string[] | null;
    university_url: string;
    address: string;
    city: string;
    state_name: string;
    country_name: string
    rating: number;
    faqs: string[] | null;
    banner_url:string[] | null;
    rank: number;
    about: string;
    admission: string;
    full_name: string;
    placements: string;
    short_name: string;
    testimonials: string[] | null;
    why_this_university: string;
}

export interface UniversityResponse {
    status: number;
    data: University[];
    error: string | null;
}


export interface UniversityDetailsResponse {
    status: number;
    data: University;
    error: string[] | null;
}