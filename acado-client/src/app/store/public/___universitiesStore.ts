import { UniversityDetails, Organization } from '@app/types/common/university'
import { AppliedUniversityData } from '@app/types/learner/appliedUniversityList'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


type UniversitiesState = {
    universities: Organization[]
    setUniversities: (universities: Organization[]) => void
    showAll: boolean;
    setShowAll: (showAll: boolean) => void;
    error: string | null;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    noFound: boolean;
    setNoFound: (noFound: boolean) => void;
}

export const useUniversitiesStore = create<UniversitiesState>()(
    persist(
        (set) => ({
            universities: [],
            setUniversities: (universities: Organization[]) => set({ universities }),
            showAll: false,
            setShowAll: (showAll: boolean) => set({ showAll }),
            error: null,
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            noFound: false,
            setNoFound: (noFound: boolean) => set({ noFound }),
        }),
        {
            name: 'universitiesStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);


// university details store

type UniversityDetailsState = {
    universityDetails: UniversityDetails | null
    setUniversityDetails: (universityDetails: UniversityDetails) => void
    error: string | null;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useUniversityDetailsStore = create<UniversityDetailsState>()(
    persist(
        (set) => ({
            universityDetails: null,
            setUniversityDetails: (universityDetails: UniversityDetails) => set({ universityDetails }),
            error: null,
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'universityDetailsStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);

// applied universities store

type AppliedUniversitiesState = {
    appliedUniversities: AppliedUniversityData[]
    setAppliedUniversities: (appliedUniversities: AppliedUniversityData[]) => void
    error: string | null;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useAppliedUniversitiesStore = create<AppliedUniversitiesState>()(
    persist(
        (set) => ({
            appliedUniversities: [],
            setAppliedUniversities: (appliedUniversities: AppliedUniversityData[]) => set({ appliedUniversities }),
            error: null,
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'appliedUniversitiesStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
