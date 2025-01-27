import { Suspense } from "react";
import { Navigate } from "react-router";
import { tokenService } from "./services/tokenService";
import GlobalSpinner from "./components/global-spinner";
import { route_login } from "./constants/routeEnpoints";
import { useAuthentication } from "./hooks/useAuthentication";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthentication();
  const token = tokenService.getLoginToken();

  if (isLoading) {
    return <GlobalSpinner />;
  }

  if (!isAuthenticated || !token || !tokenService.isLoginTokenValid()) {
    return <Navigate to={route_login} replace />;
  }

  return <Suspense fallback={<GlobalSpinner />}>{children}</Suspense>;
}
