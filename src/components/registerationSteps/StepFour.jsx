import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profileImage } from "@/constants/presetAvatars";

export function StepFour({ register, errors, setValue, watch }) {
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const watchedImage = watch("profile_image");

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profile_image", file);
      setSelectedPresetId(null);
      setValue("preseted_profile_image_id", null);
    }
  };

  const handlePresetSelect = (id) => {
    setSelectedPresetId(id);
    setValue("preseted_profile_image_id", id);
    setValue("profile_image", null);
  };

  const handleSkip = () => {
    setValue("skipped", 1);
    setValue("profile_image", null);
    setValue("preseted_profile_image_id", null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          id="profile_image"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <label
          htmlFor="profile_image"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={watchedImage ? URL.createObjectURL(watchedImage) : undefined}
              alt="Profile"
            />
            <AvatarFallback>Upload</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Click to upload your photo
          </span>
        </label>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {profileImage("m").map((avatar) => (
          <Button
            key={avatar.id}
            type="button"
            variant="outline"
            className={cn(
              "p-0 h-auto aspect-square",
              selectedPresetId === avatar.id && "ring-2 ring-brandPrimary"
            )}
            onClick={() => handlePresetSelect(avatar.id)}
          >
            <img
              src={avatar.url}
              alt={`Avatar ${avatar.id}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </Button>
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={handleSkip}
        className="text-muted-foreground"
      >
        Skip for now
      </Button>

      {errors.profile_image && (
        <span className="text-sm text-red-500 text-center">
          {errors.profile_image.message}
        </span>
      )}
    </div>
  );
}
