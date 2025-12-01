import React, { useEffect } from 'react';
import { BiCalendar, BiChat } from 'react-icons/bi';
import { CiStopwatch } from "react-icons/ci";
import { FiWatch } from 'react-icons/fi';
import { IoIosPeople } from "react-icons/io";
import ai from "@/assets/images/ai.svg";
import Banner from '@/assets/images/banner.png';
import Com from '@/assets/images/com.png';
import dot from "@/assets/images/dot.svg";
import helpPhone from "@/assets/images/help_phone.png";
import people from "@/assets/images/people.png";
import Portfolio from '@/assets/images/Portfolio.png';
import ProgramCardLogo from '@/assets/images/programs/logo.png';
import ProgramCardImg from '@/assets/images/programs/program1.png';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import FilterCard from '@public/components/FilterCard';
import { useUniversitiesStore } from '@app/store/public/___universitiesStore';
import { fetchUniversities } from '@services/public/UniversitiesService';

const Home: React.FC = () => {

    const { universities, setUniversities } = useUniversitiesStore()

    useEffect(() => {
        const getUniversities = async () => {
            try {
                const universitiesData = await fetchUniversities()
                setUniversities(universitiesData)
            } catch (error) {
                console.error('Error fetching universities:', error)
            }
        }

        getUniversities()
    }, [setUniversities])

    return (
        <div>
            <div className='grid md:grid-cols-2 gap-4 p-4'>
                <div className='px-4 py-4 md:py-16'>
                    <h1 className='text-2xl md:text-4xl font-bold dark:text-darkPrimary text-lightPrimary leading-[2rem] md:leading-[3rem]'>Gain Unmatched Insights</h1>
                    <h1 className='text-2xl md:text-4xl text-dark dark:text-light leading-[2rem] md:leading-[3rem]'>and Make Better<br /> Admissions Decisions!</h1>
                    <div className='mt-8'>
                        <svg className='w-[100%] md:w-[483px]' height="26" viewBox="0 0 483 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.113249 3L3 0.113249L5.88675 3L3 5.88675L0.113249 3ZM482.887 23L480 25.8868L477.113 23L480 20.1132L482.887 23ZM317.751 17.9283L318.048 17.5258L317.751 17.9283ZM304.38 8.07175L304.083 8.47422L304.38 8.07175ZM3 2.5L288.953 2.50001V3.50001L3 3.5L3 2.5ZM304.677 7.66929L318.048 17.5258L317.454 18.3307L304.083 8.47422L304.677 7.66929ZM333.178 22.5H480V23.5H333.178V22.5ZM318.048 17.5258C322.431 20.7569 327.733 22.5 333.178 22.5V23.5C327.52 23.5 322.009 21.6885 317.454 18.3307L318.048 17.5258ZM288.953 2.50001C294.611 2.50001 300.122 4.31149 304.677 7.66929L304.083 8.47422C299.7 5.24314 294.398 3.50001 288.953 3.50001V2.50001Z" fill="#BCF035" />
                        </svg>
                        <p className='text-dark dark:text-light text-lg md:w-80'>
                            Join a close-knit community of applicants and university ecosystem.
                        </p>
                    </div>
                    {/* offer card */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
                        <div className='card-gradient-border '>
                            <div className="content bg-gradient-to-tr from-[#2c2c2c] to-[#0c0c0c] p-4 text-center relative">
                                <div className='absolute top-0 left-0 dark:bg-darkPrimary bg-lightPrimary py-[2px] px-[4px] rounded-tl-lg rounded-br-lg'>
                                    <p className='text-black text-[10px]'>For Students</p>
                                </div>
                                <h1 className='text-darkPrimary font-bold text-sm'>Explore Talent Finder</h1>
                                <p className='text-textDark text-[10px]'>Set criteria and find best-fit talent</p>
                            </div>
                        </div>
                        <div className='card-gradient-border'>
                            <div className="content bg-gradient-to-tr dark:from-[#2c2c2c] dark:to-[#0c0c0c] p-4 text-center relative">
                                <div className='absolute top-0 left-0 dark:bg-lightPrimary bg-darkPrimary py-[2px] px-[4px] rounded-tl-lg rounded-br-lg'>
                                    <p className='text-black text-[10px]'>For Students</p>
                                </div>
                                <h1 className='text-lightPrimary font-bold text-sm'>Explore Talent Finder</h1>
                                <p className='text-textDark text-[10px]'>Set criteria and find best-fit talent</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='md:flex items-center justify-center'>
                    <div>
                        <img src={Banner} alt="banner" className='w-full' />
                    </div>
                </div>
            </div>
            {/* section 2 */}
            <div className='px-4 py-4 md:py-16 relative'>
                {/* top */}
                <div className='absolute top-[-10px] left-0 w-full'>
                    <div className='relative pb-5 overflow-hidden'>
                        <h1 className='text-1xl md:text-2xl dark:text-darkPrimary text-lightPrimary leading-[2rem] md:leading-[3rem]'>
                            <span className='text-black dark:text-white'>Explore</span> 4000+ Global Propgrams
                        </h1>
                        <button className='bg-darkPrimary text-dark px-8 py-2 rounded-lg mt-4'>Explore Propgrams</button>
                        <div className='absolute bottom-0 left-0'>
                            <svg height="78" viewBox="0 0 1224 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.113249 75L3 77.8867L5.88675 75L3 72.1133L0.113249 75ZM1223.39 3L1220.5 0.113249L1217.61 3L1220.5 5.88675L1223.39 3ZM271.232 18.7181L270.773 18.5203L271.232 18.7181ZM253.768 59.2819L253.308 59.0842L253.768 59.2819ZM3 75.5H229.887V74.5H3V75.5ZM254.227 59.4796L271.692 18.9158L270.773 18.5203L253.308 59.0842L254.227 59.4796ZM295.113 3.5H1220.5V2.5H295.113V3.5ZM271.692 18.9158C275.72 9.56086 284.928 3.5 295.113 3.5V2.5C284.528 2.5 274.959 8.79854 270.773 18.5203L271.692 18.9158ZM229.887 75.5C240.472 75.5 250.041 69.2014 254.227 59.4796L253.308 59.0842C249.28 68.4391 240.072 74.5 229.887 74.5V75.5Z" fill="#BCF035" />
                            </svg>
                        </div>
                    </div>
                </div>
                {/* filter */}
                <div className='grid md:grid-cols-4 gap-x-4 gap-y-10'>
                    <div className='mt-24'>
                        <h1 className='dark:text-white font-semibold text-lightPrimary text-4xl md:text-3xl leading-[3rem] md:leading-[3rem]'>Get personalized</h1>
                        <h1 className='dark:text-darkPrimary font-semibold text-lightPrimary text-4xl md:text-3xl leading-[3rem] md:leading-[3rem]'>Recommendations Based On Your Goal</h1>
                    </div>
                    {/* run loop 3 time */}
                    <FilterCard />
                    <FilterCard />
                    <FilterCard />
                    {/* courses card */}
                    <div className="max-w-sm rounded overflow-hidden shadow-lg">
                        <img className="w-full" src={ProgramCardImg} alt="Sunset in the mountains" />
                        <div className="px-6 py-4 dark:bg-[#222222] bg-white">
                            <div className='flex items-center gap-3'>
                                <img src={ProgramCardLogo} alt="logo" className='w-[30px] h-[30px]' />
                                <div className="font-bold text-[10px] dark:text-textDark">Coventry University <br />England</div>
                            </div>
                            <h1 className="font-bold text-[14px] mb-2 mt-4 dark:text-textDark">Architectural Design & Technology M.Sci</h1>
                        </div>
                        {/* icons */}
                        <ul className="px-6 py-4 dark:bg-[#222222] bg-white">
                            <li className="flex mb-2 items-center gap-3 md:gap-2">
                                <CiStopwatch className='text-[20px] dark:text-darkPrimary' />
                                <span className="text-[10px] dark:text-textDark">3 years</span>
                            </li>
                            <li className="flex mb-2 items-center gap-3 md:gap-2">
                                <IoIosPeople className='text-[20px] dark:text-darkPrimary' />
                                <span className="text-[10px] dark:text-textDark">6 specialists Available</span>
                            </li>
                        </ul>
                    </div>
                    <div className="max-w-sm rounded overflow-hidden shadow-lg">
                        <img className="w-full" src={ProgramCardImg} alt="Sunset in the mountains" />
                        <div className="px-6 py-4 dark:bg-[#222222] bg-white">
                            <div className='flex items-center gap-3'>
                                <img src={ProgramCardLogo} alt="logo" className='w-[30px] h-[30px]' />
                                <div className="font-bold text-[10px] dark:text-textDark">Coventry University <br />England</div>
                            </div>
                            <h1 className="font-bold text-[14px] mb-2 mt-4 dark:text-textDark">Architectural Design & Technology M.Sci</h1>
                        </div>
                        {/* icons */}
                        <ul className="px-6 py-4 dark:bg-[#222222] bg-white">
                            <li className="flex mb-2 items-center gap-3 md:gap-2">
                                <CiStopwatch className='text-[20px] dark:text-darkPrimary' />
                                <span className="text-[10px] dark:text-textDark">3 years</span>
                            </li>
                            <li className="flex mb-2 items-center gap-3 md:gap-2">
                                <IoIosPeople className='text-[20px] dark:text-darkPrimary' />
                                <span className="text-[10px] dark:text-textDark">6 specialists Available</span>
                            </li>
                        </ul>
                    </div>
                    <div className="max-w-sm rounded overflow-hidden shadow-lg">
                        <img className="w-full" src={ProgramCardImg} alt="Sunset in the mountains" />
                        <div className="px-6 py-4 dark:bg-[#222222] bg-white">
                            <div className='flex items-center gap-3'>
                                <img src={ProgramCardLogo} alt="logo" className='w-[30px] h-[30px]' />
                                <div className="font-bold text-[10px] dark:text-textDark">Coventry University <br />England</div>
                            </div>
                            <h1 className="font-bold text-[14px] mb-2 mt-4 dark:text-textDark">Architectural Design & Technology M.Sci</h1>
                        </div>
                        {/* icons */}
                        <ul className="px-6 py-4 dark:bg-[#222222] bg-white">
                            <li className="flex mb-2 items-center gap-3 md:gap-2">
                                <CiStopwatch className='text-[20px] dark:text-darkPrimary' />
                                <span className="text-[10px] dark:text-textDark">3 years</span>
                            </li>
                            <li className="flex mb-2 items-center gap-3 md:gap-2">
                                <IoIosPeople className='text-[20px] dark:text-darkPrimary' />
                                <span className="text-[10px] dark:text-textDark">6 specialists Available</span>
                            </li>
                        </ul>
                    </div>
                    <div className="max-w-sm rounded overflow-hidden shadow-lg">
                        <img className="w-full" src={ProgramCardImg} alt="Sunset in the mountains" />
                        <div className="px-6 py-4 dark:bg-[#222222] bg-white">
                            <div className='flex items-center gap-3'>
                                <img src={ProgramCardLogo} alt="logo" className='w-[30px] h-[30px]' />
                                <div className="font-bold text-[10px] dark:text-textDark">Coventry University <br />England</div>
                            </div>
                            <h1 className="font-bold text-[14px] mb-2 mt-4 dark:text-textDark">Architectural Design & Technology M.Sci</h1>
                        </div>
                        {/* icons */}
                        <ul className="px-6 py-4 dark:bg-[#222222] bg-white">
                            <li className="flex mb-2 items-center gap-3 md:gap-2">
                                <CiStopwatch className='text-[20px] dark:text-darkPrimary' />
                                <span className="text-[10px] dark:text-textDark">3 years</span>
                            </li>
                            <li className="flex mb-2 items-center gap-3 md:gap-2">
                                <IoIosPeople className='text-[20px] dark:text-darkPrimary' />
                                <span className="text-[10px] dark:text-textDark">6 specialists Available</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* section 3 */}
            <div className='relative mt-40 mb-28 md:my-32 px-5'>
                <div className='dark:bg-lightPrimary h-[317px] bg-darkPrimary rounded-lg pt-36 md:pt-8 md:px-8 text-center md:text-start'>
                    <div className='grid md:grid-cols-2 gap-4 p-4'>
                        <div>
                            <h1 className='text-2xl md:text-[36px] font-bold leading-[2rem] md:leading-[3rem] text-white'>Course Discovery Tool</h1>
                            <p className='text-1xl md:text-[22px] dark:text-white text-black'>Answer a few questions and our program matching tool will do the rest!</p>
                            <button className='dark:bg-darkPrimary bg-lightPrimary text-white dark:text-black px-8 py-2 rounded-lg mt-4'>Start Machine</button>
                        </div>
                        <div className='md:relative'>
                            <img src={helpPhone} alt="course discovery" className='w-[80%] absolute top-[-150px] md:top-[-100px] md:right-0' />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <img src={Portfolio} alt="portfolio" className='w-full' />
            </div>

            {/* community */}
            <div className='md:pb-24 pt-24 overflow-hidden'>
                <div className='grid md:grid-cols-2 gap-4 p-4 relative'>
                    <div className='relative'>
                        <h1 className='text-[24px] leading-[36px] text-dark dark:text-light mb-3'>
                            Connect with Your Dream College's<br /> <span className='text-darkPrimary'>Community</span> of <span className='text-darkPrimary'>Alumni, Students,</span> and <br /><span className='text-darkPrimary'>Industry</span> Leaders!
                        </h1>
                        <p className='text-[16px] dark:text-white text-black'>Find mentorship and support from successful graduates <br />who share your passion.</p>
                        <button className='text-dark bg-lightPrimary dark:bg-darkPrimary px-8 py-2 rounded-lg mt-4'>  Participate in Community</button>
                        <div className='absolute'>
                            <svg height="78" viewBox="0 0 1224 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.113249 75L3 77.8867L5.88675 75L3 72.1133L0.113249 75ZM1223.39 3L1220.5 0.113249L1217.61 3L1220.5 5.88675L1223.39 3ZM271.232 18.7181L270.773 18.5203L271.232 18.7181ZM253.768 59.2819L253.308 59.0842L253.768 59.2819ZM3 75.5H229.887V74.5H3V75.5ZM254.227 59.4796L271.692 18.9158L270.773 18.5203L253.308 59.0842L254.227 59.4796ZM295.113 3.5H1220.5V2.5H295.113V3.5ZM271.692 18.9158C275.72 9.56086 284.928 3.5 295.113 3.5V2.5C284.528 2.5 274.959 8.79854 270.773 18.5203L271.692 18.9158ZM229.887 75.5C240.472 75.5 250.041 69.2014 254.227 59.4796L253.308 59.0842C249.28 68.4391 240.072 74.5 229.887 74.5V75.5Z" fill="#BCF035" />
                            </svg>
                        </div>
                    </div>
                    <div className='z-10 py-12'>
                        <img src={Com} alt="community" className='w-[100%]' />
                    </div>
                </div>
            </div>

            {/* dream college */}
            <div className='p-3 overflow-hidden'>
                <div className='grid md:grid-cols-4 gap-4 p-4'>
                    <div className='md:col-span-2 relative'>
                        <h1 className='text-2xl md:text-4xl font-bold dark:text-white text-dark  leading-[2rem] md:leading-[3rem]'>
                            Maximize Your Chances of Getting into Your <span className='dark:text-darkPrimary text-lightPrimary'>Dream College</span> with Our <span className='dark:text-darkPrimary text-lightPrimary'>Insider Knowledge!</span>
                        </h1>
                        <div className='flex flex-wrap gap-3 mt-4'>
                            <button className='border-2 rounded-full text-darkPrimary border-darkPrimary px-8 py-2'>Attend Events</button>
                            <button className='border-2 rounded-full text-darkPrimary border-darkPrimary px-8 py-2'>Participate in Discussions</button>
                            <button className='border-2 rounded-full text-darkPrimary border-darkPrimary px-8 py-2'>Expert Advice</button>
                        </div>
                        <div className='absolute left-0 bottom-[-28px] md:bottom-auto'>
                            <svg height="78" viewBox="0 0 1224 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.113249 75L3 77.8867L5.88675 75L3 72.1133L0.113249 75ZM1223.39 3L1220.5 0.113249L1217.61 3L1220.5 5.88675L1223.39 3ZM271.232 18.7181L270.773 18.5203L271.232 18.7181ZM253.768 59.2819L253.308 59.0842L253.768 59.2819ZM3 75.5H229.887V74.5H3V75.5ZM254.227 59.4796L271.692 18.9158L270.773 18.5203L253.308 59.0842L254.227 59.4796ZM295.113 3.5H1220.5V2.5H295.113V3.5ZM271.692 18.9158C275.72 9.56086 284.928 3.5 295.113 3.5V2.5C284.528 2.5 274.959 8.79854 270.773 18.5203L271.692 18.9158ZM229.887 75.5C240.472 75.5 250.041 69.2014 254.227 59.4796L253.308 59.0842C249.28 68.4391 240.072 74.5 229.887 74.5V75.5Z" fill="#BCF035" />
                            </svg>
                        </div>
                    </div>
                    <div className='md:col-span-1 mt-24 md:mt-0 z-10'>
                        <div className="max-w-sm rounded overflow-hidden shadow-lg">
                            <img className="w-full" src={dot} alt="Sunset in the mountains" />
                            <div className="px-6 py-4 bg-white">
                                <div className="font-bold text-lg mb-2">Coventry Degree Show 2022</div>
                                <p className="text-gray-700 text-[10px]">
                                    This seminar will study the market for CEOs of large publicly traded US firms,...
                                </p>
                            </div>
                            <div className="pt-4 pb-2 bg-white border-t">
                                <ul className="px-6 py-4">
                                    <li className="flex mb-2 items-center gap-3 md:gap-2">
                                        <BiCalendar className='text-[20px] dark:text-darkPrimary' />
                                        <span className="text-[10px]">Thursday 12 May 2022 to Friday 28 April 2023</span>
                                    </li>
                                    <li className="flex mb-2 items-center gap-3 md:gap-2">
                                        <FiWatch className='text-[20px] dark:text-darkPrimary' />
                                        <span className="text-[10px]">09:00 AM - 12:00 AM</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='md:col-span-1 z-10'>
                        <div className="max-w-sm rounded overflow-hidden shadow-lg">
                            <img className="w-full" src={dot} alt="Sunset in the mountains" />
                            <div className="px-6 py-4 bg-white">
                                <div className="font-bold text-lg mb-2">Coventry Degree Show 2022</div>
                                <p className="text-gray-700 text-[10px]">
                                    This seminar will study the market for CEOs of large publicly traded US firms,...
                                </p>
                            </div>
                            <div className="pt-4 pb-2 bg-white border-t">
                                <ul className="px-6 py-4">
                                    <li className="flex mb-2 items-center gap-3 md:gap-2">
                                        <BiCalendar className='text-[20px] dark:text-darkPrimary' />
                                        <span className="text-[10px]">Thursday 12 May 2022 to Friday 28 April 2023</span>
                                    </li>
                                    <li className="flex mb-2 items-center gap-3 md:gap-2">
                                        <FiWatch className='text-[20px] dark:text-darkPrimary' />
                                        <span className="text-[10px]">09:00 AM - 12:00 AM</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* tech */}
            <div className='p-3'>
                <div className='grid md:grid-cols-4 gap-4 p-4'>
                    <div className='md:col-span-1'>
                        <div className="max-w-sm rounded overflow-hidden shadow-lg">
                            <img className="w-full" src={ai} alt="Sunset in the mountains" />
                            <div className="px-6 py-4 bg-white">
                                <div className="font-bold text-xl mb-2">Technology</div>
                            </div>
                            <div className="px-6 pt-4 pb-2 border-t bg-white">
                                <ul>
                                    <li className="flex mb-2 items-center gap-3 md:gap-2">
                                        <BiChat className='text-[20px] dark:text-darkPrimary' />
                                        <span className="text-[10px]">32 Discussions</span>
                                    </li>
                                    <li className="flex mb-2 justify-between items-center gap-3 md:gap-2">
                                        <span className="text-[10px] w-full">Expert Talks</span>
                                        <div className='flex gap-2 items-center'>
                                            <span className="text-[10px]">
                                                <img src={people} alt="dot" className='' />
                                            </span>
                                            <span className="text-[10px]">+55</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='md:col-span-1'>
                        <div className="max-w-sm rounded overflow-hidden shadow-lg">
                            <img className="w-full" src={ai} alt="Sunset in the mountains" />
                            <div className="px-6 py-4 bg-white">
                                <div className="font-bold text-xl mb-2">Technology</div>
                            </div>
                            <div className="px-6 pt-4 pb-2 border-t bg-white">
                                <ul>
                                    <li className="flex mb-2 items-center gap-3 md:gap-2">
                                        <BiChat className='text-[20px] dark:text-darkPrimary' />
                                        <span className="text-[10px]">32 Discussions</span>
                                    </li>
                                    <li className="flex mb-2 justify-between items-center gap-3 md:gap-2">
                                        <span className="text-[10px] w-full">Expert Talks</span>
                                        <div className='flex gap-2 items-center'>
                                            <span className="text-[10px]">
                                                <img src={people} alt="dot" className='' />
                                            </span>
                                            <span className="text-[10px]">+55</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='md:col-span-1'>
                        <div className="max-w-sm rounded overflow-hidden shadow-lg">
                            <img className="w-full" src={ai} alt="Sunset in the mountains" />
                            <div className="px-6 py-4 bg-white">
                                <div className="font-bold text-xl mb-2">Technology</div>
                            </div>
                            <div className="px-6 pt-4 pb-2 border-t bg-white">
                                <ul>
                                    <li className="flex mb-2 items-center gap-3 md:gap-2">
                                        <BiChat className='text-[20px] dark:text-darkPrimary' />
                                        <span className="text-[10px]">32 Discussions</span>
                                    </li>
                                    <li className="flex mb-2 justify-between items-center gap-3 md:gap-2">
                                        <span className="text-[10px] w-full">Expert Talks</span>
                                        <div className='flex gap-2 items-center'>
                                            <span className="text-[10px]">
                                                <img src={people} alt="dot" className='' />
                                            </span>
                                            <span className="text-[10px]">+55</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='md:col-span-1'>
                        <div className="max-w-sm rounded overflow-hidden shadow-lg">
                            <img className="w-full" src={ai} alt="Sunset in the mountains" />
                            <div className="px-6 py-4 bg-white">
                                <div className="font-bold text-xl mb-2">Technology</div>
                            </div>
                            <div className="px-6 pt-4 pb-2 border-t bg-white">
                                <ul>
                                    <li className="flex mb-2 items-center gap-3 md:gap-2">
                                        <BiChat className='text-[20px] dark:text-darkPrimary' />
                                        <span className="text-[10px]">32 Discussions</span>
                                    </li>
                                    <li className="flex mb-2 justify-between items-center gap-3 md:gap-2">
                                        <span className="text-[10px] w-full">Expert Talks</span>
                                        <div className='flex gap-2 items-center'>
                                            <span className="text-[10px]">
                                                <img src={people} alt="dot" className='' />
                                            </span>
                                            <span className="text-[10px]">+55</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* swiper */}
            <div className='p-3 text-center'>
                <h1 className='text-2xl mt-24 mb-16 md:text-4xl font-bold dark:text-darkPrimary text-lightPrimary leading-[2rem] md:leading-[3rem]'>
                    Explore University Rankings and Programs
                </h1>

                <Swiper
                    modules={[Navigation, Pagination, A11y]}
                    spaceBetween={50}
                    slidesPerView={4}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    loop={true}
                    navigation
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                >

                    {universities.map((university, index) => (
                        <SwiperSlide key={index}>
                            <div className="max-w-sm rounded overflow-hidden shadow-lg mb-18">
                                <img className="w-full" src={university?.logo} alt={`${university.name} image`} />
                                <div className="px-6 py-4 bg-white">
                                    <div className="font-bold text-xl mb-2">{university.name}</div>
                                    <p className="text-gray-700 text-base">{university.name}</p>
                                </div>
                                <div className="px-6 pt-4 pb-2 border-t bg-white">
                                    <ul>
                                        <li className="flex mb-2 items-center gap-3 md:gap-2">
                                            <BiChat className="text-[20px] dark:text-darkPrimary" />
                                            <span className="text-[10px]">32 Discussions</span>
                                        </li>
                                        <li className="flex mb-2 justify-between items-center gap-3 md:gap-2">
                                            <span className="text-[10px] w-full">Expert Talks</span>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-[10px]">
                                                    <img src={people} alt="people" />
                                                </span>
                                                <span className="text-[10px]">+55</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}

                </Swiper>
            </div>
        </div>
    )
};

export default Home;
