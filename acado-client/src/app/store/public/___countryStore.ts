
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Country } from '@app/types/public/country';

type CountryState = {
    getCountry: Country[];
    clearCountry: () => void;
    setCountry: (getCountry: Country[]) => void;
    showAll: boolean;
    setShowAll: (showAll: boolean) => void;
    error: string;
    setError: (error: string) => void;
    noFound: boolean;
    setNoFound: (noFound: boolean) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}


export const useCountryStore = create<CountryState>()(
    persist(
        (set) => ({
            getCountry: [],
            setCountry: (getCountry: Country[]) => set({ getCountry }),
            showAll: false,
            setShowAll: (showAll: boolean) => set({ showAll }),
            clearCountry: () => set({ getCountry: [] }),
            error: '',
            setError: (error: string) => set({ error }),
            noFound: false,
            setNoFound: (noFound: boolean) => set({ noFound }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'countryStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);


