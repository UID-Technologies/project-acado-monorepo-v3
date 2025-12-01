import ApiService from "../ApiService";
import { Country,CountryListResponse } from "@app/types/public/country";


export async function fetchCountry(): Promise<Country[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CountryListResponse>({
            url: `get-country-list`,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}
