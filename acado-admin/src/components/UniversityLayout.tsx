import React, { useMemo, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  BookOpen,
  FormInput,
  Mail,
  GraduationCap,
  Users,
  User,
  UserSearch,
  MessagesSquare,
  ClipboardList,
  LayoutDashboard,
  Info,
  UserPlus,
  Megaphone,
  FileText,
  BarChart,
  Settings,
  FileCheck,
  LogOut,
  ChevronDown,
  Bell,
} from 'lucide-react';
import { AcadoLogo } from '@/components/AcadoLogo';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { universitiesApi } from '@/api/universities.api';
import AppShell, { MenuSection } from '@/components/layout/AppShell';

const UniversityLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['university-setup']);
  const { user, logout } = useAuth();
  const [universityName, setUniversityName] = useState<string>(
    user?.universityName || user?.organizationName || 'Your University'
  );

  // Fetch fresh university data to get the current name
  useEffect(() => {
    const fetchUniversityName = async () => {
      const universityId = user?.universityIds?.[0];
      if (!universityId) return;

      try {
        const data = await universitiesApi.getUniversity(universityId);
        if (data.name) {
          setUniversityName(data.name);
        }
      } catch (error) {
        console.error('Failed to fetch university name:', error);
      }
    };

    if (user) {
      fetchUniversityName();
    }

    // Listen for university updates
    const handleUniversityUpdate = () => {
      fetchUniversityName();
    };

    window.addEventListener('universityUpdated', handleUniversityUpdate);
    return () => {
      window.removeEventListener('universityUpdated', handleUniversityUpdate);
    };
  }, [user, location.pathname]); // Re-fetch when route changes

  const universityData = {
    name: universityName,
    adminEmail: user?.email || 'admin@university.edu',
    pendingApplications: 12,
  };

  const menuSections: MenuSection[] = useMemo(() => {
    const renderPendingBadge = () => (
      <Badge variant="destructive">{universityData.pendingApplications}</Badge>
    );

    return [
      {
        id: 'university-setup',
        label: 'University Setup',
        icon: Building2,
        items: [
          { label: 'Dashboard', path: '/university/dashboard', icon: LayoutDashboard },
          { label: 'University Info', path: '/university/info', icon: Info },
          { label: 'Users', path: '/university/users', icon: UserPlus },
          { label: 'Courses', path: '/university/courses', icon: BookOpen },
        ],
      },
      // Hidden: Engagement
      // {
      //   id: 'engagement',
      //   label: 'Engagement',
      //   icon: Megaphone,
      //   items: [
      //     { label: 'Content', path: '/university/content', icon: FileText },
      //     { label: 'Communications', path: '/university/communications', icon: Mail },
      //     { label: 'Events', path: '/university/events', icon: GraduationCap },
      //   ],
      // },
      // Hidden: Talent Pool
      // {
      //   id: 'talent-pool',
      //   label: 'Talent Pool',
      //   icon: Users,
      //   items: [
      //     { label: 'Browse Talent', path: '/university/talent', icon: UserSearch },
      //     { label: 'Saved Profiles', path: '/university/saved-profiles', icon: User },
      //     { label: 'Communications', path: '/university/talent-communications', icon: MessagesSquare },
      //   ],
      // },
      {
        id: 'form-configuration',
        label: 'Form Configuration',
        icon: FormInput,
        items: [
          { label: 'Application Forms', path: '/university/forms', icon: FormInput },
          { label: 'Evaluation Criteria', path: '/university/application-process-list', icon: Settings },
          { label: 'Process Steps', path: '/university/process-steps', icon: FileCheck },
        ],
      },
      {
        id: 'applications',
        label: 'Applications',
        icon: ClipboardList,
        items: [
          { label: 'Applications Overview', path: '/university/applications-overview', icon: BarChart },
          { label: 'Collected Applications', path: '/university/applications', icon: ClipboardList, badge: renderPendingBadge() },
          { label: 'Selection Process', path: '/university/process-steps', icon: FileCheck },
          { label: 'Acceptance Letters', path: '/university/acceptance-letters', icon: Mail },
        ],
      },
      // Hidden: Analytics
      // {
      //   id: 'analytics',
      //   label: 'Analytics',
      //   icon: BarChart,
      //   items: [
      //     { label: 'Dashboard', path: '/university/analytics', icon: BarChart },
      //     { label: 'Reports', path: '/university/reports', icon: FileText },
      //   ],
      // },
      // Hidden: Settings
      // {
      //   id: 'settings',
      //   label: 'Settings',
      //   icon: Settings,
      //   items: [
      //     { label: 'Profile', path: '/university/profile', icon: User },
      //     { label: 'Preferences', path: '/university/preferences', icon: Settings },
      //   ],
      // },
    ];
  }, [universityData.pendingApplications]);

  const sidebarHeader = (
    <div className="space-y-4">
      <AcadoLogo className="h-8" />
      <div className="p-3 bg-accent/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{universityData.name}</p>
            <p className="text-xs text-muted-foreground">University Admin</p>
          </div>
        </div>
      </div>
    </div>
  );

  const headerTitle = (
    <div className="flex items-center gap-2">
      <AcadoLogo className="h-6" />
      <span className="text-sm text-muted-foreground">|</span>
      <h1 className="text-lg font-semibold text-foreground">{universityData.name}</h1>
    </div>
  );

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => {
          // Notification handler
        }}
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          3
        </span>
      </Button>
      
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 h-auto px-2 py-1.5 hover:bg-accent">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {(user.name || user.email || 'A').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-medium text-foreground leading-tight">
                  {user.name || 'Admin'}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {user.email || universityData.adminEmail}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name || 'Admin'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email || universityData.adminEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                console.log('🔗 Navigating to /university/profile from UniversityLayout');
                // Use setTimeout to ensure navigation happens after dropdown closes
                setTimeout(() => {
                  navigate('/university/profile');
                }, 0);
              }}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout().finally(() => navigate('/university/login'))}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );

  return (
    <AppShell
      sections={menuSections}
      sidebarHeader={sidebarHeader}
      headerTitle={headerTitle}
      headerActions={headerActions}
      expandedSections={expandedMenus}
      onExpandedChange={setExpandedMenus}
    >
      <Outlet />
    </AppShell>
  );
};

export default UniversityLayout;