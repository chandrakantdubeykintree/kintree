import { useEvents } from "@/hooks/useEvents";
import ComponentLoading from "./component-loading";
import EventCard from "./event-card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function UpcomingEventsCard() {
  const { data, isLoading } = useEvents("past");
  const eventsList = data?.pages?.flatMap((page) => page?.data?.events);
  if (isLoading) return <ComponentLoading />;
  return (
    <Card className="w-full max-w-sm mx-auto shadow-sm rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="bg-none border-none shadow-none">
        <ul className="overflow-y-scroll min-h-20 max-h-96 no_scrollbar gap-2 flex flex-col">
          {eventsList.length === 0 && (
            <div className="flex justify-center items-center h-full">
              <span className="text-sm font-light">No Upcoming Events</span>
            </div>
          )}
          {eventsList.map((event) => (
            <EventCard event={event} key={event?.id} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
