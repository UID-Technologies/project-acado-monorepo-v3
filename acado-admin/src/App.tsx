import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MasterFields from "./pages/MasterFields";
import Forms from "./pages/Forms";
import FormEditor from "./pages/FormEditor";
import Universities from "./pages/Universities";
import AddUniversity from "./pages/AddUniversity";
import UniversityDetails from "./pages/UniversityDetails";
import UniversityView from "./pages/UniversityView";
import AdminUniversityInfo from './pages/AdminUniversityInfo';
import Courses from "./pages/Courses";
import AddEditCourse from "./pages/AddEditCourse";
import CourseDetailAdmin from "./pages/CourseDetail";
import CourseCampaign from "./pages/CourseCampaign";
import CourseCategories from "./pages/CourseCategories";
import CourseLevels from "./pages/CourseLevels";
import CourseTypes from "./pages/CourseTypes";
import LearningOutcomes from "./pages/LearningOutcomes";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import OrganizationsPage from "./pages/Organizations";
import AddOrganization from "./pages/AddOrganization";
import OrganizationDetails from "./pages/OrganizationDetails";
import Users from "./pages/Users";
import AddEditUser from "./pages/AddEditUser";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// User pages
import UserLogin from '@/pages/UserLogin';
import UserRegister from '@/pages/UserRegister';
import UserLayout from '@/components/UserLayout';
import UserProtectedRoute from '@/components/UserProtectedRoute';
import UserDashboard from '@/pages/user/UserDashboard';
import CourseListing from '@/pages/user/CourseListing';
import UserCourseDetail from '@/pages/user/CourseDetail';
import ApplicationWizard from '@/pages/user/ApplicationWizard';
import ApplicationSuccess from '@/pages/user/ApplicationSuccess';
import Portfolio from '@/pages/user/Portfolio';
import ProfileView from '@/pages/ProfileView';
import MyApplications from '@/pages/user/MyApplications';
import ApplicationDetail from '@/pages/user/ApplicationDetail';
import Communications from '@/pages/user/Communications';

// University Admin Pages
import UniversityLogin from '@/pages/university/UniversityLogin';
import UniversityLayout from '@/components/UniversityLayout';
import UniversityProtectedRoute from '@/components/UniversityProtectedRoute';
import UniversityDashboard from '@/pages/university/UniversityDashboard';
import UniversityCourses from '@/pages/university/UniversityCourses';
import UniversityForms from '@/pages/university/UniversityForms';
import UniversityFormBuilder from '@/pages/university/UniversityFormBuilder';
import ApplicationProcess from '@/pages/university/ApplicationProcess';
import ApplicationProcessList from '@/pages/university/ApplicationProcessList';
import ApplicationReview from '@/pages/university/ApplicationReview';
import ApplicationsList from '@/pages/university/ApplicationsList';
import UniversityApplicationsOverview from '@/pages/university/ApplicationsOverview';
import UniversityInfo from '@/pages/university/UniversityInfo';
import TalentPool from '@/pages/university/TalentPool';
import ProcessSteps from '@/pages/university/ProcessSteps';
import ProcessConfiguration from '@/pages/university/ProcessConfiguration';
import UniversityContent from '@/pages/university/UniversityContent';
import UniversityCommunications from '@/pages/university/UniversityCommunications';
import UniversityEvents from '@/pages/university/UniversityEvents';
import UniversitySavedProfiles from '@/pages/university/UniversitySavedProfiles';
import TalentCommunications from '@/pages/university/TalentCommunications';
import UniversityAnalytics from '@/pages/university/UniversityAnalytics';
import UniversityReports from '@/pages/university/UniversityReports';
import UniversityAcceptanceLetters from '@/pages/university/UniversityAcceptanceLetters';
import UniversityProfile from '@/pages/university/UniversityProfile';
import UniversityPreferences from '@/pages/university/UniversityPreferences';
import UniversityUserManagement from '@/pages/university/UniversityUserManagement';
import UniversityAddUser from '@/pages/university/UniversityAddUser';
import UniversityAddCourse from '@/pages/university/UniversityAddCourse';
import UniversityCourseEditor from '@/pages/university/UniversityCourseEditor';

