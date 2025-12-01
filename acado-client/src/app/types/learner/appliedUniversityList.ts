export interface AppliedUniversityData {
    id: number;
    name: string;
    logo: string;
    wp_university_id: number;
}

export interface AppliedUniversityListResponse {
    status: number;
    data: AppliedUniversityData[];
    error: any;
}
