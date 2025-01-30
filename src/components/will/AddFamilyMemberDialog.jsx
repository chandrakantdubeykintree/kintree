import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useWill } from "@/hooks/useWill";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "../ui/card";
import { User } from "lucide-react";

const familyMemberIdSchema = z.object({
  member_ids: z
    .array(z.number())
    .min(1, "At least one member must be selected"),
});

export default function AddFamilyMemberDialog({
  willId,
  onSuccess,
  familyMembers,
}) {
  const { addMemberBeneficiaries, isAddingMemberBeneficiaries } = useWill();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(familyMemberIdSchema),
  });

  const handleCheckboxChange = (memberId) => {
    const currentValues = getValues("member_ids") || [];
    const newValues = currentValues.includes(memberId)
      ? currentValues.filter((id) => id !== memberId)
      : [...currentValues, memberId];

    setValue("member_ids", newValues, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      const response = await addMemberBeneficiaries({
        willId,
        memberIds: data.member_ids,
      });
      if (response.success) {
        toast.success("Family members added successfully");
        onSuccess();
      } else {
        toast.error("Failed to add family members");
      }
    } catch (error) {
      console.error("Error adding family members:", error);
      toast.error("Failed to add family members");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4 overflow-y-auto no_scrollbar">
        {familyMembers?.map((member) => (
          <Card key={member.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {member?.profile_picture ? (
                    <img
                      src={member?.profile_picture}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{member?.first_name}</h3>
                  <p className="text-sm text-gray-500">
                    {member?.relation || "No relation specified"}
                  </p>
                  <div className="text-sm text-gray-500 mt-1">
                    {member?.email && <div>{member?.email}</div>}
                    {member?.phone_no && (
                      <div>
                        {member?.phone_country_code} {member?.phone_no}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Checkbox
                id={`member-${member.id}`}
                checked={getValues("member_ids")?.includes(member.id)}
                onCheckedChange={() => handleCheckboxChange(member.id)}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-4 gap-4">
        <Button
          className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          variant="outline"
          onClick={onSuccess}
        >
          Cancel
        </Button>
        <Button
          className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          type="submit"
          disabled={isAddingMemberBeneficiaries}
        >
          {isAddingMemberBeneficiaries ? "Adding..." : "Next"}
        </Button>
      </div>
    </form>
  );
}
