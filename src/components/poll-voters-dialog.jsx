import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/stringFormat";
import { Link } from "react-router";

export default function PollVotersDialog({
  open,
  onOpenChange,
  voters,
  optionText,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Voted for: {optionText}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-4">
            {voters?.map((voter) => (
              <Link
                key={voter.id}
                to={`/profile/${voter.id}`}
                className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => onOpenChange(false)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={voter.profile_pic_url} />
                  <AvatarFallback>
                    {getInitials(voter.first_name)}{" "}
                    {getInitials(voter.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {voter.first_name} {voter.last_name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {voter.designation}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
