import React from 'react';
import { useAuth } from '@app/providers/auth';
import Blogs from '@learner/dashboard/partials/Blogs';
import ContinueLearning from '@learner/dashboard/partials/ContinueLearning';
import InterestArea from '@learner/dashboard/partials/InterestArea';
import News from '@learner/dashboard/partials/News';
import UniversityCourses from '@learner/dashboard/partials/UniversityCourses';
import Events from './partials/Events';
import { FaChevronRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    // Check if screen width is less than 1024px (Mobile & Tablet)
    const isMobile = useMediaQuery({ maxWidth: 1024 });

    return (
        <div className="p-3">
            {/* Greeting Box */}
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-center sm:text-left">
                <h2 className="text-primary dark:text-primary capitalize">Hey {user.name}!</h2>
                <p className="text-gray-700 dark:text-gray-100 text-sm sm:text-base">
                    Dream & Discover - Your Global Education Guide, Always Here For You!
                </p>
            </div>
            {/* Render Different Layouts Based on Screen Size */}
            {isMobile ? <MobileLayout /> : <DesktopLayout />}
        </div>
    );
};

export default DashboardPage;

const DesktopLayout = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-6 py-6">
            <div className="col-span-2">
                <ContinueLearning />
                <UniversityCourses />
                <Blogs />
                <News />
            </div>
            <div className="col-span-1">
                <ProfileCard />
                <InterestArea />
                <Events />
                <ExtraLinks />
            </div>
        </div>
    );
};

const MobileLayout = () => {
    return (
        <div className="flex flex-col gap-1 py-4">
            {/* Move Profile Card on Top */}
            <ProfileCard />
            <ExtraLinks />
            <InterestArea />
            {/* Stack Everything Vertically */}
            <ContinueLearning />
            <UniversityCourses />
            <Blogs />
            <News />
            {/* <Events /> */}
        </div>
    );
};

const ProfileCard = () => {
    const { user } = useAuth();
    return (
        <div className="bg-gray-100 p-4 rounded-lg dark:bg-gray-800">
            <Link to="/portfolio">
                <div className="flex items-center gap-4">
                    <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                        alt={user?.name ?? 'User Avatar'}
                        className="rounded-full w-12 h-12 border border-primary"
                    />
                    <div>
                        <h2 className="text-lg font-semibold capitalize">{user.name}</h2>
                        <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

const ExtraLinks = () => (
    <>
        <div className="bg-gray-100 p-4 rounded-lg dark:bg-gray-800 mt-4 flex justify-between items-center">
            <div>
                <h1 className="text-lg font-semibold">Internships</h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Internships for you</p>
            </div>
            <Link to="/internship" className="flex items-center gap-2 text-primary">
                <FaChevronRight />
            </Link>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg dark:bg-gray-800 mt-4 flex justify-between items-center">
            <div>
                <h1 className="text-lg font-semibold">Scholarship</h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Scholarship for you</p>
            </div>
            <Link to="/learner-scholarship" className="flex items-center gap-2 text-primary">
                <FaChevronRight />
            </Link>
        </div>
    </>
);
