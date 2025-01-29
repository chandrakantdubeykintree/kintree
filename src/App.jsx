import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";

import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import RootLayout from "./layouts/RootLayout";
import ContentLayout from "./layouts/ContentLayout";

import GlobalErrorBoundary from "./errorBoundaries/GlobalErrorBoundary";
import RouteErrorBoundary from "./errorBoundaries/RouteErrorBoundary";

import * as LazyComponents from "./lazyRoutes.jsx";
import { AuthProvider } from "./context/AuthProvider";
import { GoogleMapsProvider } from "./context/GoogleMapsContext";
import { ThemeLanguageProvider } from "./context/ThemeLanguageProvider";
import ProtectedRoutes from "./ProtectedRoutes";

import GlobalSpinner from "./components/global-spinner";

import RouteNameDisplay from "./RouteNameDisplay";

import {
  route_login,
  route_register,
  route_register_step,
  route_forgot_password,
  route_forgot_username,
  route_foreroom,
  route_create_post,
  route_edit_post,
  route_view_post,
  route_create_poll,
  route_edit_poll,
  route_view_poll,
  route_family_tree,
  route_family_member,
  route_family_tree_add_member,
  route_family_tree_view_member,
  route_family_tree_edit_member,
  route_chats,
  route_events,
  route_events_create_event,
  route_events_view_event,
  route_events_edit_event,
  route_kincoins,
  route_notifications,
  route_will,
  route_will_create_will,
  route_will_view_will,
  route_will_edit_will,
  route_profile,
  route_profile_view_profile,
  route_settings,
  route_settings_edit_settings,
} from "./constants/routeEnpoints";
import { SidebarProvider } from "./context/SidebarContext";
import PageNotFound from "./components/page-not-found";
import FAQS from "./pages/FAQS";
import AuthLayout from "./layouts/AuthLayout";

const {
  Login,
  Register,
  RegisterStep,
  ForgotPassword,
  ForgotUsername,
  Foreroom,
  FamilyTree,
  FamilyMember,
  CreatePost,
  EditPost,
  ViewPost,
  CreatePoll,
  EditPoll,
  ViewPoll,
  AddMember,
  ViewMember,
  EditMember,
  Chats,
  ViewChat,
  CreateChat,
  EditChat,
  Profile,
  ViewProfile,
  Settings,
  EditSettings,
  Notifications,
  Events,
  CreateEvent,
  EditEvent,
  ViewEvent,
  Kincoins,
  Will,
  CreateWill,
  EditWill,
  ViewWill,
} = LazyComponents;

export default function App() {
  return (
    <RootLayout>
      <GlobalErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={<GlobalSpinner />}>
                <RouteNameDisplay />
                <Routes>
                  <Route errorElement={<RouteErrorBoundary />}>
                    <Route element={<AuthLayout />}>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />
                      <Route
                        path="/forgot-username"
                        element={<ForgotUsername />}
                      />
                    </Route>
                    <Route
                      path="/register/step/:step"
                      element={<RegisterStep />}
                    />
                    <Route
                      path=""
                      element={
                        <ProtectedRoutes>
                          <GoogleMapsProvider>
                            <ThemeLanguageProvider
                              defaultTheme="light"
                              defaultLanguage="en"
                              storageKey="kintree-theme"
                              languageStorageKey="kintree-language"
                            >
                              <SidebarProvider>
                                <Suspense fallback={<GlobalSpinner />}>
                                  <ContentLayout>
                                    <Outlet />
                                  </ContentLayout>
                                </Suspense>
                              </SidebarProvider>
                            </ThemeLanguageProvider>
                          </GoogleMapsProvider>
                        </ProtectedRoutes>
                      }
                    >
                      {/* foreroom */}
                      <Route
                        index
                        element={<Navigate to={route_foreroom} replace />}
                      />
                      <Route path={route_foreroom} element={<Foreroom />} />
                      <Route
                        path={route_create_post}
                        element={<CreatePost />}
                      />
                      <Route
                        path={route_create_poll}
                        element={<CreatePoll />}
                      />
                      <Route path={route_view_post} element={<ViewPost />} />
                      <Route path={route_view_poll} element={<ViewPoll />} />
                      <Route path={route_edit_post} element={<EditPost />} />
                      <Route path={route_edit_poll} element={<EditPoll />} />
                      {/* family tree */}
                      <Route
                        path={route_family_tree}
                        element={<FamilyTree />}
                      />
                      <Route
                        path={route_family_member + "/:id"}
                        element={<FamilyMember />}
                      />
                      <Route
                        path={route_family_tree_add_member}
                        element={<AddMember />}
                      />
                      <Route
                        path={route_family_tree_view_member}
                        element={<ViewMember />}
                      />
                      <Route
                        path={route_family_tree_edit_member}
                        element={<EditMember />}
                      />

                      {/* chats */}
                      <Route path={route_chats} element={<Chats />} />

                      {/* profile */}
                      <Route path={route_profile} element={<Profile />} />
                      <Route
                        path={route_profile_view_profile}
                        element={<ViewProfile />}
                      />

                      {/* settings */}
                      <Route path={route_settings} element={<Settings />} />
                      <Route
                        path={route_settings_edit_settings}
                        element={<EditSettings />}
                      />

                      {/* notifications */}
                      <Route
                        path={route_notifications}
                        element={<Notifications />}
                      />

                      {/* events */}
                      <Route path={route_events} element={<Events />} />
                      <Route
                        path={route_events_create_event}
                        element={<CreateEvent />}
                      />
                      <Route
                        path={route_events_view_event}
                        element={<ViewEvent />}
                      />
                      <Route
                        path={route_events_edit_event}
                        element={<EditEvent />}
                      />

                      {/* kincoins */}
                      <Route path={route_kincoins} element={<Kincoins />} />

                      {/* will */}
                      <Route path={route_will} element={<Will />} />
                      <Route
                        path={route_will_create_will}
                        element={<CreateWill />}
                      />
                      <Route
                        path={route_will_view_will}
                        element={<ViewWill />}
                      />
                      <Route
                        path={route_will_edit_will}
                        element={<EditWill />}
                      />

                      {/* faqs */}
                      <Route path="/faqs" element={<FAQS />} />

                      {/* page not found */}
                      <Route path="*" element={<PageNotFound />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </GlobalErrorBoundary>
      <Toaster position="top-right" reverseOrder={false} />
    </RootLayout>
  );
}
