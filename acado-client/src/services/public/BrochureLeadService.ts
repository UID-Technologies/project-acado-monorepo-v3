import ApiService from '@services/ApiService';
import { BrochureApiResponse } from '@app/types/public/brochure';

// export async function fetchBrochure(leadData: BrochureLeadData): Promise<BrochureApiResponse> {
//     try {
//         const response = await ApiService.fetchDataWithAxios<BrochureApiResponse>({
//             url: `save-brochure-log`, 
//             method: 'post',
//             data: leadData as any,
//             headers:{
//                 "Content-Type":'application-json'
//             }
//         });
//         return response;
//     } catch (error) {
//         throw error as string;
//     }
// }

export async function fetchBrochure(data: FormData): Promise<BrochureApiResponse> {
    try {

        const response = await ApiService.fetchDataWithAxios<BrochureApiResponse>({
            url: `save-brochure-log`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: data as any,
        });

        return response;
    } catch (error) {
        throw error as string;
    }
}
