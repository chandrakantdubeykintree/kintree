import AsyncComponent from "@/components/async-component";
import { Card } from "@/components/ui/card";
import {
  useMergeRequest,
  useRespondToMergeRequest,
} from "@/hooks/useMergeTree";
import { decryptId } from "@/utils/encryption";
import { useParams } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/utils/formatDate";
import CustomScrollArea from "@/components/ui/custom-scroll-area";

export default function ViewTreeMergeRequest() {
  let { requestId } = useParams();
  requestId = decryptId(requestId);

  const { data: mergeRequest, isLoading } = useMergeRequest(requestId);
  const { mutate: respondToRequest, isLoading: isResponding } =
    useRespondToMergeRequest();
  const [duplicateMembers, setDuplicateMembers] = useState([]);

  // Function to find potential duplicates
  const findDuplicates = () => {
    if (!mergeRequest) return [];

    const duplicates = [];
    mergeRequest.sender_relatives.forEach((sender) => {
      mergeRequest.receiver_relatives.forEach((receiver) => {
        if (
          sender.first_name.toLowerCase() ===
            receiver.first_name.toLowerCase() &&
          sender.last_name.toLowerCase() === receiver.last_name.toLowerCase()
        ) {
          duplicates.push({
            sender,
            receiver,
            checked: true,
          });
        }
      });
    });
    return duplicates;
  };

  console.log(findDuplicates());
  console.log(mergeRequest.sender_relatives);

  const handleAccept = () => {
    const samePerson = duplicateMembers
      .filter((dup) => dup.checked)
      .map((dup) => ({
        sender_id: dup.sender.id,
        receiver_id: dup.receiver.id,
      }));

    respondToRequest({
      requestId,
      is_accepted: true,
      same_persons: samePerson,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <AsyncComponent>
      <Card className="container max-w-3xl mx-auto p-6 rounded-2xl h-full overflow-y-scroll no_scrollbar">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mergeRequest?.requested_by?.profile_pic_url} />
            <AvatarFallback>
              {mergeRequest?.requested_by?.first_name?.charAt(0)}
              {mergeRequest?.requested_by?.last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Merge Request</h1>
            <p className="text-sm text-gray-500">
              From {mergeRequest?.requested_by?.first_name}{" "}
              {mergeRequest?.requested_by?.last_name} as{" "}
              {mergeRequest?.type?.name}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(mergeRequest?.created_at)}
            </p>
          </div>
        </div>

        {/* Tree Members Count */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-sm font-medium">Their Tree Members</p>
            <p className="text-2xl font-bold">
              {mergeRequest?.sender_relatives_count}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-sm font-medium">Your Tree Members</p>
            <p className="text-2xl font-bold">
              {mergeRequest?.receiver_relatives_count}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Members to be merged</h2>
          <CustomScrollArea
            className="h-[450px] rounded-2xl border no_scrollbar"
            maxHeight="500px"
          >
            <div className="p-4 space-y-3">
              {mergeRequest?.sender_relatives.map((relative) => (
                <div
                  key={relative.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={relative.profile_pic_url} />
                    <AvatarFallback>
                      {relative.first_name?.charAt(0)}
                      {relative.last_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {relative.first_name} {relative.middle_name}{" "}
                      {relative.last_name}
                    </p>
                    {relative.date_of_birth && (
                      <p className="text-xs text-gray-500">
                        DOB: {formatDate(relative.date_of_birth)}
                      </p>
                    )}
                    {relative.relation && (
                      <p className="text-xs text-gray-500">
                        Relation: {relative.relation}
                      </p>
                    )}
                  </div>
                  {/* Indicate if this member is part of a duplicate pair */}
                  {findDuplicates().some(
                    (dup) => dup.sender.id === relative.id
                  ) && (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                      Duplicate Found
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CustomScrollArea>
        </div>

        {/* Duplicate Members Section */}
        {findDuplicates().length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Potential Duplicate Members
            </h2>
            <CustomScrollArea className="h-[200px] rounded-md border p-4">
              {findDuplicates().map((dup, index) => (
                <div key={index} className="flex items-center space-x-4 py-2">
                  <Checkbox
                    checked={dup.checked}
                    onCheckedChange={(checked) => {
                      const newDuplicates = [...duplicateMembers];
                      newDuplicates[index].checked = checked;
                      setDuplicateMembers(newDuplicates);
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {dup.sender.first_name} {dup.sender.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Appears in both trees
                    </p>
                  </div>
                </div>
              ))}
            </CustomScrollArea>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="rounded-full">
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isResponding}
            className="rounded-full"
          >
            {isResponding ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Accept & Merge
          </Button>
        </div>
      </Card>
    </AsyncComponent>
  );
}
