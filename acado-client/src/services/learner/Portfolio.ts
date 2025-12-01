import ApiService from '@services/ApiService'
import { PortfolioSocialResponse, PortfolioSocialResponseData, UserPortfolioResponse, UserPortfolio, PortfolioSocial, ActivityResponseData, ActivitySaveResponse, EducationActivity, ExperienceActivity, CertificateActivity, SkillsResponseData, SkillsRequest, SkillsSuggestion, SkillsResponse, SkillAddResponse, SkillsSuggestionResponse } from '@app/types/learner/portfolio'

export async function addSocialLinks(data: PortfolioSocial): Promise<PortfolioSocialResponseData> {
    try {
        const response = await ApiService.fetchDataWithAxios<PortfolioSocialResponse>({
            url: '/addPortfolioSocial',
            method: 'post',
            data: data
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


export async function userPortfolio(): Promise<UserPortfolio> {
    try {
        const response = await ApiService.fetchDataWithAxios<UserPortfolioResponse>({
            url: '/user-portfolio',
            method: 'get',
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function addEducationActivity(data: EducationActivity): Promise<ActivityResponseData> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function addExperienceActivity(data: ExperienceActivity): Promise<ActivityResponseData> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function addCertificateActivity(data: any): Promise<ActivityResponseData> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: '/addProfessional',
            method: 'post',
            data: data,
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

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

export async function uploadResume(file: File): Promise<any> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/addResume',
            method: 'post',
            data: formData as unknown as Record<string, unknown>,
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function deleteActivity(activityId: number): Promise<ActivityResponseData> {
    try {
        const response = await ApiService.fetchDataWithAxios<ActivitySaveResponse>({
            url: `/deletePortfolio`,
            method: 'post',
            data: {
                portfolio_id: activityId
            }
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


// skills service


// 1. Suggestions of skills
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

// user skills
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
export async function deleteUserSkill(skillId: string): Promise<string> {
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
