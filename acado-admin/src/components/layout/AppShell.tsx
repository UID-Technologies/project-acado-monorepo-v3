import React, { ReactNode, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon, Menu, PanelLeftClose, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: ReactNode;
}

export interface MenuSection {
  id: string;
  label: string;
  icon: LucideIcon;
  items: MenuItem[];
}

interface AppShellProps {
  sections: MenuSection[];
  children: ReactNode;
  headerTitle?: ReactNode;
  headerActions?: ReactNode;
  sidebarHeader?: ReactNode;
  sidebarFooter?: ReactNode;
  expandedSections: string[];
  onExpandedChange: (next: string[]) => void;
}

const AppShell: React.FC<AppShellProps> = ({
  sections,
  children,
  headerTitle,
  headerActions,
  sidebarHeader,
  sidebarFooter,
  expandedSections,
  onExpandedChange,
}) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSection = (sectionId: string) => {
    onExpandedChange(
      expandedSections.includes(sectionId)
        ? expandedSections.filter((id) => id !== sectionId)
        : [...expandedSections, sectionId]
    );
  };

  const activePath = useMemo(() => location.pathname, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 bg-card border-r border-border transition-all duration-300 z-50 overflow-hidden',
          isSidebarOpen ? 'w-64' : 'w-0'
        )}
      >
        <div className={cn('flex h-full flex-col p-4', !isSidebarOpen && 'hidden')}>
          {sidebarHeader && <div className="mb-6">{sidebarHeader}</div>}

          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {sections.map((section) => (
              <div key={section.id} className="mb-1">
                <Collapsible
                  open={expandedSections.includes(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer',
                        expandedSections.includes(section.id) && 'bg-accent/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <section.icon className="h-4 w-4" />
                        <span>{section.label}</span>
                      </div>
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 ml-4 space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground',
                          activePath === item.path &&
                            'bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </nav>

          {sidebarFooter && <div className="mt-4">{sidebarFooter}</div>}
        </div>
      </aside>

      <div
        className={cn('transition-all duration-300', isSidebarOpen ? 'ml-64' : 'ml-0')}
      >
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {isSidebarOpen ? <PanelLeftClose size={20} /> : <Menu size={20} />}
            </button>
            {typeof headerTitle === 'string' ? (
              <h1 className="text-xl font-bold text-foreground">{headerTitle}</h1>
            ) : (
              headerTitle
            )}
          </div>
          <div className="flex items-center gap-3">{headerActions}</div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
