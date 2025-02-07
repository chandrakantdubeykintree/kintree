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

export const CreatePoll = lazy(() => import("./pages/CreatePoll"));
// export const EditPoll = lazy(() => import("./pages/EditPoll"));
export const ViewPoll = lazy(() => import("./pages/ViewPoll"));

export const FamilyTree = lazy(() => import("./pages/FamilyTree"));
export const FamilyMember = lazy(() => import("./pages/FamilyMember"));
export const KintreeMember = lazy(() => import("./pages/KintreeMember"));
export const AddMember = lazy(() => import("./pages/AddMember"));
export const ViewMember = lazy(() => import("./pages/ViewMember"));
export const EditMember = lazy(() => import("./pages/EditMember"));

export const Chats = lazy(() => import("./pages/Chats"));
export const ViewChat = lazy(() => import("./pages/ViewChat"));
export const CreateChat = lazy(() => import("./pages/CreateChat"));
export const EditChat = lazy(() => import("./pages/EditChat"));

export const Profile = lazy(() => import("./pages/Profile"));
export const ViewProfile = lazy(() => import("./pages/ViewProfile"));

export const Settings = lazy(() => import("./pages/Settings"));
export const EditSettings = lazy(() => import("./pages/EditSettings"));

export const Notifications = lazy(() => import("./pages/Notifications"));

export const Events = lazy(() => import("./pages/Events"));
export const CreateEvent = lazy(() => import("./pages/CreateEvent"));
export const EditEvent = lazy(() => import("./pages/EditEvent"));
export const ViewEvent = lazy(() => import("./pages/ViewEvent"));

export const Kincoins = lazy(() => import("./pages/Kincoins"));

export const Will = lazy(() => import("./pages/Will"));
export const CreateWill = lazy(() => import("./pages/CreateWill"));
export const EditWill = lazy(() => import("./pages/EditWill"));
export const ViewWill = lazy(() => import("./pages/ViewWill"));
