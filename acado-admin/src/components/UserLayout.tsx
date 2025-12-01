import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  User,
  GraduationCap,
  FileText,
  LogOut,
  Menu,
  Home,
  BookOpen,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AcadoLogo } from "./AcadoLogo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout()
      .then(() => {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        navigate("/user/login");
      })
      .catch(() => {
        navigate("/user/login");
      });
  };

  const navigationItems = [
    // { path: "/user/dashboard", label: "Dashboard", icon: Home },
    // { path: "/user/courses", label: "Courses", icon: BookOpen },
    // { path: "/user/portfolio", label: "Portfolio", icon: User },
    { path: "/user/applications", label: "Applications", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/user/dashboard" className="flex items-center gap-2">
                <AcadoLogo />
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {navigationItems.map((item) => (
                  item.label === "Applications" ? (
                    <span
                      key={item.path}
                      className="text-sm font-medium text-muted-foreground cursor-default"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  )
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => {
                  toast({
                    title: 'No new notifications',
                    description: 'You are all caught up for now.',
                  });
                }}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  2
                </span>
              </Button>

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 h-auto px-2 py-1.5 hover:bg-accent">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                          {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:flex flex-col items-start text-left">
                        <span className="text-sm font-medium text-foreground leading-tight">
                          {user.name || 'User'}
                        </span>
                        <span className="text-xs text-muted-foreground leading-tight">
                          {user.email || 'user@example.com'}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
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
                        console.log('🔗 Navigating to /user/profile from UserLayout');
                        // Use setTimeout to ensure navigation happens after dropdown closes
                        setTimeout(() => {
                          navigate('/user/profile');
                        }, 0);
                      }}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <div className="flex flex-col gap-4 mt-4">
                    {user && (
                      <div className="flex items-center gap-2 pb-4 border-b">
                        <User className="h-4 w-4" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    )}
                    
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return item.label === "Applications" ? (
                        <span
                          key={item.path}
                          className="flex items-center gap-3 text-sm font-medium text-muted-foreground cursor-default"
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </span>
                      ) : (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center gap-3 text-sm font-medium transition-colors hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="justify-start mt-4"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 ACADO. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;