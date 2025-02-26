import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteMember } from "@/hooks/useFamily";
import { useTranslation } from "react-i18next";

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  memberName,
  memberId,
}) {
  const { mutateAsync, isLoading } = useDeleteMember();
  const { t } = useTranslation();
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("are_you_sure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("delete_member_confirmation")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutateAsync(memberId)}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
