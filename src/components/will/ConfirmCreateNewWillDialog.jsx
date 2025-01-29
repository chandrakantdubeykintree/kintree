import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

export default function ConfirmCreateNewWillDialog({
  showConfirmDialog,
  setShowConfirmDialog,
  handleConfirmNewWill,
}) {
  return (
    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Will</DialogTitle>
          <DialogDescription>
            You already have an existing will. Creating a new will would delete
            your current will. Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowConfirmDialog(false)}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmNewWill}>
            Create New
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
