import OpenPortfolioApiService from "./axios";


export interface Section {
    _id: string
    SectionKey: string
    isDefault: boolean
    isLocked: boolean
    isRequired: boolean
    name: string
    description: string
    isActive: boolean
    org_id: string
    allowedRoles: [string]
    sectionHtml: string
    fields: [fieldsSchema]
}


export interface fieldsSchema {
    _id: string
    fieldKey: string
    name: string
    isRequired: boolean
    dataType: string
    placeholder: string
    default_value: string
    validationType: string
    validationValue: string | number | boolean | null
}

export interface BasicInfoSection {
    name: string;
    username?: string;
    email?: string;
    phone?: string;
    profilePicture?: string;
    coverPicture?: string;
    resume?: string;
    verification_status: 'not_applied' | 'pending' | 'verified' | 'rejected'
    show_personal_info: boolean
}


export interface Profile {
  _id: string;
  name: string;
  portfolio_id: string;
  org_id: string;
  role: string;
  uniqueIdentifier: string;
  isVerified: boolean;
  profileSection: {
    basic_info: BasicInfoSection[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [sectionKey: string]: any[];
  };
}


export interface getProfileResponse {
    status: number
    data: {
        portfolio: Profile
        sections?: [Section]
    }
    message: string
}


export const getprofile = async (org_id: string, uniqueIdentifier: string) => {
    try {
        const response = await OpenPortfolioApiService.get<getProfileResponse>(`/get-profile/user?org_id=${org_id}&uniqueIdentifier=${uniqueIdentifier}`);
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
}; 