import React, { useEffect } from 'react';
import { useCourseModuleStore } from '@app/store/learner/courseModuleStore';
import { fetchCourseModule } from '@services/learner/CourseModuleService';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import eventImage from '/img/event/event_banner.png';
import dayjs from 'dayjs';
import Loading from '@/components/shared/Loading';

const ModuleCard: React.FC = () => {

  const { courseModule, setCourseModule, setError, setIsLoading, isLoading } = useCourseModuleStore();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchModule = async () => {
      setIsLoading(true);

      if (!id) {
        setError('Module not found');
        setIsLoading(false);
        return;
      }

      try {
        const moduleResp = await fetchCourseModule(parseInt(id));
        console.log('Fetched Module Data:', moduleResp);
        setCourseModule(moduleResp);
      } catch (error) {
        console.error('Error fetching module:', error);
        setError('Failed to load module');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
  }, [id, setCourseModule, setIsLoading, setError]);

  const handleCardClick = (moduleId: number) => {
    navigate(`/program-content/${moduleId}`, { state: { module_id: moduleId } });
  };

  const formatDate = (timestamp: string) => {
    return dayjs(timestamp).format('DD MMM YYYY h:mm A');
  };

  if (isLoading) {
    return (
      <Loading loading={isLoading} />
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg dark:bg-gray-800 overflow-hidden mb-6">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold capitalize text-lg mb-3">Course Module</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer mb-10">
        {courseModule?.list?.map((course, courseIndex) => (
          <div key={courseIndex} className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img
                src={course.image || eventImage}
                alt="event"
                className="h-48 w-full object-cover"
              />
              <span className="absolute top-0 right-0 bg-primary text-ac-dark px-2 py-1 text-xs font-semibold rounded-bl-lg">
                Active
              </span>
            </div>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 opacity-90">
              <div className="flex items-center justify-between">
                <h6 className="font-bold text-gray-800 dark:text-white">
                  {course.name}
                </h6>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary text-ac-dark dark:bg-primary">
                  Medium
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {course.description}
              </p>
              <div className="flex items-center mt-3 gap-2">
                <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2 dark:text-primary text-primary">
                  <Calendar size={16} /> {formatDate(course?.start_date.toString())}
                </span>
                -
                <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2 dark:text-primary text-primary">
                  <Calendar size={16} /> {formatDate(course?.end_date.toString())}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <p>Total Content: {course.modules?.length}</p>
                </div>

                <div className="flex justify-end">
                  <span className="text-sm text-gray-500 mt-4 mr-4">Completed:</span>
                  <div className="h-12 w-12">
                    <CircularProgressbar
                      value={course.completion}
                      text={`${course.completion}%`}
                      styles={buildStyles({
                        textSize: '12px',
                        pathColor: '#4caf50',
                        textColor: '#4CAF50',
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7',
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-lg mb-2">Modules:</h4>
                <div className="flex flex-col gap-4">
                  {course.modules?.map((module) => (
                    <div
                      key={module.id}
                      onClick={() => handleCardClick(module.id)}
                      className="cursor-pointer text-blue-500 flex items-center p-4 space-x-4 bg-white dark:bg-gray-800 rounded-lg transition-all hover:shadow-xl"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={`https://ui-avatars.com/api/?name=${module.name}&background=random&color=fff`}
                          alt=""
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-white">
                          {module.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleCard;
