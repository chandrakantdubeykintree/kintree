import { Suspense } from "react";
import { Navigate } from "react-router";
import { tokenService } from "./services/tokenService";
import GlobalSpinner from "./components/global-spinner";
import { route_login } from "./constants/routeEnpoints";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const token = tokenService.getLoginToken();

  if (loading) {
    return <GlobalSpinner />;
  }

  if (!isAuthenticated || !token || !tokenService.isLoginTokenValid()) {
    return <Navigate to={route_login} replace />;
  }

  return <Suspense fallback={<GlobalSpinner />}>{children}</Suspense>;
}
