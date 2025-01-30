import AsyncComponent from "@/components/async-component";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { route_foreroom } from "@/constants/routeEnpoints";
import { NavLink } from "react-router";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router";
import {
  useDeleteAttachment,
  useUploadAttachment,
} from "@/hooks/useAttachments";
import toast from "react-hot-toast";
import { useCreatePost } from "@/hooks/usePosts";
import FeelingsDropDown from "@/components/feelings-dropdown";
import { useAlbums } from "@/hooks/useAlbums";
import PrivacyDropdown from "@/components/privacy-dropdown";

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const SUPPORTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const getWordCount = (text) => {
  if (!text) return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

export default function CreatePost() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [caption, setCaption] = useState("");
  const wordCount = getWordCount(caption);
  const { data: albumsList } = useAlbums();

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [privacy, setPrivacy] = useState({
    id: 1,
    title: "Global",
    desc: "Anyone on Kintree",
    icon: "/privacy/web.svg",
  });
  const [selectedAlbum, setSelectedAlbum] = useState();
  const [feelings, setFeelings] = useState();
  const navigate = useNavigate();

  const isValidCaption = caption.trim().length >= 5;
  const hasMedia = uploadedAttachments.length > 0;
  const isValidPost = isValidCaption || hasMedia;
  const charCount = caption.length;
  const isOverLimit = charCount > 1000;
  const remainingChars = 1000 - charCount;

  const {
    mutate: createPost,
    isLoading: isCreatingPost,
    isError,
    error,
  } = useCreatePost();

  const { mutateAsync: uploadAttachment } = useUploadAttachment();
  const { mutate: deleteAttachment, isLoading: isDeleting } =
    useDeleteAttachment();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];

    // Check each file individually
    for (const file of files) {
      if (
        !SUPPORTED_IMAGE_TYPES.includes(file.type) &&
        !SUPPORTED_VIDEO_TYPES.includes(file.type)
      ) {
        toast.error(
          `"${file.name}" - Unsupported file type. Please use JPG, PNG, GIF, WEBP, MP4, MOV, or WEBM.`
        );
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" - File size exceeds 10MB limit.`);
        continue;
      }

      // Check if adding this file would exceed the 10 file limit
      if (mediaFiles.length + validFiles.length >= 10) {
        toast.error("Maximum 10 files allowed");
        break;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      return;
    }

    setMediaFiles((prev) => [...prev, ...validFiles]);

    setIsUploading(true);
    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append("files[]", file);
      });

      const result = await uploadAttachment(formData);
      const newAttachments = result?.data || [];
      setUploadedAttachments((prev) => [...prev, ...newAttachments]);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = async (index) => {
    const attachmentToDelete = uploadedAttachments[index];

    if (!attachmentToDelete) {
      return;
    }

    deleteAttachment(attachmentToDelete.id, {
      onSuccess: () => {
        setMediaFiles((prev) => prev.filter((_, i) => i !== index));
        setUploadedAttachments((prev) => prev.filter((_, i) => i !== index));
      },
      onError: (error) => {
        toast.error("Failed to delete file");
        console.error("Delete error:", error);
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidPost) {
      toast.error("Please add either a caption or media files");
      return;
    }

    if (uploadedAttachments.length > 10) {
      toast.error("Please add less than 10 media files");
      return;
    }

    const postData = {
      body: caption,
      feeling_id: feelings?.id || null,
      album_id: selectedAlbum?.id || null,
      // shared_post_id: 1,
      attachment_ids: uploadedAttachments.map((attachment) => attachment.id),
      privacy: privacy.id,
    };

    createPost(postData, {
      onSuccess: () => {
        navigate("/", {
          state: { newPost: true },
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create post");
      },
    });
  };
  return (
    <AsyncComponent>
      <div className="w-full mx-auto lg:px-0 pb-6 rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <NavLink
            to={route_foreroom}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <span className="h-8 w-8 rounded-full hover:bg-sky-100 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </span>
            Back to Foreroom
          </NavLink>
        </div>
        <AsyncComponent>
          <Card className="w-full">
            <form onSubmit={handleSubmit}>
              <CardHeader className="flex flex-row flex-wrap justify-between items-center">
                <div className="text-xl font-bold">Create Photo/Video Post</div>
                <PrivacyDropdown
                  selectedPrivacy={privacy}
                  setSelectedPrivacy={setPrivacy}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Caption</Label>
                    <span
                      className={`text-sm ${
                        isOverLimit ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      {charCount}/1000 characters
                    </span>
                  </div>
                  <Textarea
                    placeholder="Type your message here."
                    rows="6"
                    value={caption}
                    onChange={(e) => {
                      const newText = e.target.value;
                      if (newText.length <= 1000) {
                        setCaption(newText);
                      }
                    }}
                    maxLength={1000}
                    className={`lg:text-[16px] ${
                      isOverLimit
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  {isOverLimit && (
                    <p className="text-sm text-red-500">
                      Caption cannot exceed 1000 characters
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="relative">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={URL.createObjectURL(file)}
                            className="w-full h-32 object-cover rounded-lg"
                            controls
                          />
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 rounded-full"
                          onClick={() => removeFile(index)}
                          disabled={isDeleting || isUploading}
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}

                    {mediaFiles.length < 10 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-32 w-full"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <ImagePlus className="h-6 w-6" />
                        )}
                      </Button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-gray-500 w-full text-center">
                  {!hasMedia &&
                    !isValidCaption &&
                    "Add either a caption or media files"}
                </div>
                <div className="flex justify-between items-center w-full">
                  <FeelingsDropDown
                    selectedFeeling={feelings}
                    setSelectedFeeling={setFeelings}
                  />
                  <Button
                    type="submit"
                    className="rounded-full"
                    disabled={isUploading || isCreatingPost || !isValidPost}
                  >
                    {isCreatingPost ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating Post...
                      </>
                    ) : (
                      "Create Post"
                    )}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </AsyncComponent>
      </div>
    </AsyncComponent>
  );
}
