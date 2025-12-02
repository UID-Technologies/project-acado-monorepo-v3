import React, { useMemo, useState } from 'react'
import ProgramCard from '@public/components/ui/ProgramCard'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useUniversities } from '@app/hooks/data/useUniversity'
import { useCourseCategories, useCourses } from '@app/hooks/data/useCourses'
import LoadingSection from '@/components/LoadingSection'
import { Course } from '@app/types/public/lmsCourses'
import { Input } from '@/components/ui/shadcn/input'
import { PiEmpty } from 'react-icons/pi'
import { Button } from '@/components/ui/shadcn/button'

const ITEMS_PER_PAGE = 50


const Courses: React.FC = () => {

    const [query, setQuery] = useState('')
    const [selectedCountry, setSelectedCountry] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedDegree, setSelectedDegree] = useState('')
    const [selectedUniversity, setSelectedUniversity] = useState('')
    const [isFilterOpen, setIsFilterOpen] = useState(false)


    // Memoized params to avoid re-renders causing re-fetch
    // Note: Using legacy parameter names here - they will be mapped to new API params in the service layer
    const params = useMemo(() => {
        const p = new URLSearchParams()
        if (selectedUniversity) p.append('org_id', selectedUniversity) // Will be mapped to 'universityId'
        if (selectedCountry) p.append('country_id', selectedCountry) // Will be mapped to 'locationId'
        if (selectedDegree) p.append('cat_id', selectedDegree) // Will be mapped to 'categoryId'
        if (query) p.append('query', query) // Will be mapped to 'search'
        p.append('page', currentPage.toString())
        p.append('items', ITEMS_PER_PAGE.toString()) // Will be mapped to 'limit'
        return p
    }, [selectedUniversity, selectedCountry, selectedDegree, query, currentPage])

    const { data: coursesData, isLoading, isError } = useCourses(params)

    const paginationInfo = coursesData?.pagination
    const courses = coursesData?.data || []
    // Support both legacy (last_page) and new API (totalPages) pagination formats
    const totalPages = paginationInfo?.totalPages || paginationInfo?.last_page || 1

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page)
    }

    const clearFilters = () => {
        setSelectedUniversity('')
        setSelectedDegree('')
        setSelectedCountry('')
        setQuery('')
        setCurrentPage(1)
    }
    return (
        <div>
            {/* Top Section - Search Bar */}
            <SearchBar
                query={query}
                setQuery={setQuery}
                onClear={clearFilters}
                onOpenFilters={() => setIsFilterOpen(true)}
            />
            <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {/* Filters */}
                <div>
                    <div
                        className={`fixed top-0 left-0 px-5 md:px-0 md:sticky md:top-44 h-screen md:h-auto w-full md:w-auto bg-white dark:bg-gray-950 transition-transform z-50 md:z-auto md:translate-x-0 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'
                            } overflow-y-auto max-h-screen md:max-h-none scrollbar-none`}
                    >
                        <div className="flex justify-between items-center p-4 md:hidden">
                            <h2 className="text-lg font-bold">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="sm:p-4 sm:space-y-6 md:sticky md:top-32 overflow-y-auto max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)] scrollbar-none mb-10">
                            <div>
                                <h2 className="text-lg text-primary dark:text-primary font-bold mb-3">Universities</h2>
                                <UniversityFilter selectedUniversity={selectedUniversity} setSelectedUniversity={setSelectedUniversity} />
                            </div>
                            <div className='pb-10'>
                                <h2 className="text-lg text-primary dark:text-primary font-bold mb-3">Categories</h2>
                                <CategoryFilter selectedCategory={selectedDegree} setSelectedCategory={setSelectedDegree} />
                            </div>
                        </div>
                    </div>
                    {/* Overlay (for mobile) */}
                    {isFilterOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={() => setIsFilterOpen(false)}></div>
                    )}
                </div>
                {/* Courses List Section */}
                <div className="col-span-4 lg:col-span-5">
                    <div className="rounded-lg p-4">
                        <div className="flex items-center gap-1 justify-between">
                            <div><h2 className="text-lg dark:text-darkPrimary text-lightPrimary mb-3">Courses</h2></div>
                        </div>
                        {/* Course Cards Grid */}
                        <CoursesList courses={courses} loading={isLoading} isError={isError} />
                        {/* Pagination */}
                        {paginationInfo && courses.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

interface SearchBarProps {
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    onClear: () => void;
    onOpenFilters: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onClear, onOpenFilters }) => (
    <div className="sticky top-16 bg-white dark:bg-gray-950 z-10 p-3 border-y dark:border-slate-800 border-slate-200">
        <h1 className="mb-4 text-2xl dark:text-darkPrimary text-lightPrimary">Course Discovery Tool</h1>
        <div className="flex justify-between gap-3">
            <Input
                placeholder="Search for courses"
                value={query}
                className="border bg-gray-200 dark:bg-gray-900 dark:border-slate-800 border-slate-200 p-2 w-full rounded-md"
                onChange={(e) => setQuery(e.target.value)}
            />
            <button className="md:hidden bg-primary text-white px-4 py-2 rounded-lg" onClick={onOpenFilters}>
                Filters
            </button>
            <Button className='dark:text-black text-white' onClick={onClear}>Clear Filter</Button>
        </div>
    </div>
)


