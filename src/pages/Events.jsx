import AsyncComponent from "@/components/async-component";
import ComponentLoading from "@/components/component-loading";
import EventCard from "@/components/event-card";
import GlobalSpinner from "@/components/global-spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { route_events_create_event } from "@/constants/routeEnpoints";
import ComponentErrorBoundary from "@/errorBoundaries/ComponentErrorBoundary";
import { useEvents } from "@/hooks/useEvents";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { NavLink } from "react-router";

export default function Events() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useEvents(activeTab);

  const eventsData = data?.pages?.flatMap((page) => page?.data?.events);
  const loaderRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <GlobalSpinner />;

  return (
    <AsyncComponent>
      <Card className="bg-background rounded-2xl h-full overflow-y-scroll no_scrollbar">
        <div className="w-full h-[131px] md:h-[160px] lg:h-[235px] mb-5 relative">
          <img
            src="/illustrations/illustration_12.png"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <div className="w-full flex justify-start h-[54px] gap-2 border-b relative px-4 mb-16 md:mb-0">
          <div
            className={`text-sm flex items-center cursor-pointer hover:bg-primary/90 hover:text-white hover:font-semibold hover:rounded-lg px-2 md:px-4  ${
              activeTab === "upcoming"
                ? "font-bold text-brandPrimary border-b-2 border-brandPrimary"
                : ""
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </div>
          <div
            className={`text-sm flex items-center cursor-pointer hover:bg-primary/90 hover:text-white hover:font-semibold hover:rounded-lg px-2 md:px-4  ${
              activeTab === "ongoing"
                ? "font-bold text-brandPrimary border-b-2 border-brandPrimary"
                : ""
            }`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing Events
          </div>
          <div
            className={`text-sm flex items-center cursor-pointer hover:bg-primary/90 hover:text-white hover:font-semibold hover:rounded-lg px-2 md:px-4  ${
              activeTab === "past"
                ? "font-bold text-brandPrimary border-b-2 border-brandPrimary"
                : ""
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </div>
          <NavLink to={route_events_create_event}>
            <Button className="absolute md:right-4 md:top-2 left-4 md:left-auto top-16 bg-brandPrimary hover:bg-brandPrimary/10 cursor-pointer text-white svg:fill-white py-2 px-4 text-sm rounded-full">
              <img src="/icons/plus.svg" className="h-4 w-4" /> Create Event
            </Button>
          </NavLink>
        </div>

        <ComponentErrorBoundary>
          <div className="rounded-lg bg-brandSecondary m-4 p-4">
            {eventsData?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventsData?.map((event) => (
                  <EventCard key={event.id} event={event} status={activeTab} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <img src="/illustrations/no-event.png" />
                <p className="text-gray-400">
                  Click on the Create Event button to plan a new event.
                </p>
              </div>
            )}

            {hasNextPage && (
              <div
                ref={loaderRef}
                className="h-12 flex justify-center items-center mt-6"
              >
                {isFetchingNextPage ? (
                  <ComponentLoading />
                ) : (
                  <span>Scroll to load more</span>
                )}
              </div>
            )}
          </div>
        </ComponentErrorBoundary>
      </Card>
    </AsyncComponent>
  );
}
