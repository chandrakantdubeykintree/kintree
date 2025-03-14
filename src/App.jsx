import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
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
  route_view_poll,
  route_family_tree,
  route_family_member,
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
  route_settings,
  route_settings_edit_settings,
  route_kintree_member,
  route_tree_merge_request,
  route_create_recipe,
  route_edit_recipe,
  route_view_recipe,
} from "./constants/routeEnpoints";
import { SidebarProvider } from "./context/SidebarContext";
import PageNotFound from "./pages/PageNotFound";
import FAQS from "./pages/FAQS";
import AuthLayout from "./layouts/AuthLayout";
import FlutterChat from "./pages/FlutterChat";
import ViewTreeMergeRequest from "./pages/ViewTreeMergeRequest";
import Horoscope from "./pages/Horoscope";

const {
  RootLayout,
  ContentLayout,
  Login,
  Register,
  RegisterStep,
  ForgotPassword,
  ForgotUsername,
  Foreroom,
  FamilyTree,
  FamilyMember,
  KintreeMember,
  CreatePost,
  EditPost,
  ViewPost,
  CreateRecipe,
  EditRecipe,
  ViewRecipe,
  CreatePoll,
  ViewPoll,
  Chats,
  Profile,
  Settings,
  EditSettings,
  NotificationsPage,
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
            <Suspense fallback={<GlobalSpinner />}>
              <Routes>
                <Route
                  path="/flutter-chat/:token"
                  element={
                    <Suspense fallback={<GlobalSpinner />}>
                      <FlutterChat />
                    </Suspense>
                  }
                />
                {/* Main Routes */}
                <Route
                  path="/*"
                  element={
                    <AuthProvider>
                      <Suspense fallback={<GlobalSpinner />}>
                        <RouteNameDisplay />
                        <Routes>
                          <Route errorElement={<RouteErrorBoundary />}>
                            <Route element={<AuthLayout />}>
                              <Route path={route_login} element={<Login />} />
                              <Route
                                path={route_register}
                                element={<Register />}
                              />
                              <Route
                                path={route_forgot_password}
                                element={<ForgotPassword />}
                              />
                              <Route
                                path={route_forgot_username}
                                element={<ForgotUsername />}
                              />
                            </Route>
                            <Route
                              path={`${route_register_step}/:step`}
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
                              <Route
                                index
                                element={
                                  <Navigate to={route_foreroom} replace />
                                }
                              />
                              <Route
                                path={route_foreroom}
                                element={<Foreroom />}
                              />
                              <Route
                                path={route_create_post}
                                element={<CreatePost />}
                              />
                              <Route
                                path={route_create_poll}
                                element={<CreatePoll />}
                              />
                              <Route
                                path={route_view_post + "/:postId"}
                                element={<ViewPost />}
                              />
                              <Route
                                path={route_view_poll + "/:pollId"}
                                element={<ViewPoll />}
                              />
                              <Route
                                path={route_edit_post + "/:postId"}
                                element={<EditPost />}
                              />
                              <Route
                                path={route_create_recipe}
                                element={<CreateRecipe />}
                              />
                              <Route
                                path={route_edit_recipe + "/:recipeId"}
                                element={<EditRecipe />}
                              />
                              <Route
                                path={route_view_recipe + "/:recipeId"}
                                element={<ViewRecipe />}
                              />
                              <Route
                                path={route_family_tree}
                                element={<FamilyTree />}
                              />
                              <Route
                                path={route_family_member + "/:id"}
                                element={<FamilyMember />}
                              />

                              <Route
                                path={route_kintree_member + "/:id"}
                                element={<KintreeMember />}
                              />
                              <Route
                                path={route_tree_merge_request + "/:requestId"}
                                element={<ViewTreeMergeRequest />}
                              />
                              <Route path={route_chats} element={<Chats />} />
                              <Route
                                path={route_profile}
                                element={<Profile />}
                              />

                              <Route
                                path={route_settings}
                                element={<Settings />}
                              />
                              <Route
                                path={route_settings_edit_settings}
                                element={<EditSettings />}
                              />
                              <Route
                                path={route_notifications}
                                element={<NotificationsPage />}
                              />
                              <Route path={route_events} element={<Events />} />
                              <Route
                                path={route_events_create_event}
                                element={<CreateEvent />}
                              />
                              <Route
                                path={route_events_view_event + "/:eventId"}
                                element={<ViewEvent />}
                              />
                              <Route
                                path={route_events_edit_event + "/:eventId"}
                                element={<EditEvent />}
                              />
                              <Route
                                path={route_kincoins}
                                element={<Kincoins />}
                              />
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
                                path={"/horoscope"}
                                element={<Horoscope />}
                              />
                              <Route
                                path={route_will_edit_will}
                                element={<EditWill />}
                              />
                              <Route path="/faqs" element={<FAQS />} />
                            </Route>
                          </Route>
                          <Route path="*" element={<PageNotFound />} />
                        </Routes>
                      </Suspense>
                    </AuthProvider>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </QueryClientProvider>
      </GlobalErrorBoundary>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 1500,
        }}
      />
    </RootLayout>
  );
}
