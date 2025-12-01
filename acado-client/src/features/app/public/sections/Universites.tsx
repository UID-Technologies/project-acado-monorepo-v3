import React from 'react';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { MapPinIcon } from 'lucide-react';
import { FaGlobeEurope } from 'react-icons/fa';
import { useUniversities } from '@app/hooks/data/useUniversity';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import LoadingSection from '@/components/LoadingSection';

const University: React.FC = () => {

    const { data: universities = [], isError, isLoading } = useUniversities();

    if (!isLoading && (isError || universities.length === 0)) {
        return null;
    }

    return (
        <div className='p-3 text-center'>
            <h1 className='text-2xl mt-16 mb-8 md:text-4xl font-bold dark:text-darkPrimary text-lightPrimary leading-[2rem] md:leading-[3rem]'>
                Explore University Rankings and Programs
            </h1>
            <div>
                <LoadingSection isLoading={isLoading} title="Universities" />
            </div>
            {
                !isLoading && universities.length > 0 &&
                <div>
                    <Swiper
                        modules={[Navigation, Pagination, A11y]}
                        spaceBetween={50}
                        slidesPerView={3}
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                        loop={true}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {Array.isArray(universities) &&
                            universities.map((university, index) => (
                                <SwiperSlide key={index}>
                                    <Link to={`/universities/${university.id}`}>
                                        <Card
                                            className={`overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 bg-white text-gray-900 hover:bg-gray-50 h-48`}
                                        >
                                            <div className="p-6">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <img
                                                        src={university.logo}
                                                        alt={`${university.name} logo`}
                                                        className="w-16 h-16 rounded-full shadow-lg object-cover bg-white"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src =
                                                                "https://ui-avatars.com/api/?name=" + university.name + "&background=random&color=fff";
                                                        }}
                                                    />
                                                    <div>
                                                        <h2 className="text-sm font-semibold line-clamp-2 text-left">
                                                            {university.name}
                                                        </h2>
                                                        <p className={`text-xs dark:text-gray-300 text-gray-600 line-clamp-1 text-left`}>
                                                            {university.org_description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className={`text-sm dark:text-gray-300 text-gray-600`}>
                                                    <div className="flex items-start mb-3 text-left">
                                                        <MapPinIcon size={20} />
                                                        <p className="line-clamp-2 ml-2">{university.address}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-left">
                                                        <FaGlobeEurope size={20} />
                                                        <span>
                                                            {university.city}, {university.country_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                    <div className='mt-8'>
                        <Link to='/universities'>
                            <Button variant='plain' className='rounded-full bg-transparent border-primary border-2 hover:border hover:border-primary hover:bg-primary hover:dark:text-dark dark:text-white hover:text-white'>
                                Explore all Universities
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        </div>
    );
}

export default University;
