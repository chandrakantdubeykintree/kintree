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
      "/profile": { left: true, right: false },
      "/chats": { left: false, right: true },
      // Add more routes as needed
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
