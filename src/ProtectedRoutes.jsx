import { Suspense } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { route_login } from "../constants/routeEnpoints";
import GlobalSpinner from "./components/global-spinner";
import { tokenService } from "../services/tokenService";
import ComponentLoading from "./components/component-loading";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const token = tokenService.getLoginToken();

  if (loading) {
    return <GlobalSpinner />;
  }

  if (!isAuthenticated || !token || !tokenService.isLoginTokenValid()) {
    return <Navigate to={route_login} replace />;
  }

  return <Suspense fallback={<ComponentLoading />}>{children}</Suspense>;
}
