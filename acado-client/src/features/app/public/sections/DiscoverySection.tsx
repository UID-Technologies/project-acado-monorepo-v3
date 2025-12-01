import React from "react";
import helpPhone from "@/assets/images/help_phone.png";
import { Link } from "react-router-dom";

const DiscoverySection: React.FC = () => {

    return (
        <div className='relative mt-40 mb-28 md:my-32 px-5'>
            <div className='dark:bg-lightPrimary h-[317px] bg-darkPrimary rounded-lg pt-36 md:pt-8 md:px-8 text-center md:text-start'>
                <div className='grid md:grid-cols-2 gap-4 p-4'>
                    <div>
                        <h1 className='text-2xl md:text-[36px] font-bold leading-[2rem] md:leading-[3rem] text-white'>Course Discovery Tool</h1>
                        <p className='text-1xl md:text-[22px] dark:text-white text-black'>Answer a few questions and our program matching tool will do the rest!</p>
                        <Link to='/sign-in'>
                            <button className='dark:bg-darkPrimary bg-lightPrimary text-white dark:text-black px-8 py-2 rounded-lg mt-4'>Start Learning</button>
                        </Link>
                    </div>
                    <div className='md:relative'>
                        <img src={helpPhone} alt="course discovery" className='w-[80%] absolute top-[-150px] md:top-[-100px] md:right-0' />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default DiscoverySection;