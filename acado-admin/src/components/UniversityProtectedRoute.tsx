import { Navigate, useLocation } from "react-router-dom";
import { ReactElement } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface UniversityProtectedRouteProps {
  children: ReactElement;
}

const UniversityProtectedRoute = ({ children }: UniversityProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Only allow admin role for university portal
  // Superadmin should use the main admin portal at /
  const allowed = user?.role === "admin";

  if (!isAuthenticated || !allowed) {
    return (
      <Navigate
        to="/university/login"
        state={{ from: location, reason: "unauthorized" }}
        replace
      />
    );
  }

  return children;
};

export default UniversityProtectedRoute;
