import { useQuery } from "@tanstack/react-query";
import { fetchCountry } from "@services/public/CountryService";
import { Country } from "@app/types/public/country";

export const useCountries = () => {
    const queryKey = ['countries'];
    return useQuery<Array<Country>>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await fetchCountry();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
