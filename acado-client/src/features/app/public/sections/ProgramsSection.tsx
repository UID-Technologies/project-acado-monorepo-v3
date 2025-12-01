import React, { useMemo, useState } from 'react'
import ProgramCard from '@public/components/ui/ProgramCard'
import { Link } from 'react-router-dom'
import { FaCaretRight } from 'react-icons/fa'
import { Container } from '@/components/shared'
import { useUniversities } from '@app/hooks/data/useUniversity'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/shadcn/button'
import LoadingSection from '@/components/LoadingSection'
import { useCourseCategories, useCourses } from '@app/hooks/data/useCourses'
import { DegreeFilter } from '@app/types/public/lmsCourses'

const ITEMS_PER_PAGE = 8;
const ProgramsSection: React.FC = () => {

    // filters
    const [selectedUniversity, setSelectedUniversity] = useState<string>('');
    const [selectedDegree, setSelectedDegree] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const params = useMemo(() => {
        const p = new URLSearchParams()
        if (selectedUniversity) p.append('org_id', selectedUniversity)
        if (selectedDegree) p.append('cat_id', selectedDegree)
        p.append('items', ITEMS_PER_PAGE.toString())
        p.append('page', '1')
        return p
    }, [selectedUniversity, selectedDegree])

    const { data: coursesData, isLoading, isError } = useCourses(params);
    const courses = coursesData?.data || [];
    const pagination = coursesData?.pagination;
    const degrees = pagination?.degree_filter;


    return (
        <div className="px-4 py-4 md:pt-16 md:pb-8 relative">
            <div className="absolute top-[-10px] left-4 w-full">
                <div className="relative pb-5 overflow-hidden">
                    <h1 className="text-1xl md:text-2xl dark:text-primary text-primary leading-[40px] md:leading-[3rem]">
                        <span className="text-black dark:text-white">
                            Explore
                        </span>{' '}
                        4000+ Global Programs
                    </h1>
                    <Link to="/courses" className="relative z-10">
                        <button className="bg-primary text-ac-dark px-8 py-2 rounded-lg mt-4 cursor-pointer">
                            Explore Programs
                        </button>
                    </Link>
                    <div className="hidden sm:block sm:absolute sm:bottom-0 sm:left-0">
                        <svg
                            height="78"
                            viewBox="0 0 1224 78"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0.113249 75L3 77.8867L5.88675 75L3 72.1133L0.113249 75ZM1223.39 3L1220.5 0.113249L1217.61 3L1220.5 5.88675L1223.39 3ZM271.232 18.7181L270.773 18.5203L271.232 18.7181ZM253.768 59.2819L253.308 59.0842L253.768 59.2819ZM3 75.5H229.887V74.5H3V75.5ZM254.227 59.4796L271.692 18.9158L270.773 18.5203L253.308 59.0842L254.227 59.4796ZM295.113 3.5H1220.5V2.5H295.113V3.5ZM271.692 18.9158C275.72 9.56086 284.928 3.5 295.113 3.5V2.5C284.528 2.5 274.959 8.79854 270.773 18.5203L271.692 18.9158ZM229.887 75.5C240.472 75.5 250.041 69.2014 254.227 59.4796L253.308 59.0842C249.28 68.4391 240.072 74.5 229.887 74.5V75.5Z"
                                fill="#BCF035"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* courses */}

            <div className="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4  gap-x-4 gap-y-10 ">
                <div className="col-span-1 lg:col-span-3 xl:col-span-4 space-y-6">
                    <div className="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        <Container>
                            <div className="mt-24 sm:mt-28">
                                <div className="hidden sm:block">
                                    <h1 className="dark:text-white font-semibold text-lightPrimary text-4xl md:text-3xl leading-[3rem] md:leading-[3rem]">
                                        Get personalized
                                    </h1>
                                    <h1 className="dark:text-darkPrimary font-semibold text-lightPrimary text-4xl md:text-3xl leading-[3rem] md:leading-[3rem]">
                                        Recommendations Based On Your Goal
                                    </h1>
                                </div>
                            </div>
                        </Container>
                        <Degrees degrees={degrees!} selectedDegree={selectedDegree} setSelectedDegree={setSelectedDegree} />
                        <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                        <Universities selectedUniversity={selectedUniversity} setSelectedUniversity={setSelectedUniversity} />
                    </div>
                </div>
                <div className="col-span-4">
                    <h1 className="dark:text-white text-2xl font-bold mb-0">Courses</h1>
                </div>
                {isLoading && <div className="col-span-4"> <LoadingSection isLoading={isLoading} title='Courses' /> </div>}
                {
                    courses?.map((course, key) => (
                        <Link key={key} to={`/course/${course?.id}`}>
                            <ProgramCard program={course} />
                        </Link>
                    ))
                }
            </div>
            {
                !isLoading && !isError && courses && courses?.length <= 0 && <div className="flex justify-center mt-8">
                    <h1 className="text-gray-500">No courses found</h1>
                </div>
            }
            {
                courses && courses?.length > 0 &&
                <Link
                    to="/courses"
                    className="relative z-10 flex justify-center between w-full"
                >
                    <button className="bg-primary text-ac-dark px-8 py-2 rounded-lg mt-8 cursor-pointer ">
                        View More
                    </button>
                </Link>
            }
        </div>
    )
}

export default ProgramsSection


interface UniversitiesProps {
    selectedUniversity: string;
    setSelectedUniversity: (id: string) => void;
}

