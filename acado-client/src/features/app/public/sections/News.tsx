import React from 'react'
import { BiCalendar } from 'react-icons/bi'
import { FiWatch } from 'react-icons/fi'
import default_news from '@/assets/images/default_news.png'
import metropolia_news from '@/assets/images/metropolia_news.png'

const News = () => {
    return (
        <div className="p-3 overflow-hidden mt-14">
            <div className="grid md:grid-cols-4 gap-4 p-4">
                <div className="md:col-span-2 relative">
                    <h1 className="text-2xl md:text-4xl font-bold dark:text-white text-dark  leading-[2rem] md:leading-[3rem]">
                        Maximize Your Chances of Getting into Your{' '}
                        <span className="dark:text-darkPrimary text-lightPrimary">
                            Dream College
                        </span>{' '}
                        with Our{' '}
                        <span className="dark:text-darkPrimary text-lightPrimary">
                            Insider Knowledge!
                        </span>
                    </h1>
                    <div className="flex flex-wrap gap-3 mt-4">
                        <button className="border-2 rounded-full text-primary border-primary px-8 py-2">
                            Attend Events
                        </button>
                        <button className="border-2 rounded-full text-primary border-primary px-8 py-2">
                            Participate in Discussions
                        </button>
                        <button className="border-2 rounded-full text-primary border-primary px-8 py-2">
                            Expert Advice
                        </button>
                    </div>
                    <div className="absolute left-0 bottom-0 md:bottom-auto mt-6">
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
                <div className="md:col-span-1 mt-24 md:mt-0 z-10 dark:bg-gray-900 bg-white">
                    <div className="max-w-sm rounded overflow-hidden shadow-lg">
                        <img
                            className="w-full h-48"
                            src={metropolia_news}
                            alt="Sunset in the mountains"
                        />
                        <div className="px-4 py-4">
                            <p className="dark:text-gray-300">
                                Exchange studies in Ostrava deepening
                                professional skills in civil engineering
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Heidi Hellgren, a civil engineering student
                                at Metropolia, went on...
                            </p>
                        </div>
                        <div className="pt-4 pb-2 border-t">
                            <ul className="px-4">
                                <li className="flex mb-2 items-center gap-3 md:gap-2">
                                    <BiCalendar className="text-[20px] text-primary" />
                                    <span className="text-[10px]">
                                        Thursday 19 Dec 2024
                                    </span>
                                </li>
                                <li className="flex mb-2 items-center gap-3 md:gap-2">
                                    <FiWatch className="text-[20px] text-primary" />
                                    <span className="text-[10px]">
                                        03:50 AM - 04:00 PM
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-1 mt-24 md:mt-0 z-10 dark:bg-gray-900 bg-white">
                    <div className="max-w-sm rounded overflow-hidden shadow-lg">
                        <img
                            className="w-full h-48"
                            src={default_news}
                            alt="Sunset in the mountains"
                        />
                        <div className="px-4 py-4 ">
                            <p className="dark:text-gray-300">
                                More than 800 graduates were celebrated at
                                {`Metropolia's`} Autumn 2024
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                More than 800 graduating students from the
                                fields...
                            </p>
                        </div>
                        <div className="pt-4 pb-2 border-t">
                            <ul className="px-4">
                                <li className="flex mb-2 items-center gap-3 md:gap-2">
                                    <BiCalendar className="text-[20px] text-primary" />
                                    <span className="text-[10px]">
                                        Thursday 19 Dec 2024
                                    </span>
                                </li>
                                <li className="flex mb-2 items-center gap-3 md:gap-2">
                                    <FiWatch className="text-[20px] text-primary" />
                                    <span className="text-[10px]">
                                        03:50 AM - 04:00 PM
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default News