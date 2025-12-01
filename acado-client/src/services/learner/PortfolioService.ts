import ApiService from '@services/ApiService';
import { UserPortfolio, UserPortfolioResponse, UpdatePortfolioInfoResponse, PortfolioSocialResponse, Activity, ActivitySaveResponse, ActivityDeleteResponse, SkillsResponseData, SkillsResponse, SkillsRequest, SkillAddResponse, SkillsSuggestionResponse, SkillsSuggestion } from '@app/types/learner/portfolio';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updatePortfolioInfo(data: any): Promise<string> {
    try {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        const response = await ApiService.fetchDataWithAxios<UpdatePortfolioInfoResponse>({
            url: `/add_portfolio_profile`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any,
        });
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function addResume(data: FormData): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<UpdatePortfolioInfoResponse>({
            url: `/addResume`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: data as any,
        });
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function addBanner(data: FormData): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<UpdatePortfolioInfoResponse>({
            url: `/addBanner`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: data as any,
        });
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchUpdateImage(uploadImage: File): Promise<string> {
    try {
        const formData = new FormData();
        formData.append('image', uploadImage);
        const response = await ApiService.fetchDataWithAxios<UpdatePortfolioInfoResponse>({
            url: `/portfolio_image_upload`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any,
        });
        return response.data.profile_image;
    } catch (error) {

        if (error instanceof Error) {
            throw error.message;
        } else {
            throw 'An unexpected error occurred';
        }
    }
}



export async function userPortfolio(): Promise<UserPortfolio> {
    try {
        const response = await ApiService.fetchDataWithAxios<UserPortfolioResponse>({
            url: '/user-portfolio',
            method: 'get',
        })
        return response?.data;
    } catch (error) {
        throw error as string;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addSocialLinks(data: any): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<PortfolioSocialResponse>({
            url: '/addPortfolioSocial',
            method: 'post',
            data: data
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function addEducation(data: Activity): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function addExperience(data: Activity): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addCertificate(data: any): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addProject(data: any): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

export async function deleteActivity(activityId: number): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivityDeleteResponse>({
            url: `/deletePortfolio`,
            method: 'post',
            data: {
                portfolio_id: activityId
            }
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}

// user skills

export async function getSkillsSuggestions(): Promise<SkillsSuggestion[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<SkillsSuggestionResponse>({
            url: '/skills-list',
            method: 'get',
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function getUserSkills(): Promise<SkillsResponseData[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<SkillsResponse>({
            url: '/skills-mapping-list',
            method: 'get',
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// add user skill
export async function addUserSkill(data: SkillsRequest): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<SkillAddResponse>({
            url: '/add-skill-mapping',
            method: 'post',
            data: data
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// delete user skill
export async function deleteUserSkill(skillId: number): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<SkillAddResponse>({
            url: '/delete-skill-mapping',
            method: 'post',
            data: {
                id: skillId
            }
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}
