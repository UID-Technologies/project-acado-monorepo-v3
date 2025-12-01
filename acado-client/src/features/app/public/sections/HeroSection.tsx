import React, { memo } from 'react'
import { Link } from 'react-router-dom'

const HeroSection: React.FC = () => {
    return (
        <div className="grid md:grid-cols-2 gap-4 p-0 sm:p-4">
            <div className="p-0 sm:px-4 py-4 md:py-16">
                <h1 className="text-2xl md:text-4xl font-bold dark:text-darkPrimary text-lightPrimary leading-[2rem] md:leading-[3rem]">
                    Gain Unmatched Insights
                </h1>
                <h1 className="text-2xl md:text-4xl text-dark dark:text-light leading-[2rem] md:leading-[3rem]">
                    and Make Better
                    <br /> Admissions Decisions!
                </h1>
                <div className="mt-8">
                    <svg
                        className="w-[100%] md:w-[483px]"
                        height="26"
                        viewBox="0 0 483 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0.113249 3L3 0.113249L5.88675 3L3 5.88675L0.113249 3ZM482.887 23L480 25.8868L477.113 23L480 20.1132L482.887 23ZM317.751 17.9283L318.048 17.5258L317.751 17.9283ZM304.38 8.07175L304.083 8.47422L304.38 8.07175ZM3 2.5L288.953 2.50001V3.50001L3 3.5L3 2.5ZM304.677 7.66929L318.048 17.5258L317.454 18.3307L304.083 8.47422L304.677 7.66929ZM333.178 22.5H480V23.5H333.178V22.5ZM318.048 17.5258C322.431 20.7569 327.733 22.5 333.178 22.5V23.5C327.52 23.5 322.009 21.6885 317.454 18.3307L318.048 17.5258ZM288.953 2.50001C294.611 2.50001 300.122 4.31149 304.677 7.66929L304.083 8.47422C299.7 5.24314 294.398 3.50001 288.953 3.50001V2.50001Z"
                            fill="#BCF035"
                        />
                    </svg>
                    <p className="text-dark dark:text-light text-lg md:w-80">
                        Join a close-knit community of applicants and university
                        ecosystem.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <OfferCard
                        title="Explore Course Finder"
                        description="Create Portfolio and find best-fit courses"
                        label="For Students"
                        bgClass="bg-gradient-to-tr from-[#2c2c2c] to-[#0c0c0c]"
                        labelBgClass="bg-lightPrimary dark:bg-darkPrimary"
                    />
                    <OfferCard
                        title="Explore Talent Finder"
                        description="Set criteria and find best-fit talent"
                        label="For Universities"
                        bgClass="bg-gradient-to-tr dark:from-[#2c2c2c] dark:to-[#0c0c0c]"
                        labelBgClass="bg-darkPrimary dark:bg-lightPrimary"
                    />
                </div>
            </div>
            <div
                className="flex md:flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/acado/home/ellipse.png')`,
                }}
            >
                <div className="grid grid-cols-2 md:grid-cols-2 text-center w-[90%] sm:w-[70%] gap-4">
                    <div>
                        <LinkCard
                            to="/community"
                            imgSrc="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/acado/home/1.png"
                            altText="banner1"
                            description="Join Community of Alumni and successful graduates"
                        />
                        <LinkCard
                            to="/portfolio"
                            imgSrc="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/acado/home/2.png"
                            altText="banner2"
                            description="Showcases Your Skills and Achievements!"
                        />
                    </div>
                    <div className='mt-8'>
                        <LinkCard
                            to="/courses"
                            imgSrc="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/acado/home/3.png"
                            altText="banner3"
                            description="Find right-fit course and apply"
                        />
                        <StaticCard
                            imgSrc="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/acado/home/4.png"
                            altText="banner4"
                            description="Get Highlighted in University Talent Finder"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const OfferCard: React.FC<{
    title: string
    description: string
    label: string
    bgClass: string
    labelBgClass: string
}> = ({ title, description, label, bgClass, labelBgClass }) => {
    return (
        <div className="card-gradient-border">
            <div
                className={`content ${bgClass} p-4 text-center relative border border-gray-700 rounded-md`}
            >
                <div
                    className={`absolute top-0 left-0 ${labelBgClass} py-[2px] px-[4px] rounded-tl-lg rounded-br-lg`}
                >
                    <p className="text-black text-[10px]">{label}</p>
                </div>
                <h1 className="font-bold text-sm text-lightPrimary dark:text-darkPrimary">
                    {title}
                </h1>
                <p className="text-textDark text-[10px]">{description}</p>
            </div>
        </div>
    )
}

const LinkCard: React.FC<{
    to: string
    imgSrc: string
    altText: string
    description: string
}> = ({ to, imgSrc, altText, description }) => {
    return (
        <Link
            to={to}
            className="flex flex-col justify-center items-center mb-4"
        >
            <img src={imgSrc} alt={altText} className="w-40" />
            <p className="text-white">{description}</p>
        </Link>
    )
}

const StaticCard: React.FC<{
    imgSrc: string
    altText: string
    description: string
}> = ({ imgSrc, altText, description }) => {
    return (
        <div className="flex flex-col justify-center items-center mb-3">
            <img src={imgSrc} alt={altText} className="w-40" />
            <p className="text-white">{description}</p>
        </div>
    )
}

export default memo(HeroSection)
