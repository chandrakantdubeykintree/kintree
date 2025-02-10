import { useFamily, useMember } from "@/hooks/useFamily";
import { Link, useNavigate, useParams } from "react-router";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { capitalizeName, getInitials } from "@/utils/stringFormat";
import AsyncComponent from "@/components/async-component";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import {  useState, useEffect } from "react";
import EditRelativeForm from "@/components/edit-relative-form";
import AddRelativeForm from "@/components/add-relative-form";
import { toast } from 'react-hot-toast';

import ComponentLoading from "@/components/component-loading";

export default function KintreeMember() {
  const { id } = useParams();
  const { data: familyMember, isLoading } = useMember(id);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingRelative, setIsAddingRelative] = useState(false);
  const navigate = useNavigate()

  const { data: familyTree } = useFamily();

  const familyMemberSelected = familyTree?.find((member) => member?.id === +id);

  const InfoSection = ({ title, children }) => (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-primary">{title}</h2>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );

  const InfoItem = ({ label, value }) => {
    // if (!value) return null;
    return (
      <div className="flex flex-col">
        <span className="text-sm text-gray-800 dark:text-gray-400">
          {label}
        </span>
        <span className="text-sm font-medium">{value || "--"}</span>
      </div>
    );
  };

  // Remove the direct navigation
  if (isLoading) {
    return <ComponentLoading />;
  }
  
  

  return (
    <AsyncComponent>
      <div className="w-full">
        <Card className="w-full shadow-sm border-0 rounded-2xl overflow-hidden">
          {/* Cover Image */}
          <div
            className="relative w-full h-[200px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                familyMember?.profile_cover_pic_url ||
                "/illustrations/illustration_bg.png"
              })`,
            }}
          >
            {/* Profile Image */}
            <Avatar className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 border-4 border-white">
              <AvatarImage src={familyMember?.profile_pic_url} alt="Profile" />
              <AvatarFallback className="text-2xl">
                {getInitials(familyMember?.basic_info?.first_name) +
                  " " +
                  getInitials(familyMember?.basic_info?.last_name)}
              </AvatarFallback>
            </Avatar>

            <div className="absolute top-4 left-4 h-4 w-4 flex items-center justify-center cursor-pointer rounded-full p-3 bg-primary border border-primary-foreground">
              <Link to="/familytree">
                <ArrowLeft className="w-5 h-5 text-primary-foreground" />
              </Link>
            </div>
          </div>

          {isEditing ? (
            <EditRelativeForm
              id={familyMember.id}
              first_name={familyMember.basic_info.first_name}
              middle_name={familyMember.basic_info.middle_name}
              last_name={familyMember.basic_info.last_name}
              email={familyMember.email}
              phone_no={familyMember.phone_no}
              is_alive={familyMember.is_alive}
              age_range_id={familyMember.age_range_id}
              onCancel={() => setIsEditing(false)}
              onSuccess={() => {
                setIsEditing(false);
              }}
            />
          ) : isAddingRelative ? (
            <AddRelativeForm
              id={familyMemberSelected?.id}
              fid={familyMemberSelected?.fid}
              mid={familyMemberSelected?.mid}
              pid={familyMemberSelected?.pids[0]}
              gender={familyMemberSelected?.gender}
              onCancel={() => setIsAddingRelative(false)}
              onSuccess={() => {
                setIsAddingRelative(false);
                // Optionally refresh data
              }}
            />
          ) : (
            /* Existing profile view JSX */
            <div className="mt-16 p-2 md:p-4 lg:p-6">
              {/* Basic Info Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">
                  {capitalizeName(familyMember?.basic_info?.first_name)}{" "}
                  {capitalizeName(familyMember?.basic_info?.middle_name)}{" "}
                  {capitalizeName(familyMember?.basic_info?.last_name)}
                </h1>
                <p className="text-gray-600">@{familyMember?.username}</p>
                <div className="flex gap-2 justify-center mt-2">
                  {familyMember?.relation ? (
                    <Badge
                      variant="outline"
                      className="text-primary rounded-full"
                    >
                      {familyMember?.relation}
                    </Badge>
                  ) : null}
                  {familyMember?.gender ? (
                    <Badge
                      variant="outline"
                      className="text-primary rounded-full"
                    >
                      {familyMember?.gender === "f" ? "Female" : "Male"}
                    </Badge>
                  ) : null}
                  <Badge
                    variant="outline"
                    className={
                      familyMember?.is_alive
                        ? "text-green-600 rounded-full"
                        : "text-red-600 rounded-full"
                    }
                  >
                    {familyMember?.is_alive ? "Alive" : "Deceased"}
                  </Badge>
                </div>
                {familyMember?.basic_info?.bio && (
                  <p className="mt-4 text-gray-600">
                    {familyMember.basic_info.bio}
                  </p>
                )}
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold">
                    {familyMember?.post_count}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Posts
                  </p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold">
                    {familyMember?.event_count}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Events
                  </p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold">
                    {familyMember?.attachments?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Attachments
                  </p>
                </div>
              </div>

              

              {/* Additional Information */}
              <InfoSection title="Additional Information">
                <InfoItem
                  label="Birth Place"
                  value={familyMember?.additional_info?.birth_place}
                />
                <InfoItem
                  label="Native Place"
                  value={familyMember?.additional_info?.native_place}
                />
                <InfoItem
                  label="Current City"
                  value={familyMember?.additional_info?.current_city}
                />
                <InfoItem
                  label="Blood Group"
                  value={familyMember?.additional_info?.blood_group}
                />
                <InfoItem
                  label="Occupation"
                  value={familyMember?.additional_info?.occupation}
                />
                <InfoItem
                  label="Relationship Status"
                  value={familyMember?.additional_info?.relationship_status}
                />
                <InfoItem
                  label="Mother Tongue"
                  value={familyMember?.additional_info?.mother_tongue}
                />
                {familyMember?.additional_info?.known_languages?.length > 0 && (
                  <InfoItem
                  label="Known Languages"
                  value={familyMember.additional_info.known_languages
                    .map(lang => lang.name)
                    .join(", ")}
                />
                )}
              </InfoSection>

             
            </div>
          )}
        </Card>
      </div>
    </AsyncComponent>
  );
}
