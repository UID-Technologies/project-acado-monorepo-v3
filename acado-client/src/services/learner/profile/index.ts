import ApiService from '@services/ApiService'
import { PortfolioAddRequest, PortfolioAddResponse, portfolio_profile, UserPortfolioResponse } from '@app/types/learner/profile';

const addProfile = async function fetchAssignmentList(request: PortfolioAddRequest): Promise<PortfolioAddResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<PortfolioAddResponse>({
            url: `add_portfolio_profile`,
            method: 'post',
            data: request
        })
        return response
    } catch (error) {
        throw error as string;
    }
}

const getProfile = async function userPortfolio(): Promise<portfolio_profile> {
    try {
        const response = await ApiService.fetchDataWithAxios<UserPortfolioResponse>({
            url: '/user-portfolio',
            method: 'get',
        })
        return response?.data?.portfolio_profile[0]
    } catch (error) {
        throw error as string;
    }
}


export default {
    addProfile,
    getProfile
}
