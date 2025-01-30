import { NavLink, useNavigate, useParams } from "react-router";
import AsyncComponent from "@/components/async-component";
import { useAuth } from "@/context/AuthProvider";
import { useEditPost, usePost } from "@/hooks/usePosts";
import ComponentLoading from "@/components/component-loading";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { useUploadAttachment } from "@/hooks/useAttachments";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import PrivacyDropdown from "@/components/privacy-dropdown";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const SUPPORTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function EditPost() {
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { postId } = useParams();
  const [privacy, setPrivacy] = useState({
    id: 1,
    title: "Global",
    desc: "Anyone on Kintree",
    icon: "/privacy/web.svg",
  });
  const {
    data: postData,
    isLoading,
    error,
  } = usePost(postId, {
    refetchOnMount: true,
    cacheTime: 0,
    staleTime: 0,
  });
  const editPostMutation = useEditPost();
  const uploadAttachmentMutation = useUploadAttachment();

  const [isInitialized, setIsInitialized] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [files, setFiles] = useState([]);

  const charCount = editedContent.length;
  const isOverLimit = charCount > 1000;

  useEffect(() => {
    if (postData && user) {
      if (postData?.author_details?.id !== user?.id) {
        toast.error("You are not authorized to edit this post");
        navigate("/foreroom");
        return;
      }
    }
  }, [postData, user, navigate]);

  useEffect(() => {
    if (postData?.post_data && !isInitialized) {
      setEditedContent(postData.post_data.body || "");
      setFiles(postData.post_data.attachments || []);
      // Set initial privacy from post data
      if (postData.post_data.privacy) {
        const privacyLevel = postData.post_data.privacy;
        setPrivacy({
          id: privacyLevel,
          title: ["Global", "Family Tree", "Primary Family", "Only Me"][
            privacyLevel - 1
          ],
          desc: [
            "Anyone on Kintree",
            "Your Family Tree on Kintree",
            "Your Primary Family Members",
            "Only me",
          ][privacyLevel - 1],
          icon: [
            `/privacy/web.svg`,
            `/privacy/familytree.svg`,
            `/privacy/family.svg`,
            `/privacy/private.svg`,
          ][privacyLevel - 1],
        });
      }
      setIsInitialized(true);
    }
  }, [postData, isInitialized]);

  useEffect(() => {
    return () => {
      if (postId) {
        queryClient.removeQueries({ queryKey: ["post", postId] });
      }
      setDeletedAttachmentIds([]);
      setMediaFiles([]);
      setUploadedAttachments([]);
      setIsUploading(false);
      setIsInitialized(false);
      setEditedContent("");
      setFiles([]);
    };
  }, []);

  if (isLoading || !isInitialized) {
    return <ComponentLoading />;
  }
  if (error) {
    toast.error("Failed to load post");
    navigate("/foreroom");
    return null;
  }
  if (!postData) return null;

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
      if (mediaFiles.length + files.length + validFiles.length >= 10) {
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

      const result = await uploadAttachmentMutation.mutateAsync(formData);
      const newAttachments = result.data;
      setUploadedAttachments((prev) => [...prev, ...newAttachments]);
    } catch (error) {
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index, isExisting = false) => {
    if (isExisting) {
      const removedFile = files[index];
      setDeletedAttachmentIds((prev) => [...prev, removedFile.id]);
      setFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setMediaFiles((prev) => prev.filter((_, i) => i !== index));
      setUploadedAttachments((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPost = {
      body: editedContent,
      privacy: privacy.id,
      attachment_ids: [
        ...uploadedAttachments.map((att) => att.id),
        ...files.map((file) => file.id),
      ],
      delete_attachment_ids: deletedAttachmentIds,
    };

    try {
      editPostMutation.mutate(
        {
          postId: postData.id,
          updatedPost,
        },
        {
          onSuccess: () => {
            navigate("/foreroom");
            setDeletedAttachmentIds([]);
            setMediaFiles([]);
            setUploadedAttachments([]);
            setIsUploading(false);
            setIsInitialized(false);
            setEditedContent("");
            setFiles([]);
          },
          onError: (error) => {
            console.error("Error updating post:", error);
            toast.error(
              error.response?.data?.message || "Failed to update post"
            );
          },
        }
      );
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Failed to update post");
    }
  };

  return (
    <AsyncComponent>
      <div className="w-full mx-auto lg:px-0 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <NavLink
            to="/foreroom"
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
        <Card className="w-full">
          <form onSubmit={handleSubmit}>
            <CardHeader className="flex flex-row flex-wrap justify-between items-center">
              <div className="text-xl font-bold">Edit Post</div>
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
                  value={editedContent}
                  onChange={(e) => {
                    const newText = e.target.value;
                    if (newText.length <= 1000) {
                      setEditedContent(newText);
                    }
                  }}
                  maxLength={1000}
                  className={`w-full min-h-[200px] lg:text-[16px] ${
                    isOverLimit
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  placeholder="Edit your post..."
                />
                {isOverLimit && (
                  <p className="text-sm text-red-500">
                    Caption cannot exceed 1000 characters
                  </p>
                )}
              </div>

              {/* Existing Attachments */}
              {files.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Attachments
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {files.map((file, index) => (
                      <div key={file.id} className="relative group">
                        {file.type === "image" ? (
                          <img
                            src={file.url}
                            alt=""
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={file.url}
                            className="w-full h-40 object-cover rounded-lg"
                            controls
                          />
                        )}
                        <Button
                          type="icon"
                          onClick={() => removeFile(index, true)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Attachments */}
              {mediaFiles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Attachments {isUploading && "(Uploading...)"}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={URL.createObjectURL(file)}
                            className="w-full h-40 object-cover rounded-lg"
                            controls
                          />
                        )}
                        <Button
                          type="icon"
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-end">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="hidden"
                  id="file-input"
                />
                <Button
                  asChild
                  htmlFor="file-input"
                  variant="outline"
                  className="rounded-full h-10 md:h-12 px-4 md:px-6"
                >
                  <label>Add Files</label>
                </Button>
                <Button
                  type="submit"
                  disabled={editPostMutation.isPending}
                  className="rounded-full h-10 md:h-12 px-4 md:px-6"
                >
                  {editPostMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </AsyncComponent>
  );
}
