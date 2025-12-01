import ApiService from '@services/ApiService';
import { PortfolioDataResponse } from '@app/types/learner/portfolioBasicInfo';

export async function fetchPortfolioInfo(data: any): Promise<PortfolioDataResponse[]> {
    try {
        const formData = new FormData();


        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        const response = await ApiService.fetchDataWithAxios<PortfolioDataResponse[]>({
            url: `/add_portfolio_profile`,
            method: 'post',
            data: formData as any,

        });

        return response;
    } catch (error) {
        throw error as string;
    }
}


export async function fetchUpdateImage(uploadImage: File): Promise<PortfolioDataResponse[]> {
    try {
        const formData = new FormData();
        formData.append('image', uploadImage);

        const response = await ApiService.fetchDataWithAxios<PortfolioDataResponse[]>({
            url: `/portfolio_image_upload`,
            method: 'post',
            data: formData as any,
            
        });

        return response; 
    } catch (error) {
     
        if (error instanceof Error) {
            throw error.message;
        } else {
            throw 'An unexpected error occurred';
        }
    }
}

