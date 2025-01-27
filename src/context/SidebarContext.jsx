import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  const toggleLeftSidebar = () => setLeftSidebarOpen((prev) => !prev);
  const toggleRightSidebar = () => setRightSidebarOpen((prev) => !prev);

  const setSidebarsForRoute = (path) => {
    // Configure which routes should have which sidebars open
    const routeConfig = {
      "/foreroom": { left: true, right: true },
      "/createpost": { left: true, right: true },
      "/createpoll": { left: true, right: true },
      "/editpost": { left: true, right: true },
      "/viewpost": { left: true, right: true },
      "/editpoll": { left: true, right: true },
      "/viewpoll": { left: true, right: true },
      "/familytree": { left: true, right: false },
      "/profile": { left: true, right: false },
      "/chats": { left: true, right: false },
    };

    const config = routeConfig[path] || { left: true, right: true };
    setLeftSidebarOpen(config.left);
    setRightSidebarOpen(config.right);
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
