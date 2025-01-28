import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWindowSize } from "@/hooks/useWindowSize";

export default function TutorialVideoDialog({ isOpen, onClose }) {
  const { width } = useWindowSize();
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className="max-w-[90%] w-[900px] max-h-[90%] p-0 overflow-hidden">
        <DialogHeader className="p-4">
          <DialogTitle>How to Add Family Member</DialogTitle>
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
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
