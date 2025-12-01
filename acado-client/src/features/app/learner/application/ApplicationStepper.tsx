import Button from "@/components/ui/Button/Button";
import { useEffect, useState } from 'react';
import { useApplicationStore } from '@app/store/learner/applicationStore';
import { fetchApplication } from '@services/learner/ApplicationServices';
import Loading from '@/components/shared/Loading';
import { Link } from 'react-router-dom';
import AppliedCoursesList from '@learner/courses/AppliedCoursesList';
import AppliedUniversityList from '@learner/dashboard/partials/AppliedUniversity';

export default function ApplicationStepper() {
  const { application, setApplication, loading, setLoading, error, setError } = useApplicationStore();
  const [showCourseAppliedCard, setShowCourseAppliedCard] = useState(true);
  const [showUniversityAppliedCard, setShowUniversityAppliedCard] = useState(false);
  const [activeButton, setActiveButton] = useState('courseApplied');

  useEffect(() => {
    setLoading(true);
    fetchApplication()
      .then((applicationData) => {
        setApplication(applicationData);
      })
      .catch((error) => {
        setError('Failed to fetch application data');
      })
      .finally(() => setLoading(false));
  }, [setApplication, setLoading, setError]);

  const handleCourseApplied = () => {
    setLoading(true);
    setShowCourseAppliedCard(true);
    setShowUniversityAppliedCard(false);
    setActiveButton('courseApplied');
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleUniversityApplied = () => {
    setLoading(true);
    setShowUniversityAppliedCard(true);
    setShowCourseAppliedCard(false);
    setActiveButton('universityApplied');
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleInProgressCourse = () => {
    setLoading(true);
    setShowCourseAppliedCard(true);
    setShowUniversityAppliedCard(false);
    setActiveButton('inProgressCourse');
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSelectedCourse = () => {
    setLoading(true);
    setShowCourseAppliedCard(true);
    setShowUniversityAppliedCard(false);
    setActiveButton('selectedCourse');
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {application && (
          <>
            <Button
              onClick={handleCourseApplied}
              className={`flex flex-col items-center justify-center h-auto py-4 px-6 border-2 ${activeButton === 'courseApplied' ? 'dark:border-primary' : 'border-white'}`}
            >
              <span className="text-lg text-primary font-extrabold">{application.applied_courses}</span>
              <span className="text-sm text-muted-foreground mt-1">Applied Courses</span>
            </Button>
            <Button
              onClick={handleUniversityApplied}
              className={`flex flex-col items-center justify-center h-auto py-4 px-6 border-2 ${activeButton === 'universityApplied' ? 'dark:border-primary' : 'border-white'}`}
            >
              <span className="text-lg text-primary font-extrabold">{application.applied_university}</span>
              <span className="text-sm text-muted-foreground mt-1">Applied University</span>
            </Button>
            <Button
              onClick={handleInProgressCourse}
              className={`flex flex-col items-center justify-center h-auto py-4 px-6 border-2 ${activeButton === 'inProgressCourse' ? 'dark:border-primary' : 'border-white'}`}
            >
              <span className="text-lg text-primary font-extrabold">{application.inprogress_course}</span>
              <span className="text-sm text-muted-foreground mt-1">In Progress Course</span>
            </Button>
            {/* <Button
              onClick={handleSelectedCourse}
              className={`flex flex-col items-center justify-center h-auto py-4 px-6 border-2 ${activeButton === 'selectedCourse' ? 'dark:border-primary' : 'border-white'}`}
            >
              <span className="text-lg font-medium">{application.selected_course}</span>
              <span className="text-sm text-muted-foreground mt-1">Selected Course</span>
            </Button> */}
          </>
        )}


      </div>
      <Link to="/portfolio/builder" className="text-ac-dark">
        <Button variant="solid" type="submit" className="col-span-4 w-full h-auto py-4 px-6 dark:bg-primary hover:bg-primary-500 border-none text-ac-dark mt-5"> Update Portfolio</Button>
      </Link>
      <div className="mt-10">
        {loading && <Loading loading={loading} />}
        <h1 className="text-xl m-2">
          {activeButton === 'courseApplied'
            ? 'Applied Courses'

            : activeButton === 'inProgressCourse'
              ? 'In Progress Courses'
              : ''}
        </h1>

        {!loading && (showCourseAppliedCard ? <AppliedCoursesList /> : showUniversityAppliedCard && <AppliedUniversityList />)}
      </div>
    </div>
  );
}
