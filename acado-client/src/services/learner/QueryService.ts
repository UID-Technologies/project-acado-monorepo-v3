import { QueryRequest, QueryResponse, QueryRequestResponse, Query } from '@app/types/learner/mailbox';
import ApiService from '@services/ApiService'

export async function addQuery(data: QueryRequest): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<QueryRequestResponse>({
            url: '/create-query',
            method: 'post',
            data: data
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


export async function getQueries(): Promise<Query[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<QueryResponse>({
            url: '/get-query',
            method: 'post',
            data: {
                is_api: '1'
            }
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}