interface UniversityFilterProps {
    selectedUniversity: string;
    setSelectedUniversity: React.Dispatch<React.SetStateAction<string>>;
}

const UniversityFilter: React.FC<UniversityFilterProps> = ({ selectedUniversity, setSelectedUniversity }) => {

    const { data: universities = [], isError, isLoading } = useUniversities();
    if (isLoading) return <LoadingSection isLoading={isLoading} title='Universities' description='Loading universities...' />;
    if (isError) return <p className="text-red-500">Failed to load universities.</p>

    return (
        <ul className="space-y-2">
            {universities.map((university) => (
                <label
                    key={university.id}
                    className="flex items-center space-x-2 cursor-pointer"
                >
                    <input
                        type="radio"
                        name="university"
                        value={university.id}
                        checked={
                            selectedUniversity ===
                            university.id.toString()
                        }
                        className="peer shrink-0 h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-primary checked:bg-primary transition-all"
                        onChange={(e) =>
                            setSelectedUniversity(
                                e.target.value,
                            )
                        }
                    />
                    <span>{university.name}</span>
                </label>
            ))}
        </ul>
    )
}

interface CategoryFilterProps {
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}


const CategoryFilter = ({ selectedCategory, setSelectedCategory }: CategoryFilterProps) => {

    const { data: coursesCategory = [], isError, isLoading } = useCourseCategories();
    if (isLoading) return <LoadingSection isLoading={isLoading} title='Categories' description='Loading categories...' />;
    if (isError) return <p className="text-red-500">Failed to load categories.</p>;

    return (
        <ul className="space-y-2">
            {coursesCategory.map((category) => (
                <label
                    key={category.id}
                    className="flex items-center space-x-2 cursor-pointer"
                >
                    <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id.toString()}
                        className="peer shrink-0 h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-primary checked:bg-primary transition-all"
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                    />
                    <span>{category.name}</span>
                </label>
            ))}
        </ul>
    )
}


interface CoursesListProps {
    courses: Course[];
    loading?: boolean;
    isError?: boolean;
    error?: Error;
}


const CoursesList: React.FC<CoursesListProps> = ({ courses, loading, isError }) => {
    if (loading) return <LoadingSection isLoading={loading} title='Courses' description='Loading courses...' />;
    if (isError) return <p className="text-red-500">Failed to load courses.</p>;

    if (courses.length === 0) return (
        <div className="rounded-lg p-4 text-center space-y-10 border rounded-lg mt-10">
            <PiEmpty className="w-16 h-16 mx-auto text-gray-400" />
            <h2 className="text-2xl dark:text-darkPrimary text-lightPrimary mb-4">
                No Courses Found
            </h2>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {courses.map((course, key) => (
                <Link key={key} to={`/courses-show/${course.id}`}>
                    <ProgramCard program={course} />
                </Link>
            ))}
        </div>
    )
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const pages = useMemo(() => {
        const delta = 2
        const range = []
        for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
            range.push(i)
        }
        return range
    }, [currentPage, totalPages])

    return (
        <div className="flex justify-center items-center mt-8 space-x-2">
            <button
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-white disabled:bg-gray-200"
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    className={`px-3 py-1 rounded-md ${currentPage === p ? 'bg-primary text-white' : 'bg-white dark:bg-[#13200C]'}`}
                    onClick={() => onPageChange(p)}
                >
                    {p}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-white disabled:bg-gray-200"
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    )
}

export default Courses
