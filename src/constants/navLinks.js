import {
  ICON_CHAT,
  ICON_DELETE,
  ICON_EDIT,
  ICON_EVENT,
  ICON_FAMILYTREE,
  ICON_FOREROOM,
  ICON_KINCOINS,
  ICON_NOTIFICATION,
  ICON_PROFILE,
  ICON_SETTINGS,
  ICON_SHOP,
  ICON_USERNAME,
  ICON_WILL,
} from "./iconUrls";

export const mainNavLinks = [
  { path: "/foreroom", label: "Foreroom", icon: ICON_FOREROOM },
  { path: "/familytree", label: "Family Tree", icon: ICON_FAMILYTREE },
  { path: "/chats", label: "Chat", icon: ICON_CHAT },
  { path: "https://kintree.com/dna/", label: "DNA", icon: ICON_SHOP },
  { path: "/events", label: "Events", icon: ICON_EVENT },
  { path: "/kincoins", label: "Kincoins", icon: ICON_KINCOINS },
  { path: "/notifications", label: "Notifications", icon: ICON_NOTIFICATION },
  { path: "/will", label: "Will", icon: ICON_WILL },
  { path: "/profile", label: "Profile", icon: ICON_PROFILE },
  { path: "/settings", label: "Settings", icon: ICON_SETTINGS },
];

export const profileMenuItems = [
  { path: "/profile", label: "Profile", icon: ICON_USERNAME },
  { path: "/settings", label: "Settings", icon: ICON_SETTINGS },
];

export const publicLinks = [
  { path: "/blogs", label: "Blog", icon: "" },
  { path: "/about", label: "About", icon: "" },
  { path: "/login", label: "Login", icon: "" },
  { path: "/signup", label: "Sign up", icon: "" },
];

export const postDropDown = [
  { path: "editpost", label: "Edit Post", icon: ICON_EDIT },
  { path: "delete", label: "Delete", icon: ICON_DELETE },
];
