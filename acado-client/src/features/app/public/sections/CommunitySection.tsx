import Com from '@/assets/images/com.png';
import React from 'react';
import { Link } from 'react-router-dom';

const CommunitySection: React.FC = () => {
    return (
        <Link to="/community">
            <div className='pt-24 overflow-hidden'>
                <div className='grid md:grid-cols-2 gap-4 p-4 relative'>
                    <div className='relative'>
                        <h1 className='text-[24px] leading-[36px] text-dark dark:text-light mb-3'>
                            Connect with Your Dream {`College's`}<br /> <span className='text-darkPrimary'>Community</span> of <span className='text-darkPrimary'>Alumni, Students,</span> and <br /><span className='text-darkPrimary'>Industry</span> Leaders!
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
        </Link>
    )
}

export default CommunitySection;