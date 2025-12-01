import React, { useEffect, useState } from "react";
import { CiStopwatch } from "react-icons/ci";
import { IoIosPeople } from "react-icons/io";
import ProgramCardLogo from "@/assets/images/programs/logo.png";
import { fetchUniversities } from "@services/public/UniversitiesService";
import { useUniversitiesStore } from "@app/store/public/___universitiesStore";
import TrophYImg from '@/assets/images/trophy.png';
import LocationImg from '@/assets/images/location.png';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type University = {
  term_id: number;
  name: string;
  meta_value: number;
  guid: string | null;
};

const UniversityCard: React.FC<University> = ({ name, guid, meta_value }) => {
  const logoUrl = guid ? guid : ProgramCardLogo;

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        className="w-full object-cover h-[200px]"
        src={logoUrl}
        alt={`${name} logo`}
      />
      <div className="px-6 py-4 dark:bg-[#222222] bg-white">
        <h1 className="font-bold text-[14px] mb-2 mt-4 dark:text-textDark">
          {name}
        </h1>
        <p className="text-[10px] dark:text-textDark">ID: {meta_value}</p>
      </div>
      <ul className="px-6 py-4 dark:bg-[#222222] bg-white">
        <li className="flex mb-2 items-center gap-3 md:gap-2">
          <CiStopwatch className="text-[20px] dark:text-darkPrimary" />
          <span className="text-[10px] dark:text-textDark">
            Unique Term ID: {meta_value}
          </span>
        </li>
        <li className="flex mb-2 items-center gap-3 md:gap-2">
          <IoIosPeople className="text-[20px] dark:text-darkPrimary" />
          <span className="text-[10px] dark:text-textDark">
            University Name: {name}
          </span>
        </li>
      </ul>
    </div>
  );
};

const UniversitiesListing: React.FC = () => {
  const { universities, setUniversities, showAll, setShowAll } = useUniversitiesStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUniversities()
      .then((response) => {
        setUniversities(response);
      })
      .catch((error) => {
        console.error("Failed to fetch universities", error);
      });
  }, [setUniversities]);

  const filteredUniversities = universities.filter((university) =>
    university.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!Array.isArray(universities)) {
    return <div className="text-center col-span-full">Loading...</div>;
  }

  return (
    <div className='p-3 text-start'>
      <h1 className='text-2xl mt-0 mb-16 md:text-4xl font-bold dark:text-darkPrimary text-lightPrimary leading-[2rem] md:leading-[3rem]'>
        Explore University Rankings and Programs
      </h1>


      <div className="absolute top-8 right-6 w-64">
        <input
          type="text"
          placeholder="Search by University Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-md dark:bg-[#222222] dark:text-textDark"
        />
      </div>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={50}
        slidesPerView={4}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
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
          1024: { slidesPerView: 4 },
        }}
      >
        {filteredUniversities.map((university, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={university.organization_logo}
                  alt={`${university.name} logo`}
                  width={60}
                  height={60}
                  className="rounded-md"
                />
                <div>
                  <h3 className="font-semibold text-lg leading-tight mb-2 dark:text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                    {university.name}
                  </h3>
                  <div className="flex items-center text-black-500 text-sm">
                    <img className="w-3 h-3 mr-2" src={LocationImg} />
                    <span>{university?.name}</span>
                  </div>
                </div>
              </div>
              <div className="px-0 pt-4 pb-2 border-t bg-white"></div>
              <div className="flex items-center text-amber-500">
                <img className="w-5 h-5 mr-2" src={TrophYImg} />
                <span className="mr-2 font-medium whitespace-nowrap">{university.id}</span>
                <span className="text-gray-600 whitespace-nowrap">QS Ranking</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-8 text-center">
        <button
          className="px-6 py-2.5 bg-primary bg-opacity-90 text-white rounded-full border border-[#404040] hover:bg-opacity-100 transition-colors"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "Explore all Universities"}
        </button>
      </div>
    </div>
  );
};

export default UniversitiesListing;
