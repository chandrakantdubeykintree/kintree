import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AsyncComponent from "@/components/async-component";
import { capitalizeName, getInitials } from "@/utils/stringFormat";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShareInviteDialog } from "@/components/share-invite-dialog";

const MemberCard = ({ active, member }) => {
  const [viewShareInviteDialog, setViewShareInviteDialog] = useState(() => ({
    modalOpen: false,
    selectedMemberInfo: {
      username: member?.username,
      password: member?.password,
    },
  }));
  console.log(member, member?.is_active);

  return (
    <AsyncComponent>
      <div className="relative h-full">
        <Card className="w-full h-full max-w-sm mx-auto shadow-lg rounded-lg overflow-hidden p-4 flex flex-col">
          <div
            className="relative w-full h-[84px] bg-cover bg-center rounded-lg"
            style={{
              backgroundImage: `url(${
                member?.profile_cover_pic_url ||
                "/illustrations/illustration_bg.png"
              })`,
            }}
          >
            <Avatar className="cursor-pointer absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-14 h-14 rounded-full border-2 border-brandPrimary transition-transform duration-300 ease-in-out hover:scale-105">
              <AvatarImage src={member?.profile_pic_url} alt="" />
              <AvatarFallback className="w-14 h-14 rounded-full text-sm font-normal text-center">
                {getInitials(member?.first_name || "") +
                  " " +
                  getInitials(member?.last_name || "")}
              </AvatarFallback>
            </Avatar>
          </div>

          <CardContent className="px-0 pt-8 pb-0 flex flex-col flex-grow justify-between">
            <div>
              <h2 className="text-sm font-semibold text-center">
                {capitalizeName(member?.first_name || "") +
                  " " +
                  capitalizeName(member?.last_name || "")}
              </h2>
              <p className="text-sm font-light text-center">
                {member?.relation || ""}
              </p>
            </div>
            <div className="flex justify-start items-end mt-6">
              {member?.is_user_added_by_me && member?.is_active !== 1 ? (
                <Button
                  variant="outline"
                  className="border border-brandPrimary rounded-l-full rounded-r-full text-brandPrimary"
                  onClick={() =>
                    setViewShareInviteDialog((prev) => ({
                      ...prev,
                      modalOpen: !prev.modalOpen,
                      selectedMemberInfo: {
                        username: member?.username,
                        password: member?.password,
                      },
                    }))
                  }
                  disabled={member?.is_active === 1}
                >
                  Share Invite
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="border border-brandPrimary rounded-l-full rounded-r-full text-brandPrimary"
                  // onClick={() => navigate(`/profile/${member?.username}`)}
                  disabled
                >
                  View Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="absolute bottom-4 -right-[11px]">
          <img
            src={member?.is_active === 1 ? "/active.png" : "/inactive.png"}
          />
        </div>
      </div>
      {viewShareInviteDialog?.modalOpen && (
        <ShareInviteDialog
          isOpen={viewShareInviteDialog?.modalOpen}
          onClose={() =>
            setViewShareInviteDialog({
              modalOpen: false,
            })
          }
          memberDetails={viewShareInviteDialog?.selectedMemberInfo}
        />
      )}
    </AsyncComponent>
  );
};

export default MemberCard;