// Admin applications pages
import AdminApplicationsOverview from '@/pages/ApplicationsOverview';
import ApplicationsSelectionProcess from '@/pages/ApplicationsSelectionProcess';
import ApplicationsProcessConfiguration from '@/pages/ApplicationsProcessConfiguration';
import AcceptanceLetters from '@/pages/AcceptanceLetters';
import { AuthProvider } from '@/hooks/useAuth';
import SupportTicket from '@/pages/SupportTicket';
// Engagement Builder pages
import Wall from '@/pages/Wall';
import CreateWallPost from '@/pages/CreateWallPost';
import CommunityPosts from '@/pages/CommunityPosts';
import CreateCommunityPost from '@/pages/CreateCommunityPost';
import Reels from '@/pages/Reels';
import Events from '@/pages/Events';
import CreateEvent from '@/pages/CreateEvent';
import Scholarships from '@/pages/Scholarships';
import CreateScholarship from '@/pages/CreateScholarship';
import TalentPoolDashboard from '@/pages/TalentPoolDashboard';
import TalentPoolCandidates from '@/pages/TalentPool';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import InterestedUsers from '@/pages/InterestedUsers';
import UserSearch from '@/pages/UserSearch';
import MailTemplate from '@/pages/MailTemplate';
import BulkEmail from '@/pages/BulkEmail';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="master-fields" element={<MasterFields />} />
              <Route path="forms" element={<Forms />} />
              <Route path="forms/:formId" element={<FormEditor />} />
              <Route path="universities" element={<Universities />} />
              <Route path="universities/add" element={<AddUniversity />} />
              <Route path="universities/edit/:universityId" element={<AddUniversity />} />
              <Route path="universities/:universityId/view" element={<UniversityView />} />
              <Route path="universities/:universityId/details" element={<UniversityDetails />} />
              <Route path="universities/info" element={<AdminUniversityInfo />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/add" element={<AddEditCourse />} />
              <Route path="courses/edit/:courseId" element={<AddEditCourse />} />
              <Route path="courses/:courseId" element={<CourseDetailAdmin />} />
              <Route path="courses/:courseId/campaign" element={<CourseCampaign />} />
              <Route path="course-category" element={<CourseCategories />} />
              <Route path="course-level" element={<CourseLevels />} />
              <Route path="course-type" element={<CourseTypes />} />
              <Route path="learning-outcome" element={<LearningOutcomes />} />
              <Route path="organization/dashboard" element={<OrganizationDashboard />} />
              <Route path="organization/list" element={<OrganizationsPage />} />
              <Route path="organization/new" element={<AddOrganization />} />
              <Route path="organization/:organizationId" element={<OrganizationDetails />} />
              <Route path="users" element={<Users />} />
              <Route path="users/add" element={<AddEditUser />} />
              <Route path="users/:userId/edit" element={<AddEditUser />} />
              <Route path="applications-overview" element={<AdminApplicationsOverview />} />
              <Route path="applications" element={<ApplicationsList />} />
              <Route path="applications/selection-process" element={<ApplicationsSelectionProcess />} />
              <Route path="applications/selection-process/:courseId" element={<ApplicationsProcessConfiguration />} />
              <Route path="applications/acceptance-letters" element={<AcceptanceLetters />} />
              <Route path="applications/:id" element={<ApplicationReview />} />
              {/* Engagement Builder Routes */}
              <Route path="wall" element={<Wall />} />
              <Route path="wall/create" element={<CreateWallPost />} />
              <Route path="wall/edit/:id" element={<CreateWallPost />} />
              <Route path="communities" element={<CommunityPosts />} />
              <Route path="communities/create" element={<CreateCommunityPost />} />
              <Route path="communities/edit/:postId" element={<CreateCommunityPost />} />
              <Route path="reels" element={<Reels />} />
              <Route path="events" element={<Events />} />
              <Route path="events/create" element={<CreateEvent />} />
              <Route path="events/edit/:id" element={<CreateEvent />} />
              <Route path="scholarships" element={<Scholarships />} />
              <Route path="scholarships/create" element={<CreateScholarship />} />
              <Route path="scholarships/edit/:id" element={<CreateScholarship />} />
              {/* Talent Management Routes */}
              <Route path="talent-pool" element={<TalentPoolDashboard />} />
              <Route path="talent-pool/candidates" element={<TalentPoolCandidates />} />
              {/* Reports/Analytics Routes */}
              <Route path="analytics" element={<Analytics />} />
              <Route path="reports" element={<Reports />} />
              <Route path="interested-users" element={<InterestedUsers />} />
              <Route path="user-search" element={<UserSearch />} />
              {/* Settings Routes */}
              <Route path="mail-template" element={<MailTemplate />} />
              <Route path="bulk-email" element={<BulkEmail />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route
              path="/support/tickets/new"
              element={
                <ProtectedRoute>
                  <SupportTicket />
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route
              path="/user"
              element={
                <UserProtectedRoute>
                  <UserLayout />
                </UserProtectedRoute>
              }
            >
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="courses" element={<CourseListing />} />
              <Route path="courses/:courseId" element={<UserCourseDetail />} />
              <Route path="apply/:formId" element={<ApplicationWizard />} />
              <Route path="application/success/:applicationId" element={<ApplicationSuccess />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="applications/:id" element={<ApplicationDetail />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="communications" element={<Communications />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* University Admin Routes */}
            <Route path="/university" element={
              <UniversityProtectedRoute>
                <UniversityLayout />
              </UniversityProtectedRoute>
            }>
              <Route index element={<UniversityDashboard />} />
              <Route path="dashboard" element={<UniversityDashboard />} />
              <Route path="info" element={<UniversityInfo />} />
              <Route path="users" element={<UniversityUserManagement />} />
              <Route path="users/add" element={<UniversityAddUser />} />
              <Route path="courses" element={<UniversityCourses />} />
              <Route path="courses/add" element={<UniversityAddCourse />} />
              <Route path="courses/new" element={<UniversityCourseEditor />} />
              <Route path="courses/:courseId" element={<UniversityCourseEditor />} />
              <Route path="courses/:courseId/edit" element={<UniversityCourseEditor />} />
              <Route path="forms" element={<UniversityForms />} />
              <Route path="forms/new" element={<UniversityFormBuilder />} />
              <Route path="forms/:formId" element={<UniversityFormBuilder />} />
              <Route path="application-process/:courseId" element={<ApplicationProcess />} />
              <Route path="application-process-list" element={<ApplicationProcessList />} />
              <Route path="process-steps" element={<ProcessSteps />} />
              <Route path="process-configuration/new" element={<ProcessConfiguration />} />
              <Route path="process-configuration/:courseId" element={<ProcessConfiguration />} />
              <Route path="applications" element={<ApplicationsList />} />
              <Route path="applications/:id" element={<ApplicationReview />} />
              <Route path="applications-overview" element={<UniversityApplicationsOverview />} />
              <Route path="application-process" element={<ApplicationProcessList />} />
              <Route path="acceptance-letters" element={<UniversityAcceptanceLetters />} />
              <Route path="content" element={<UniversityContent />} />
              <Route path="communications" element={<UniversityCommunications />} />
              <Route path="events" element={<UniversityEvents />} />
              <Route path="talent" element={<TalentPool />} />
              <Route path="saved-profiles" element={<UniversitySavedProfiles />} />
              <Route path="talent-communications" element={<TalentCommunications />} />
              <Route path="analytics" element={<UniversityAnalytics />} />
              <Route path="reports" element={<UniversityReports />} />
              <Route path="profile" element={<Profile />} />
              <Route path="preferences" element={<UniversityPreferences />} />
            </Route>

            {/* Public Profile View */}
            <Route path="/profile/:username" element={<ProfileView />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
