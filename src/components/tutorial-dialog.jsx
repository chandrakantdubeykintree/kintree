import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useTranslation } from "react-i18next";

export default function TutorialVideoDialog({ isOpen, onClose }) {
  const { width } = useWindowSize();
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className="max-w-[90%] w-[900px] max-h-[90%] p-0 overflow-hidden">
        <DialogHeader className="p-4">
          <DialogTitle>{t("how_to_add_family_member")}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full">
          <video
            className="w-full h-full"
            controls
            autoPlay
            src={
              width > 768
                ? "https://kintree.com/web-add-member.mp4"
                : "https://kintree.com/app-add-member.mp4"
            }
          >
            {t("your_browser_does_not_support_the_video_tag")}
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
