import Navbar from "@/components/navbar";
import LeftSidebar from "@/components/leftsidebar";
import RightSidebar from "@/components/rightsidebar";
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
        <div className="grid grid-cols-12 gap-4">
          {leftSidebarOpen && (
            <div className="col-span-3">
              <LeftSidebar />
            </div>
          )}
          <div
            className={`${
              !leftSidebarOpen && !rightSidebarOpen
                ? "col-span-12"
                : !leftSidebarOpen || !rightSidebarOpen
                ? "col-span-9"
                : "col-span-6"
            }`}
          >
            {children}
          </div>
          {rightSidebarOpen && (
            <div className="col-span-3">
              <RightSidebar />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
