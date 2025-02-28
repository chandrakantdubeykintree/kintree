import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCreateMergeRequest } from "@/hooks/useMergeTree";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/utils/stringFormat";
import CustomScrollArea from "./ui/custom-scroll-area";
import toast from "react-hot-toast";

// Add this helper function at the top of your component
const getRelationLabel = (value) => {
  const relations = {
    1: "Parent",
    2: "Child",
    3: "Spouse",
    4: "Sibling",
  };
  return relations[value] || "";
};

export default function MergeRequestForm({
  isOpen,
  onClose,
  userId,
  familyMembers,
}) {
  const { mutate: createRequest, isLoading } = useCreateMergeRequest();
  const [formData, setFormData] = useState({
    user_id: userId,
    requestor_id_on_receiver_tree: null,
    relation_type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add validation check
    if (!formData.relation_type) {
      toast.error("Please select a relation type");
      return;
    }

    // if (!formData.requestor_id_on_receiver_tree) {
    //   toast.error("Please select a family member");
    //   return;
    // }

    createRequest(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isFormValid = Boolean(formData.relation_type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] w-[425px] rounded-2xl sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Send Tree Merge Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Are you in reciever's family tree?</Label>
            <Select
              value={formData.requestor_id_on_receiver_tree?.toString()}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  requestor_id_on_receiver_tree: Number(value),
                })
              }
            >
              <SelectTrigger className="w-full h-10 md:h-12 rounded-full">
                <SelectValue placeholder="Select family member" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <CustomScrollArea maxHeight="200px">
                  {familyMembers?.map((member) => (
                    <SelectItem
                      key={member.id}
                      value={member.id.toString()}
                      className="h-16 rounded-2xl cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.photo} alt={member.name} />
                          <AvatarFallback>
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-sm text-gray-500">
                            {member.relation}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </CustomScrollArea>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relation_type">Relation Type</Label>
            <Select
              value={formData.relation_type?.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, relation_type: Number(value) })
              }
            >
              <SelectTrigger className="w-full h-10 md:h-12 rounded-full">
                <SelectValue
                  placeholder={
                    formData.relation_type
                      ? getRelationLabel(formData.relation_type)
                      : "Select relation type"
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem
                  value="1"
                  className="h-10 rounded-2xl cursor-pointer"
                >
                  Parent
                </SelectItem>
                <SelectItem
                  value="2"
                  className="h-10 rounded-2xl cursor-pointer"
                >
                  Child
                </SelectItem>
                <SelectItem
                  value="3"
                  className="h-10 rounded-2xl cursor-pointer"
                >
                  Spouse
                </SelectItem>
                <SelectItem
                  value="4"
                  className="h-10 rounded-2xl cursor-pointer"
                >
                  Sibling
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="rounded-full"
            >
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
