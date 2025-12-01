import { useVolunteering } from "@app/hooks/data/useVolunteering";
import { useNavigate } from "react-router-dom";
import { Event } from "@app/types/learner/events";
import Heading from "@/components/heading";
import LoadingSection from "@/components/LoadingSection";

export default function VolunteerCertificates() {

  const { data: volunteering = [], isLoading, isError, error } = useVolunteering();
  const navigate = useNavigate();


  const handleCardClick = (eventItem: Event) => {
    navigate(`/volunteering-details/${eventItem.id}`, { state: { event: eventItem } });
  };

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error instanceof Error ? error.message : 'An unexpected error occurred.'}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Heading title="Volunteering Opportunities" description="Explore various volunteering opportunities to contribute and make a difference." className="mb-4" />
      <LoadingSection isLoading={isLoading} title="Loading volunteering opportunities..." description="Please wait while we fetch the latest opportunities." />
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {
            volunteering?.map((eventItem, index) => (
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
    </div>
  );
}
