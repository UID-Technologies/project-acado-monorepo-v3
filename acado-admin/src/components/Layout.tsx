import React, { useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Landmark,
  Building2,
  GraduationCap,
  Hash,
  LayoutDashboard,
  Award,
  Target,
  BookOpen,
  FormInput,
  FileText,
  Users,
  ClipboardCheck,
  Eye,
  Settings,
  Cog,
  Mail,
  FileCode,
  LogOut,
  Bell,
  Crown,
  Shield,
  ChevronDown,
  GraduationCap as GraduationCapIcon,
  User,
  Info,
  Plus,
  Globe,
  Rss,
  Calendar,
  Gift,
  Briefcase,
  UserCheck,
  BarChart,
  FileBarChart,
  UserSearch,
  Search,
} from 'lucide-react';
import { AcadoLogo } from '@/components/AcadoLogo';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AppShell, { MenuSection } from '@/components/layout/AppShell';

type SectionConfigItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  roles?: string[];
};

type SectionConfig = {
  id: string;
  label: string;
  icon: LucideIcon;
  roles?: string[];
  items: SectionConfigItem[];
};

const Layout = () => {
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();
  const { toast } = useToast();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const userRoleLower = user?.role?.toLowerCase();

  React.useEffect(() => {
    setExpandedMenus([]);
  }, [user?.role]);

  const allMenuSections = useMemo(() => {
    const universityItems: SectionConfigItem[] = [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { label: 'Universities', path: '/universities', icon: Building2 },
      { label: 'Users', path: '/users', icon: User },
    ];

    return [
      {
        id: 'university-setup',
        label: 'University Setup',
        icon: Building2,
        roles: ['superadmin'],
        items: universityItems,
      },
      {
        id: 'course',
        label: 'Course',
        icon: GraduationCap,
        roles: ['superadmin'],
        items: [
          { label: 'Course Category', path: '/course-category', icon: Hash },
          { label: 'Course Level', path: '/course-level', icon: LayoutDashboard },
          { label: 'Course Type', path: '/course-type', icon: Award },
          { label: 'Learning Outcome', path: '/learning-outcome', icon: Target },
          { label: 'Courses', path: '/courses', icon: BookOpen },
        ],
      },
      {
        id: 'engagement-builder',
        label: 'Engagement Builder',
        icon: Globe,
        roles: ['superadmin'],
        items: [
          { label: 'Wall', path: '/wall', icon: FileText },
          { label: 'Communities', path: '/communities', icon: Users },
          { label: 'Reels', path: '/reels', icon: Rss },
          { label: 'Events', path: '/events', icon: Calendar },
          { label: 'Scholarships', path: '/scholarships', icon: Gift },
        ],
      },
      {
        id: 'talent-management',
        label: 'Talent Management',
        icon: Briefcase,
        roles: ['superadmin'],
        items: [
          { label: 'Talent Pool Dashboard', path: '/talent-pool', icon: LayoutDashboard },
          { label: 'Candidates', path: '/talent-pool/candidates', icon: UserCheck },
        ],
      },
      {
        id: 'reports-analytics',
        label: 'Reports/Analytics',
        icon: BarChart,
        roles: ['superadmin'],
        items: [
          { label: 'Analytics', path: '/analytics', icon: BarChart },
          { label: 'Reports', path: '/reports', icon: FileBarChart },
          { label: 'Interested Users', path: '/interested-users', icon: UserSearch },
          { label: 'User Search', path: '/user-search', icon: Search },
        ],
      },
      {
        id: 'applications',
        label: 'Applications',
        icon: ClipboardCheck,
        roles: ['superadmin'],
        items: [
          { label: 'Applications Overview', path: '/applications-overview', icon: Eye },
          { label: 'Applications List', path: '/applications', icon: ClipboardCheck },
          { label: 'Selection Process', path: '/applications/selection-process', icon: FileText },
          { label: 'Acceptance Letters', path: '/applications/acceptance-letters', icon: Mail },
        ],
      },
      {
        id: 'form-builder',
        label: 'Form Builder',
        icon: FormInput,
        roles: ['superadmin'],
        items: [
          { label: 'Master Fields', path: '/master-fields', icon: FileText },
          { label: 'Application Form', path: '/forms', icon: FormInput },
        ],
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        roles: ['superadmin'],
        items: [
          { label: 'Mail Template', path: '/mail-template', icon: FileCode },
          { label: 'Bulk Email', path: '/bulk-email', icon: Mail },
        ],
      },
    ] as SectionConfig[]
  }, [userRoleLower, user?.universityIds]);

  const menuSections: MenuSection[] = useMemo(() => {
    if (!user) return [];
    const userRole = user.role?.toLowerCase();
    if (!userRole) return [];

    return allMenuSections
      .filter((section) => {
        if (!section.roles || userRole === 'superadmin') return true;
        return section.roles.some((role) => role.toLowerCase() === userRole);
      })
      .map((section) => {
        const filteredItems = section.items.filter((item) => {
          if (!item.roles) return true;
          if (userRole === 'superadmin') return true;
          return item.roles.some((role) => role.toLowerCase() === userRole);
        });
        return {
          id: section.id,
          label: section.label,
          icon: section.icon,
          items: filteredItems,
        };
      })
      .filter((section) => section.items.length > 0);
  }, [allMenuSections, user]);

  const headerActions = (
    <>
      <Button variant="outline" className="text-sm font-medium" asChild>
        <a
          href="/support/tickets/new"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center px-3 py-2"
        >
          Raise Support Ticket
        </a>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() =>
          toast({
            title: 'No new notifications',
            description: 'You are all caught up for now.',
          })
        }
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          5
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
                  {user.name || 'User'}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {user.email || 'user@example.com'}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email || 'user@example.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                console.log('🔗 Navigating to /profile from Layout');
                // Use setTimeout to ensure navigation happens after dropdown closes
                setTimeout(() => {
                  navigate('/profile');
                }, 0);
              }}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout().then(() => {
                  toast({
                    title: 'Logged out',
                    description: 'You have been successfully logged out.',
                  });
                });
              }}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );

  const sidebarHeader = (
    <div className="flex items-center justify-between">
      <AcadoLogo className="h-8" />
    </div>
  );

  const sidebarFooter = (
    <div className="text-[11px] font-medium text-muted-foreground text-center">Version 3.0.0</div>
  );

  return (
    <AppShell
      sections={menuSections}
      sidebarHeader={sidebarHeader}
      sidebarFooter={sidebarFooter}
      headerTitle="ACADO Admin Portal"
      headerActions={headerActions}
      expandedSections={expandedMenus}
      onExpandedChange={setExpandedMenus}
    >
      <Outlet />
    </AppShell>
  );
};

export default Layout;