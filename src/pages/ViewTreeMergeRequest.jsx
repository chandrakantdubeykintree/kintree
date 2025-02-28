import AsyncComponent from "@/components/async-component";
import { Card } from "@/components/ui/card";
import {
  useCancelMergeRequest,
  useMergeRequest,
  useRespondToMergeRequest,
} from "@/hooks/useMergeTree";
import { decryptId } from "@/utils/encryption";
import { useNavigate, useParams } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/utils/formatDate";
import CustomScrollArea from "@/components/ui/custom-scroll-area";
import { route_family_tree } from "@/constants/routeEnpoints";

export default function ViewTreeMergeRequest() {
  let { requestId } = useParams();
  requestId = decryptId(requestId);

  const { data: mergeRequest, isLoading } = useMergeRequest(requestId);
  const { mutate: respondToRequest, isLoading: isResponding } =
    useRespondToMergeRequest();
  const [duplicateMembers, setDuplicateMembers] = useState([]);
  const [noDuplicates, setNoDuplicates] = useState(false);
  const navigate = useNavigate();
  const { mutate: cancelRequest, isLoading: isCancelling } =
    useCancelMergeRequest();

  // Add handleDecline function
  const handleDecline = () => {
    cancelRequest(requestId, {
      onSuccess: () => {
        navigate(route_family_tree, { replace: true });
      },
    });
  };

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

  const handleAccept = () => {
    if (findDuplicates().length > 0 && !noDuplicates) {
      const samePerson = duplicateMembers
        .filter((dup) => dup.checked)
        .map((dup) => ({
          sender_relative_id: dup.sender.id,
          receiver_relative_id: dup.receiver.id,
        }));

      respondToRequest({
        requestId,
        is_accepted: true,
        same_persons: samePerson,
      });
    } else {
      respondToRequest({
        requestId,
        is_accepted: true,
        // same_persons: [],
      });
    }
  };

  useEffect(() => {
    if (mergeRequest) {
      setDuplicateMembers(findDuplicates());
    }
  }, []);

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
            className="rounded-2xl border no_scrollbar"
            maxHeight="400px"
          >
            <div className="p-4 space-y-3">
              {mergeRequest?.sender_relatives?.map((relative) => (
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

        {duplicateMembers.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Potential Duplicate Members ({duplicateMembers.length})
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Review and confirm if these members are the same person
                </p>
              </div>
            </div>

            {!noDuplicates && (
              <CustomScrollArea
                className="rounded-2xl border p-4"
                maxHeight="400px"
              >
                {duplicateMembers.map((dup, index) => (
                  <div
                    key={index}
                    className="mb-4 last:mb-0 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left side - Receiver */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={dup.receiver.profile_pic_url} />
                            <AvatarFallback>
                              {dup.receiver.first_name?.charAt(0)}
                              {dup.receiver.last_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {dup.receiver.first_name} {dup.receiver.last_name}
                            </p>
                            <p className="text-xs text-gray-500">Your tree</p>
                            {dup.receiver.date_of_birth && (
                              <p className="text-xs text-gray-500">
                                DOB: {formatDate(dup.receiver.date_of_birth)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Center - Checkbox */}
                      <div className="mx-8 flex flex-col items-center">
                        <Checkbox
                          checked={dup.checked}
                          onCheckedChange={(checked) => {
                            const newDuplicates = [...duplicateMembers];
                            newDuplicates[index] = {
                              ...newDuplicates[index],
                              checked,
                            };
                            setDuplicateMembers(newDuplicates);
                          }}
                          className="h-5 w-5"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Same person
                        </p>
                      </div>

                      {/* Right side - Sender */}
                      <div className="flex-1">
                        <div className="flex items-center justify-end space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {dup.sender.first_name} {dup.sender.last_name}
                            </p>
                            <p className="text-xs text-gray-500">Their tree</p>
                            {dup.sender.date_of_birth && (
                              <p className="text-xs text-gray-500">
                                DOB: {formatDate(dup.sender.date_of_birth)}
                              </p>
                            )}
                          </div>
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={dup.sender.profile_pic_url} />
                            <AvatarFallback>
                              {dup.sender.first_name?.charAt(0)}
                              {dup.sender.last_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CustomScrollArea>
            )}

            {
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  checked={noDuplicates}
                  onCheckedChange={setNoDuplicates}
                  id="noDuplicates"
                />
                <label htmlFor="noDuplicates" className="text-sm text-gray-600">
                  These are different people despite same names
                </label>
              </div>
            }
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handleDecline}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
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
