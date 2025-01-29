import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  const [routeConfig, setRouteConfig] = useState({
    "/foreroom": { left: true, right: true },
    "/createpost": { left: true, right: true },
    "/editpost": { left: true, right: true },
    "/viewpost": { left: true, right: true },
    "/createpoll": { left: true, right: true },
    "/editpoll": { left: true, right: true },
    "/viewpoll": { left: true, right: true },
    "/familytree": { left: true, right: false },
    "/family-member": { left: true, right: false },
    "/chats": { left: true, right: false },
    "/events": { left: true, right: false },
    "/kincoins": { left: true, right: true },
    "/notifications": { left: true, right: true },
    "/will": { left: true, right: false },
    "/will/create-will": { left: true, right: false },
    "/will/edit-will": { left: true, right: false },
    "/will/view-will": { left: true, right: false },
    "/profile": { left: true, right: false },
    "/settings": { left: true, right: false },
  });

  const [currentRoute, setCurrentRoute] = useState("/");

  const toggleLeftSidebar = () => {
    const config = routeConfig[currentRoute] || { left: true, right: true };
    if (config.left) {
      setRouteConfig((prev) => ({
        ...prev,
        [currentRoute]: { ...prev[currentRoute], left: !leftSidebarOpen },
      }));
      setLeftSidebarOpen((prev) => !prev);
    } else {
      setLeftSidebarOpen(true);
      setRouteConfig((prev) => ({
        ...prev,
        [currentRoute]: { ...prev[currentRoute], left: true },
      }));
    }
  };

  const toggleRightSidebar = () => {
    const config = routeConfig[currentRoute] || { left: true, right: true };
    if (config.right) {
      setRouteConfig((prev) => ({
        ...prev,
        [currentRoute]: { ...prev[currentRoute], right: !rightSidebarOpen },
      }));
      setRightSidebarOpen((prev) => !prev);
    } else {
      setRightSidebarOpen(true);
      setRouteConfig((prev) => ({
        ...prev,
        [currentRoute]: { ...prev[currentRoute], right: true },
      }));
    }
  };

  const setSidebarsForRoute = (path) => {
    setCurrentRoute(path);
    const config = routeConfig[path] || { left: true, right: true };
    if (leftSidebarOpen !== config.left) {
      setLeftSidebarOpen(config.left);
    }
    if (rightSidebarOpen !== config.right) {
      setRightSidebarOpen(config.right);
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        leftSidebarOpen,
        rightSidebarOpen,
        toggleLeftSidebar,
        toggleRightSidebar,
        setSidebarsForRoute,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
