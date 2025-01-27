// import { ICON_USERNAME } from "@/constants/iconUrl";
import { useEvents } from "@/hooks/useEvents";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { capitalizeName, formatTimeAgoBirthDay } from "@/utils/stringFormat";
import ComponentLoading from "./component-loading";
import EventCard from "./event-card";
import UpcomingEventsCard from "./upcoming-events-card";
import ContactsListCard from "./contacts-list-card";

export default function ForeroomRight({
  birthDaysToday = [],
  birthDaysUpcoming = [],
  birthDaysPast = [],
  recentChatsList = [],
  contactsList = [],
}) {
  const { data, isLoading } = useEvents("upcoming");
  const eventsList = data?.pages?.flatMap((page) => page?.data?.events);
  if (isLoading) return <ComponentLoading />;
  return (
    <div className="grid gap-6">
      <Card className="w-full max-w-sm mx-auto shadow-sm rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle>Birthdays</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-sm font-semibold">Today</h2>
          <ul className="min-h-20">
            {birthDaysToday.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <span className="text-sm font-light">No Birthdays Today</span>
              </div>
            )}
            {birthDaysToday.map((birthday) => (
              <li key={birthday?.id} className="flex gap-2 mb-6">
                <div className="overflow-hidden w-[45px] rounded-full">
                  <img
                    src={birthday?.profile_picture}
                    className="w-[45px] rounded-full transform transition-transform duration-300 ease-in-out hover:scale-125"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">
                    {capitalizeName(birthday?.first_name)}{" "}
                    {capitalizeName(birthday?.last_name)}
                  </span>
                  <span className="text-sm font-light">
                    {formatTimeAgoBirthDay(birthday?.date_of_birth)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <h2 className="text-sm font-semibold">Recent</h2>
          <ul className="min-h-20">
            {birthDaysPast.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <span className="text-sm font-light">No Past Birthdays</span>
              </div>
            )}
            {birthDaysPast.map((birthday) => (
              <li
                key={birthday?.id}
                className="overflow-hidden flex gap-2 mb-6"
              >
                <div className="overflow-hidden w-[45px] rounded-full">
                  <img
                    src={birthday?.profile_picture}
                    className="w-[45px] rounded-full transform transition-transform duration-300 ease-in-out hover:scale-125"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">
                    {capitalizeName(birthday?.first_name)}{" "}
                    {capitalizeName(birthday?.last_name)}
                  </span>
                  <span className="text-sm font-light">
                    {formatTimeAgoBirthDay(birthday?.date_of_birth)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <h2 className="text-sm font-semibold">Upcoming</h2>
          <ul className="min-h-20">
            {birthDaysUpcoming.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <span className="text-sm font-light">
                  No Upcoming Birthdays
                </span>
              </div>
            )}
            {birthDaysUpcoming.map((birthday) => (
              <li
                key={birthday?.id}
                className="overflow-hidden flex gap-2 mb-6"
              >
                <div className="overflow-hidden w-[45px] rounded-full">
                  <img
                    src={birthday?.profile_picture}
                    className="w-[45px] rounded-full transform transition-transform duration-300 ease-in-out hover:scale-125"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">
                    {capitalizeName(birthday?.first_name)}{" "}
                    {capitalizeName(birthday?.last_name)}
                  </span>
                  <span className="text-sm font-light">
                    {formatTimeAgoBirthDay(birthday?.date_of_birth)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="w-full max-w-sm mx-auto shadow-sm rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle>Recent Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="overflow-y-scroll h-40 no_scrollbar">
            {recentChatsList.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <span className="text-sm font-light">No Recent Chats</span>
              </div>
            )}
            {recentChatsList.map((birthday) => (
              <li key={birthday?.id} className="flex items-center gap-2 mb-6">
                <div className="overflow-hidden w-[45px] rounded-full">
                  <img
                    src={birthday?.profile_picture}
                    className="w-[45px] rounded-full transform transition-transform duration-300 ease-in-out hover:scale-125"
                  />
                </div>
                <div className="">
                  <span className="text-sm font-semibold">
                    {capitalizeName(birthday?.first_name)}{" "}
                    {capitalizeName(birthday?.last_name)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <UpcomingEventsCard />
      <ContactsListCard />
    </div>
  );
}
