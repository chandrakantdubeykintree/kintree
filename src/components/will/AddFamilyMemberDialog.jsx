import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useWill } from "@/hooks/useWill";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "../ui/card";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AddFamilyMemberDialog({
  willId,
  onSuccess,
  familyMembers,
  onCancel,
}) {
  const { t } = useTranslation();
  const { addMemberBeneficiaries, isAddingMemberBeneficiaries } = useWill();
  const familyMemberIdSchema = z.object({
    member_ids: z.array(z.number()).min(1, t("select_at_least_one_member")),
  });

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
        toast.success(t("member_added_successfully"));
        onSuccess();
      } else {
        toast.error(t("error_failed_to_add_member"));
      }
    } catch (error) {
      toast.error(t("error_failed_to_add_member"));
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
                    {member?.relation || "NA"}
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
          onClick={onCancel}
          type="button"
        >
          {t("cancel")}
        </Button>
        <Button
          className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          type="submit"
          disabled={isAddingMemberBeneficiaries}
        >
          {isAddingMemberBeneficiaries ? t("saving") : t("next")}
        </Button>
      </div>
    </form>
  );
}
