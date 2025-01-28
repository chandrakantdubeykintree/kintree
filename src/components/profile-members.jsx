import { useFamilyMembers } from "@/hooks/useFamily";
import MemberCard from "./member-card";
import { Badge } from "@/components/ui/badge";
import ComponentLoading from "@/components/component-loading";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AsyncComponent from "@/components/async-component";
import { cn } from "@/lib/utils";

export default function ProfileMembers() {
  const { data: members, isLoading } = useFamilyMembers();
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [filterBy, setFilterBy] = useState("all");
  useEffect(() => {
    function handleFilterMembers() {
      if (filterBy === "active") {
        setFilteredMembers(
          members?.filter((member) => member?.is_active === 1)
        );
      } else if (filterBy === "inactive") {
        setFilteredMembers(
          members?.filter((member) => member?.is_active === 0)
        );
      } else if (filterBy === "all") {
        setFilteredMembers(members);
      }
    }
    handleFilterMembers();
  }, [filterBy]);

  useEffect(() => {
    if (members) {
      setFilteredMembers(members);
    }
  }, [members]);

  if (isLoading) return <ComponentLoading />;

  if (!members)
    return (
      <div>
        <h1>No Members</h1>
        <Button className="rounded-full">Add Members</Button>
      </div>
    );

  return (
    <AsyncComponent>
      <div className="flex gap-4 overflow-x-scroll no_scrollbar">
        <Badge
          className={cn(
            "py-2 px-4 cursor-pointer rounded-l-full rounded-r-full text-sm bg-indigo-950 whitespace-nowrap",
            filterBy === "all" ? "bg-brandPrimary text-white" : ""
          )}
          onClick={() => setFilterBy("all")}
        >
          All ({members?.length || 0})
        </Badge>
        <Badge
          className={cn(
            "py-2 px-4 cursor-pointer rounded-l-full rounded-r-full text-sm bg-indigo-950 whitespace-nowrap",
            filterBy === "active" ? "bg-brandPrimary text-white" : ""
          )}
          onClick={() => setFilterBy("active")}
        >
          Active (
          {members?.filter((member) => member?.is_active === 1)?.length || 0})
        </Badge>
        <Badge
          className={cn(
            "py-2 px-4 cursor-pointer rounded-l-full rounded-r-full text-sm bg-indigo-950 whitespace-nowrap",
            filterBy === "inactive" ? "bg-brandPrimary text-white" : ""
          )}
          onClick={() => setFilterBy("inactive")}
        >
          Inactive (
          {members?.filter((member) => member?.is_active === 0)?.length || 0})
        </Badge>
      </div>
      {filteredMembers?.length > 0 ? (
        <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-brandSecondary p-4 rounded-lg">
          {filteredMembers?.map((member) => (
            <MemberCard
              key={member.id}
              active={member?.is_active === 1 ? true : false}
              member={member}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <img src="/illustrations/no_member_picture.png" />
          <p className="text-gray-400">
            Click on the Add Members button to add a new member.
          </p>
        </div>
      )}
    </AsyncComponent>
  );
}