const Universities: React.FC<UniversitiesProps> = ({ selectedUniversity, setSelectedUniversity }) => {

    const { data: universities = [], isLoading } = useUniversities();

    const handleUniversitySelect = (id: string) => {
        if (selectedUniversity === id) {
            setSelectedUniversity('');
        } else {
            setSelectedUniversity(id);
        }
    }

    return (
        <Card className='bg-white shadow-md dark:bg-[#13200C] flex flex-col justify-between h-full'>
            <CardHeader>
                <h6 className="dark:text-white text-lg font-light"> Courses by <br /> <span className="dark:text-white text-2xl font-bold">Universities</span></h6>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 flex-grow">
                <LoadingSection isLoading={isLoading} title='Universities...' className='border-none' />
                {
                    universities && universities?.map((university, key) => (
                        <Button key={`university-filter-${key}`} variant={'outline'} size='lg' className={`rounded-full w-full truncate border-primary text-primary hover:bg-primary hover:dark:text-black hover:text-white ${selectedUniversity === university.id?.toString() ? 'bg-primary text-black dark:text-ac-dark' : 'dark:text-darkPrimary'}`}
                            onClick={() => handleUniversitySelect(university?.id?.toString())}
                        >
                            {university?.name}
                        </Button>
                    ))
                }
            </CardContent>
            {
                universities && universities?.length > 0 && <CardFooter className='flex justify-end'>
                    <Link
                        to="/courses"
                        className="text-darkPrimary flex justify-center items-center"
                    >
                        View All <FaCaretRight />
                    </Link>
                </CardFooter>
            }
        </Card >
    )
}


interface CategoriesProps {
    selectedCategory: string;
    setSelectedCategory: (id: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ selectedCategory, setSelectedCategory }) => {

    const { data: coursesCategory = [], isLoading } = useCourseCategories();


    const handleCategorySelect = (id: string) => {
        if (selectedCategory === id) {
            setSelectedCategory('');
        } else {
            setSelectedCategory(id);
        }
    }

    return (
        <Card className='bg-white shadow-md dark:bg-[#13200C] flex flex-col justify-between h-full'>
            <CardHeader>
                <h6 className="dark:text-white text-lg font-light"> Courses by <br /> <span className="dark:text-white text-2xl font-bold">Category</span></h6>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 flex-grow">
                <LoadingSection isLoading={isLoading} title='Categories...' />
                <div className='flex flex-wrap gap-2'>
                    {
                        coursesCategory && coursesCategory?.slice(0, 5)?.map((degree, key) => (
                            <Button key={`category-filter-${key}`} variant={'outline'} size='lg' className={`px-3 rounded-full truncate border-primary text-primary hover:bg-primary hover:dark:text-black hover:text-white ${selectedCategory === degree?.id?.toString() ? 'bg-primary text-black dark:text-ac-dark' : 'dark:text-darkPrimary'}`}
                                onClick={() => handleCategorySelect(degree?.id?.toString())}
                            >
                                {degree.name}
                            </Button>
                        ))
                    }
                </div>
            </CardContent>
            {
                coursesCategory && coursesCategory?.length > 0 && <CardFooter className='flex justify-end'>
                    <Link
                        to="/courses"
                        className="text-darkPrimary flex justify-center items-center"
                    >
                        View All <FaCaretRight />
                    </Link>
                </CardFooter>
            }
        </Card >
    )
}


interface DegreesProps {
    selectedDegree: string;
    setSelectedDegree: (degree: string) => void;
    degrees: DegreeFilter;
}


const Degrees: React.FC<DegreesProps> = ({ degrees, selectedDegree, setSelectedDegree }) => {

    const handleDegreeSelect = (degree: string) => {
        if (selectedDegree === degree) {
            setSelectedDegree('');
        } else {
            setSelectedDegree(degree);
        }
    }

    return (
        <Card className='bg-white shadow-md dark:bg-[#13200C] flex flex-col justify-between h-full'>
            <CardHeader>
                <h6 className="dark:text-white text-lg font-light"> Courses by <br /> <span className="dark:text-white text-2xl font-bold">Degree</span></h6>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 flex-grow">
                <div className='flex flex-wrap gap-2'>
                    <Button key={`degree-filter`} variant={'outline'} size='lg' className={`px-3 rounded-full truncate border-primary text-primary hover:bg-primary hover:dark:text-black hover:text-white ${selectedDegree === 'bachelor' ? 'bg-primary text-black dark:text-ac-dark' : 'dark:text-darkPrimary'}`}
                        onClick={() => handleDegreeSelect('bachelor')}
                    >
                        Bachelor’s Degree
                    </Button>
                    <Button key={`degree-filter-2`} variant={'outline'} size='lg' className={`px-3 rounded-full truncate border-primary text-primary hover:bg-primary hover:dark:text-black hover:text-white ${selectedDegree === 'master' ? 'bg-primary text-black dark:text-ac-dark' : 'dark:text-darkPrimary'}`}
                        onClick={() => handleDegreeSelect('master')}
                    >
                        Master’s Degree
                    </Button>
                    <Button key={`degree-filter-3`} variant={'outline'} size='lg' className={`px-3 rounded-full truncate border-primary text-primary hover:bg-primary hover:dark:text-black hover:text-white ${selectedDegree === 'diploma' ? 'bg-primary text-black dark:text-ac-dark' : 'dark:text-darkPrimary'}`}
                        onClick={() => handleDegreeSelect('diploma')}
                    >
                        Diploma
                    </Button>
                </div>
            </CardContent>
            {
                degrees && <CardFooter className='flex justify-end'>
                    <Link
                        to="/courses"
                        className="text-darkPrimary flex justify-center items-center"
                    >
                        View All <FaCaretRight />
                    </Link>
                </CardFooter>
            }
        </Card >
    )
}
