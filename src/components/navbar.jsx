import { NavLink, useNavigate } from "react-router";
import ThemeToggle from "./theme-toggle";
import ProfileDropDown from "./profile-dropdown";
import NotificationDropDown from "./notification-dropdown";
import LanguagesDropDown from "./languages-dropdown";
import { ICON_KINTREELOGO, ICON_KINTREELOGO_DARK } from "../constants/iconUrls";

import { useWindowSize } from "@/hooks/useWindowSize";
import { capitalizeName } from "@/utils/stringFormat";
import { useProfile } from "@/hooks/useProfile";
import AsyncComponent from "./async-component";
import { api_user_profile } from "@/constants/apiEndpoints";
import { useThemeLanguage } from "@/context/ThemeLanguageProvider";
import { route_foreroom } from "@/constants/routeEnpoints";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { useSearchUser } from "@/hooks/useUser";
import { useInView } from "react-intersection-observer";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!showSearch) setShowSearch(true); // Open dialog when user starts typing
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    try {
      // Save to recent searches
      const updatedSearches = [
        query,
        ...recentSearches.filter((item) => item !== query),
      ].slice(0, 5);

      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  // Get search results based on current query
  const { theme } = useThemeLanguage();
  const { width } = useWindowSize();
  const { profile: user, isProfileLoading } = useProfile(api_user_profile);

  const { ref, inView } = useInView();

  const {
    data: searchData,
    fetchNextPage,
    hasNextPage,
    isLoading: isSearchLoading,
  } = useSearchUser(searchQuery, 10);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <AsyncComponent isLoading={isProfileLoading}>
      <div className="h-[84px] flex justify-between items-center">
        <NavLink className="ml-2 lg:ml-4" to={route_foreroom}>
          <img
            src={theme === "light" ? ICON_KINTREELOGO : ICON_KINTREELOGO_DARK}
            alt="logo"
            className="w-[60px] h-12 transform transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </NavLink>
        <div className="hidden sm:block max-w-md w-full px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-full pl-10 pr-4 h-10 rounded-full"
              value={searchQuery}
              onChange={handleSearchInput} // Updated to use new handler
              onFocus={() => setShowSearch(true)} // Also open on focus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchQuery);
                }
              }}
            />
          </div>
        </div>
        <div className="sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(true)}
            className="rounded-full p-4 border bg-gray-50 dark:bg-gray-900"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-3 md:gap-3 lg:gap-4 mr-2 lg:mr-4">
          <LanguagesDropDown />
          <ThemeToggle />
          <NotificationDropDown />
          {width > 768 ? (
            <>
              <div className="line-clamp-1 overflow-hidden max-w-40 md:max-w-full">
                {capitalizeName(user?.basic_info?.first_name) +
                  " " +
                  capitalizeName(user?.basic_info?.last_name) || "username"}
              </div>
            </>
          ) : null}
          <ProfileDropDown />
        </div>
      </div>
      <Dialog
        open={showSearch}
        onOpenChange={() => {
          setShowSearch(false);
          setSearchQuery("");
        }}
      >
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <div className="space-y-4 rounded-2xl">
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-full pl-10 pr-4 h-10 rounded-full md:h-12"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchQuery);
                  }
                }}
              />
            </div>

            {/* Recent Searches */}
            {!searchQuery && recentSearches.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Recent Searches
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setSearchQuery(search);
                        handleSearch(search);
                      }}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchQuery && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Search Results
                </h4>
                <div className="space-y-2 max-h-[60vh] overflow-y-scroll no_scrollbar">
                  {searchData?.pages?.flatMap((page) => page.data.users)
                    .length > 0 ? (
                    <>
                      {searchData.pages.map((page) =>
                        page.data.users.map((user) => (
                          <div
                            key={user.user_id}
                            className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg cursor-pointer"
                            onClick={() => {
                              handleSearch(searchQuery);
                              navigate(`/kintree-member/${user.user_id}`);
                              setShowSearch(false);
                            }}
                          >
                            <img
                              src={user.profile_pic_url}
                              alt={user.first_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="font-medium">
                                {`${user.first_name} ${
                                  user.middle_name || ""
                                } ${user.last_name}`}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      {/* Infinite scroll trigger */}
                      <div ref={ref} className="h-10">
                        {isSearchLoading && (
                          <div className="text-center py-2">Loading...</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No results found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AsyncComponent>
  );
}
