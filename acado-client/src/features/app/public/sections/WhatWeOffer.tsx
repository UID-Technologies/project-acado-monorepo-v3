import img1 from '@/assets/images/what-we-offer/1.png';
import img2 from '@/assets/images/what-we-offer/2.png';
import img3 from '@/assets/images/what-we-offer/3.png';
import img4 from '@/assets/images/what-we-offer/4.png';
import img5 from '@/assets/images/what-we-offer/5.png';
import img6 from '@/assets/images/what-we-offer/6.png';
import img7 from '@/assets/images/what-we-offer/7.png';
import img8 from '@/assets/images/what-we-offer/8.png';

const WhatWeOffer: React.FC = () => {
    return (
        <>
            <h1 className="text-3xl font-semibold text-primary dark:text-primary mb-4">What We Offer</h1>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md hover:transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4">
                        <img src={img1} alt="img1" className="w-14 h-14 mb-3" />
                    </div>
                    <div>
                        <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Access to Top Global Universities</h6>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                            Connect with leading universities worldwide to find the best fit for your career.
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md hover:transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4">
                        <img src={img2} alt="img2" className="w-14 h-14 mb-3" />
                    </div>
                    <div>
                        <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Expert Counseling</h6>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                            Receive personalized guidance from experienced advisors to navigate your study abroad journey.
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md hover:transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4">
                        <img src={img3} alt="img3" className="w-14 h-14 mb-3" />
                    </div>
                    <div>
                        <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Study Abroad Support</h6>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                            Get end-to-end support for a seamless and successful study abroad experience.
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md hover:transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4">
                        <img src={img4} alt="img4" className="w-14 h-14 mb-3" />
                    </div>
                    <div>
                        <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Alumni Network</h6>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                            Join a vast network of alumni to gain insights and connections from those who've been there.
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md hover:transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4">
                        <img src={img5} alt="img5" className="w-14 h-14 mb-3" />
                    </div>
                    <div>
                        <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Career Guidance</h6>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                            Plan your career path with expert advice tailored to your field and goals.
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md hover:transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4">
                        <img src={img6} alt="img6" className="w-14 h-14 mb-3" />
                    </div>
                    <div>
                        <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Application Tracking</h6>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                            Stay on top of your application progress with our real-time tracking system.
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md hover:transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4">
                        <img src={img7} alt="img7" className="w-14 h-14 mb-3" />
                    </div>
                    <div>
                        <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Language Preparation</h6>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                            Sharpen your language skills to ensure you’re ready for international study.
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md hover:transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4">
                        <img src={img8} alt="img8" className="w-14 h-14 mb-3" />
                    </div>
                    <div>
                        <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Test Prep Resources</h6>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                            Access comprehensive resources to excel in exams like IELTS, TOEFL, GRE, and more.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WhatWeOffer;