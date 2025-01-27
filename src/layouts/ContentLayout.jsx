import Navbar from "@/components/navbar";
import LeftSidebar from "@/components/left-sidebar";
import RightSidebar from "@/components/right-sidebar";
import { useSidebar } from "../context/SidebarContext";
import { useEffect } from "react";
import { useLocation } from "react-router";

export default function ContentLayout({ children }) {
  const { leftSidebarOpen, rightSidebarOpen, setSidebarsForRoute } =
    useSidebar();
  const location = useLocation();

  useEffect(() => {
    setSidebarsForRoute(location.pathname);
  }, [location.pathname, setSidebarsForRoute]);

  return (
    <div className="mx-auto">
      <div className="border-b bg-background sticky top-0 z-10 mb-4">
        <div className="mx-auto max-w-[1370px]">
          <Navbar />
        </div>
      </div>
      <main className={`max-w-[1370px] mx-auto px-4`}>
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-104px)]">
          {/* Left Sidebar - Hidden on mobile, shows on md and up if open */}
          {leftSidebarOpen && (
            <div className="hidden md:block md:col-span-3 lg:col-span-3 sticky top-[104px] overflow-y-scroll no_scrollbar">
              <LeftSidebar />
            </div>
          )}

          {/* Main Content - Responsive column spans */}
          <div
            className={`
              col-span-12 
              ${
                leftSidebarOpen
                  ? "md:col-span-9 lg:col-span-6"
                  : "md:col-span-9 lg:col-span-8"
              } 
              ${rightSidebarOpen ? "lg:col-span-6" : ""} 
              ${leftSidebarOpen && rightSidebarOpen ? "lg:col-span-6" : ""}
              overflow-y-scroll no_scrollbar relative
            `}
          >
            {children}
          </div>

          {/* Right Sidebar - Hidden on mobile and md, shows on lg and up if open */}
          {rightSidebarOpen && (
            <div className="hidden lg:block lg:col-span-3 sticky top-[104px] overflow-y-scroll no_scrollbar">
              <RightSidebar />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
