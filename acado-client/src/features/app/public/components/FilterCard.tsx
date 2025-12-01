import React from 'react'
import { Link } from 'react-router-dom';
import { FaCaretRight } from "react-icons/fa";
function FilterCard() {
    return (
        <div className='bg-white shadow-md dark:bg-[#13200C] rounded-lg p-4'>
            <h6 className='dark:text-white text-lg'>Courses by</h6>
            <h1 className='dark:text-white text-2xl font-bold'>University</h1>
            <div className="flex flex-wrap mt-8 gap-3">
                <button className='hover:bg-lightPrimary dark:hover:bg-darkPrimary hover:text-light dark:hover:text-dark border-textLight dark:border-darkPrimary border rounded-full text-textLight  dark:text-darkPrimary px-4 py-2'>B.Tech</button>
                <button className='hover:bg-lightPrimary dark:hover:bg-darkPrimary hover:text-light dark:hover:text-dark border-textLight dark:border-darkPrimary border rounded-full text-textLight  dark:text-darkPrimary px-4 py-2'>M.Tech</button>
                <button className='hover:bg-lightPrimary dark:hover:bg-darkPrimary hover:text-light dark:hover:text-dark border-textLight dark:border-darkPrimary border rounded-full text-textLight  dark:text-darkPrimary px-4 py-2'>MBA</button>
                <button className='hover:bg-lightPrimary dark:hover:bg-darkPrimary hover:text-light dark:hover:text-dark border-textLight dark:border-darkPrimary border rounded-full text-textLight  dark:text-darkPrimary px-4 py-2'>Msc</button>
                <button className='hover:bg-lightPrimary dark:hover:bg-darkPrimary hover:text-light dark:hover:text-dark border-textLight dark:border-darkPrimary border rounded-full text-textLight  dark:text-darkPrimary px-4 py-2'>BA</button>
                <button className='hover:bg-lightPrimary dark:hover:bg-darkPrimary hover:text-light dark:hover:text-dark border-textLight dark:border-darkPrimary border rounded-full text-textLight  dark:text-darkPrimary px-4 py-2'>B.Com</button>
                <button className='hover:bg-lightPrimary dark:hover:bg-darkPrimary hover:text-light dark:hover:text-dark border-textLight dark:border-darkPrimary border rounded-full text-textLight  dark:text-darkPrimary px-4 py-2'>BBA</button>
                <button className='hover:bg-lightPrimary dark:hover:bg-darkPrimary hover:text-light dark:hover:text-dark border-textLight dark:border-darkPrimary border rounded-full text-textLight  dark:text-darkPrimary px-4 py-2'>M.Com</button>
            </div>
            <div className='flex justify-end mt-4'>
                <Link to='/' className='text-darkPrimary flex justify-center items-center'>View All <FaCaretRight /></Link>
            </div>
        </div>
    )
}

export default FilterCard