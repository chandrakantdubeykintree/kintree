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
  { path: "/foreroom", label: "foreroom", icon: ICON_FOREROOM },
  { path: "/familytree", label: "family_tree", icon: ICON_FAMILYTREE },
  { path: "/chats", label: "chat", icon: ICON_CHAT },
  { path: "https://kintree.com/dna/", label: "dna", icon: ICON_SHOP },
  { path: "/events", label: "events", icon: ICON_EVENT },
  { path: "/kincoins", label: "kincoins", icon: ICON_KINCOINS },
  { path: "/notifications", label: "notifications", icon: ICON_NOTIFICATION },
  { path: "/will", label: "will", icon: ICON_WILL },
  { path: "/profile", label: "profile", icon: ICON_PROFILE },
  { path: "/settings", label: "settings", icon: ICON_SETTINGS },
];

export const profileMenuItems = [
  { path: "/profile", label: "profile", icon: ICON_USERNAME },
  { path: "/settings", label: "settings", icon: ICON_SETTINGS },
];

export const publicLinks = [
  { path: "/blogs", label: "blog", icon: "" },
  { path: "/about", label: "about", icon: "" },
  { path: "/login", label: "login", icon: "" },
  { path: "/signup", label: "signup", icon: "" },
];

export const postDropDown = [
  { path: "editpost", label: "edit_post", icon: ICON_EDIT },
  { path: "delete", label: "delete", icon: ICON_DELETE },
];
