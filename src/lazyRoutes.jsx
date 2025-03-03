import { lazy } from "react";

export const RootLayout = lazy(() => import("./layouts/RootLayout"));
export const ContentLayout = lazy(() => import("./layouts/ContentLayout"));

export const Login = lazy(() => import("./pages/Login"));
export const Register = lazy(() => import("./pages/Register"));
export const RegisterStep = lazy(() => import("./pages/RegisterStep"));
export const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
export const ForgotUsername = lazy(() => import("./pages/ForgotUsername"));

export const Foreroom = lazy(() => import("./pages/Foreroom"));

export const CreatePost = lazy(() => import("./pages/CreatePost"));
export const EditPost = lazy(() => import("./pages/EditPost"));
export const ViewPost = lazy(() => import("./pages/ViewPost"));

export const CreateReciepe = lazy(() => import("./pages/CreateReciepe"));
export const EditReciepe = lazy(() => import("./pages/EditReciepe"));
export const ViewReciepe = lazy(() => import("./pages/ViewReciepe"));

export const CreatePoll = lazy(() => import("./pages/CreatePoll"));
export const ViewPoll = lazy(() => import("./pages/ViewPoll"));

export const FamilyTree = lazy(() => import("./pages/FamilyTree"));
export const FamilyMember = lazy(() => import("./pages/FamilyMember"));
export const KintreeMember = lazy(() => import("./pages/KintreeMember"));
export const ViewMember = lazy(() => import("./pages/ViewMember"));

export const Chats = lazy(() => import("./pages/Chats"));
export const ViewChat = lazy(() => import("./pages/ViewChat"));

export const Profile = lazy(() => import("./pages/Profile"));

export const Settings = lazy(() => import("./pages/Settings"));

export const NotificationsPage = lazy(() =>
  import("./pages/NotificationsPage")
);

export const Events = lazy(() => import("./pages/Events"));
export const CreateEvent = lazy(() => import("./pages/CreateEvent"));
export const EditEvent = lazy(() => import("./pages/EditEvent"));
export const ViewEvent = lazy(() => import("./pages/ViewEvent"));

export const Kincoins = lazy(() => import("./pages/Kincoins"));

export const Will = lazy(() => import("./pages/Will"));
export const CreateWill = lazy(() => import("./pages/CreateWill"));
export const EditWill = lazy(() => import("./pages/EditWill"));
export const ViewWill = lazy(() => import("./pages/ViewWill"));
