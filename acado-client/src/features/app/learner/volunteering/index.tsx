import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Error from "@/components/shared/Error";
import { useVolunteering } from "@app/hooks/data/useVolunteering";
import LoadingSection from "@/components/LoadingSection";
import { Event } from "@app/types/learner/events";

export default function Index() {

  const { data: volunteering = [], isLoading, isError, error } = useVolunteering();

  const navigate = useNavigate();
  const eventListRef = useRef<HTMLDivElement | null>(null);

  const volunteerSteps = [
    {
      id: 1,
      title: "Complete the simple online registration form",
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 stroke-current" fill="none" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 12h6" />
          <path d="M9 8h6" />
          <path d="M9 16h6" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Select your type of volunteering opportunity",
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 stroke-current" fill="none" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Schedule an interview with Volunteering Together for Manchester Museum",
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 stroke-current" fill="none" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Complete the short training course at the Museum",
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 stroke-current" fill="none" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  const handleCardClick = (eventItem: Event) => {
    navigate(`/volunteering-details/${eventItem.id}`, { state: { event: eventItem } });
  };


  if (isLoading) {
    return <LoadingSection isLoading={isLoading} title="Loading Volunteering Opportunities..." />;
  }

  if (isError) {
    return <Error error={error.message} />;
  }

  return (
    <main className="min-h-screen bg-gray-200 dark:bg-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full bg-primary dark:bg-primary"
          style={{
            clipPath: "ellipse(100% 100% at 50% 0%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary dark:bg-primary to-[#FF7259]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
                Volunteer together for wellbeing
              </h1>
              <p className="text-lg sm:text-xl mb-8 opacity-90">
                A unique volunteering, training and placement project delivered across ten heritage venues in Greater
                Manchester, designed to support participants into volunteering away from social and economic isolation.
              </p>
              {/* <button
                className="bg-primary text-ac-dark dark:bg-primary px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
                onClick={handleScrollToEvents}
              >
                Become a Volunteer
              </button> */}
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src={`https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                alt="Volunteers working together"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl sm:text-4xl font-bold dark:text-primary text-primary mb-4">How to become a Volunteer</h2>
        <p className="text-lg text-gray-600 mb-12">{`It's`} quick and easy to get started.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {volunteerSteps.map((step, index) => (
            <div key={index} className="dark:bg-gray-900 bg-gray-100 p-2 px-3 rounded-2xl hover:shadow-lg">
              <div key={step.id} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary dark:bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                    <span className="absolute -top-4 -left-5 w-7 h-7 rounded-full bg-primary dark:bg-primary text-ac-dark flex items-center justify-center font-bold">
                      {step.id}
                    </span>
                    <div className="text-ac-dark"> {step.icon} </div>
                  </div>
                  <p className="dark:text-gray-200 text-gray-700">{step.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section>
        <div ref={eventListRef} className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
              volunteering?.slice(0, 6).map((eventItem, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 border border-gray-600  rounded-lg shadow-md overflow-hidden cursor-pointer ${new Date(eventItem.end_date) < new Date() ? "" : "border border-primary dark:border-primary"
                    }`}
                  onClick={() => handleCardClick(eventItem)}
                >
                  <div className="relative">
                    <img src={eventItem.image} alt="event" className="h-48 w-full object-cover" />
                  </div>
                  <div className="px-4 py-2 border-b border-gray-200  dark:border-gray-700 dark:bg-gray-900 bg-white opacity-90 w-full">
                    <div className="flex flex-col">
                      <h6
                        className={`font-bold text-sm ${new Date(eventItem.end_date) < new Date() ? "text-gray-800 dark:text-white" : "text-primary dark:text-darkPrimary"
                          }`}
                      >
                        {eventItem.name}
                      </h6>
                      <div className="flex items-center justify-start">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {eventItem.start_date?.split(" ")[0]} -{" "}
                        </span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{eventItem.end_date?.split(" ")[0]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4" dangerouslySetInnerHTML={{ __html: eventItem.description }}></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="m-10">
          <Link to={'/volunteerOpportunities'}>
            <button className="flex items-center mx-auto bg-primary dark:text-ac-dark hover:dark:bg-primary text-white px-6 py-3 rounded-lg font-medium transition-all gap-2">
              View All Volunteering Opportunities
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>


    </main>
  );
}
