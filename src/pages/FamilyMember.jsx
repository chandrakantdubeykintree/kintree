import { useFamily, useMember } from "@/hooks/useFamily";
import { Link, useParams } from "react-router";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { capitalizeName, getInitials } from "@/utils/stringFormat";
import AsyncComponent from "@/components/async-component";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Share2, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/delete-member-dialog";
import { useAuth } from "@/context/AuthProvider";
import EditRelativeForm from "@/components/edit-relative-form";
import AddRelativeForm from "@/components/add-relative-form";

export default function FamilyMember() {
  const { id } = useParams();
  const { data: familyMember, isLoading } = useMember(id);
  const { user } = useAuth();
  const is_user_added_by_me = familyMember?.added_by?.id === user?.id;
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingRelative, setIsAddingRelative] = useState(false);

  const { data: familyTree } = useFamily();

  const familyMemberSelected = familyTree?.find((member) => member?.id === +id);

  const handleShareCredentials = () => {
    const credentials = `Username: ${familyMember?.username}\nPassword: ${familyMember?.password}`;
    navigator.clipboard.writeText(credentials);
    toast.success("Credentials copied to clipboard!");
  };

  const handleAddRelative = () => {
    setIsAddingRelative(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Implement delete API call
      toast.success("Member deleted successfully");
      // Navigate back or to appropriate page
    } catch (error) {
      toast.error("Failed to delete member");
    }
    setShowDeleteDialog(false);
  };

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

  return (
    <AsyncComponent isLoading={isLoading}>
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
                  <Badge
                    variant="outline"
                    className="text-primary rounded-full"
                  >
                    {familyMember?.relation}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-primary rounded-full"
                  >
                    {familyMember?.gender === "f" ? "Female" : "Male"}
                  </Badge>
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

              {/* Contact Information */}
              <InfoSection title="Contact Information">
                <InfoItem label="Email" value={familyMember?.email} />
                <InfoItem label="Phone" value={familyMember?.phone_no} />
                <InfoItem label="Username" value={familyMember?.username} />
              </InfoSection>

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
                    value={familyMember.additional_info.known_languages.join(
                      ", "
                    )}
                  />
                )}
              </InfoSection>

              {/* Regional Information */}
              <InfoSection title="Regional Information">
                <InfoItem
                  label="Religion"
                  value={familyMember?.regional_info?.religion}
                />
                <InfoItem
                  label="Caste"
                  value={familyMember?.regional_info?.caste}
                />
                <InfoItem
                  label="Sub Caste"
                  value={familyMember?.regional_info?.sub_caste}
                />
                <InfoItem
                  label="Gotra"
                  value={familyMember?.regional_info?.gotra}
                />
                <InfoItem
                  label="Sect"
                  value={familyMember?.regional_info?.sect}
                />
              </InfoSection>

              {/* Added By Information */}
              <InfoSection title="Added By">
                <div className="col-span-2 flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={familyMember?.added_by?.profile_pic_url}
                      alt="Added by"
                    />
                    <AvatarFallback>
                      {getInitials(familyMember?.added_by?.first_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {capitalizeName(familyMember?.added_by?.first_name)}{" "}
                      {capitalizeName(familyMember?.added_by?.last_name)}
                    </p>
                    <p className="text-sm text-gray-500">
                      @{familyMember?.added_by?.username}
                    </p>
                  </div>
                </div>
              </InfoSection>

              {/* Credentials Section */}
              <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-primary">
                    Login Credentials
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareCredentials}
                    className="flex items-center gap-2 rounded-full"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Credentials
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Username
                    </span>
                    <span className="font-medium">
                      {familyMember?.username}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Password
                    </span>
                    <span className="font-medium">
                      {familyMember?.password}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 justify-end">
                {is_user_added_by_me && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 rounded-full"
                    onClick={handleAddRelative}
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Relative
                  </Button>
                )}
                {is_user_added_by_me && !familyMember?.is_active && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 rounded-full"
                    onClick={handleEdit}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                )}
                {is_user_added_by_me && !familyMember?.is_active && (
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2 rounded-full"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        memberId={familyMember?.id}
        onConfirm={handleConfirmDelete}
        memberName={`${familyMember?.basic_info?.first_name} ${familyMember?.basic_info?.last_name}`}
      />
    </AsyncComponent>
  );
}
