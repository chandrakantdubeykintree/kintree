import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";

import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import RootLayout from "./layouts/RootLayout";
import ForeroomLayout from "./layouts/ForeroomLayout";
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
import FamilyTreeLayout from "./layouts/FamilyTreeLayout";

const Login = LazyComponents.Login;
const Register = LazyComponents.Register;
const RegisterStep = LazyComponents.RegisterStep;
const ForgotPassword = LazyComponents.ForgotPassword;
const ForgotUsername = LazyComponents.ForgotUsername;

const Foreroom = LazyComponents.Foreroom;
const CreatePost = LazyComponents.CreatePost;
const EditPost = LazyComponents.EditPost;
const ViewPost = LazyComponents.ViewPost;

const CreatePoll = LazyComponents.CreatePoll;
const EditPoll = LazyComponents.EditPoll;
const ViewPoll = LazyComponents.ViewPoll;

const FamilyTree = LazyComponents.FamilyTree;
const FamilyTreeAddMember = LazyComponents.FamilyTreeAddMember;
const FamilyTreeViewMember = LazyComponents.FamilyTreeViewMember;
const FamilyTreeEditMember = LazyComponents.FamilyTreeEditMember;

const Chats = LazyComponents.Chats;
const ChatsViewChat = LazyComponents.ChatsViewChat;
const ChatsCreateChat = LazyComponents.ChatsCreateChat;
const ChatsEditChat = LazyComponents.ChatsEditChat;

const Events = LazyComponents.Events;
const EventsCreateEvent = LazyComponents.EventsCreateEvent;
const EventsViewEvent = LazyComponents.EventsViewEvent;
const EventsEditEvent = LazyComponents.EventsEditEvent;

const Kincoins = LazyComponents.Kincoins;
const Notifications = LazyComponents.Notifications;
const Will = LazyComponents.Will;
const CreateWill = LazyComponents.CreateWill;
const EditWill = LazyComponents.EditWill;
const ViewWill = LazyComponents.ViewWill;

const Settings = LazyComponents.Settings;
const Profile = LazyComponents.Profile;

export default function App() {
  return (
    <RootLayout>
      <GlobalErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <GoogleMapsProvider>
                <Suspense fallback={<GlobalSpinner />}>
                  <RouteNameDisplay />
                  <Routes>
                    <Route errorElement={<RouteErrorBoundary />}>
                      <Route
                        path={route_login}
                        element={
                          <Suspense fallback={<GlobalSpinner />}>
                            <Login />
                          </Suspense>
                        }
                      />
                      <Route
                        path={route_register}
                        element={
                          <Suspense fallback={<GlobalSpinner />}>
                            <Register />
                          </Suspense>
                        }
                      />
                      <Route
                        path=""
                        element={
                          <ProtectedRoutes>
                            <ThemeLanguageProvider
                              defaultTheme="light"
                              defaultLanguage="en"
                              storageKey="kintree-theme"
                              languageStorageKey="kintree-language"
                            >
                              <SidebarProvider>
                                <Suspense fallback={<GlobalSpinner />}>
                                  <ContentLayout />
                                </Suspense>
                              </SidebarProvider>
                            </ThemeLanguageProvider>
                          </ProtectedRoutes>
                        }
                      >
                        <Route
                          index
                          element={<Navigate to={route_foreroom} replace />}
                        />
                        <Route
                          path={route_foreroom}
                          element={<ForeroomLayout />}
                        >
                          <Route index element={<Foreroom />} />
                          <Route
                            path={route_create_post}
                            element={<CreatePost />}
                          />
                          <Route
                            path={route_create_poll}
                            element={<CreatePoll />}
                          />
                          <Route
                            path={route_view_post}
                            element={<ViewPost />}
                          />
                          <Route
                            path={route_view_poll}
                            element={<ViewPoll />}
                          />
                          <Route
                            path={route_edit_post}
                            element={<EditPost />}
                          />
                          <Route
                            path={route_edit_poll}
                            element={<EditPoll />}
                          />
                        </Route>
                        <Route
                          path={route_family_tree}
                          element={<FamilyTreeLayout />}
                        >
                          <Route index element={<FamilyTree />} />
                          <Route
                            path={route_family_tree_add_member}
                            element={<FamilyTreeAddMember />}
                          />
                          <Route
                            path={route_family_tree_view_member}
                            element={<FamilyTreeViewMember />}
                          />
                          <Route
                            path={route_family_tree_edit_member}
                            element={<FamilyTreeEditMember />}
                          />
                        </Route>

                        <Route path="/faqs" element={<FAQS />} />
                        <Route path="*" element={<PageNotFound />} />
                      </Route>
                    </Route>
                  </Routes>
                </Suspense>
              </GoogleMapsProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </GlobalErrorBoundary>
      <Toaster position="top-right" reverseOrder={false} />
    </RootLayout>
  );
}
