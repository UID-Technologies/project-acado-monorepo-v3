import Portfolio from '@/assets/images/Portfolio.png'
import React from 'react'
import { Link } from 'react-router-dom'
// sections
import CommunityListSection from '@public/sections/CommunityListSection'
import CommunitySection from '@public/sections/CommunitySection'
import DiscoverySection from '@public/sections/DiscoverySection'
import ProgramsSection from '@public/sections/ProgramsSection'
import University from '@public/sections/Universites'
import Statistics from './sections/Statistics'
import WhatWeOffer from './sections/WhatWeOffer'
import News from './sections/News'
import Events from './sections/Events'
import HeroSection2 from './sections/HeroSection2'
import HeadlineScroller from './sections/HeadlineScroller'

const Home: React.FC = () => {

    return (
        <div>
            <HeadlineScroller></HeadlineScroller>
            <HeroSection2 />
            
            <div className='container mx-auto flex flex-col gap-10 px-4 md:px-3'>
                <Statistics />
                <Events />
                <ProgramsSection />
                {/* section 3 */}
                <DiscoverySection />
                {/* portfolio */}
                <Link to={'/portfolio'}>
                    <div><img src={Portfolio} alt="portfolio" className="w-[100%] sm:pl-24" /></div>
                </Link>
                {/* community */}
                <CommunitySection />
                {/* tech */}
                <CommunityListSection />
                {/* what we offer */}
                <WhatWeOffer />
                {/* news */}
                <News />
                <University />
            </div>
        </div>
    )
}

export default Home
