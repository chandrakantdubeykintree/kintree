import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { kintreeApi } from "@/services/kintreeApi";
import { Skeleton } from "./ui/skeleton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Loader2, X, ZoomIn } from "lucide-react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Button } from "./ui/button";
import { useUploadAttachment } from "@/hooks/useAttachments";
import { Label } from "./ui/label";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const ITEMS_PER_PAGE = 15;

const fetchGalleryItems = async ({ pageParam = 1 }) => {
  const response = await kintreeApi.get(`/attachments`, {
    params: {
      filter: "gallery",
      limit: ITEMS_PER_PAGE,
      page: pageParam,
    },
  });
  return response.data.data;
};

const GallerySkeleton = () => (
  <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
    {[...Array(9)].map((_, i) => (
      <div key={i} className="break-inside-avoid mb-4">
        <Skeleton className="w-full h-[200px] rounded-lg" />
      </div>
    ))}
  </div>
);

const MediaItem = ({ item, onItemClick }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  if (item.type === "video") {
    return (
      <div
        ref={ref}
        className="relative group overflow-hidden rounded-lg"
        onClick={() => onItemClick(item)}
      >
        <video
          className="w-full h-full object-cover"
          controls
          src={inView ? item.url : undefined}
          poster={`${item.url}?thumb=true`}
          onLoadedData={() => setIsLoading(false)}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
        {/* <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative group overflow-hidden rounded-lg cursor-pointer"
      onClick={() => onItemClick(item)}
    >
      <LazyLoadImage
        src={item.url}
        alt={item.name}
        effect="blur"
        className="w-full h-full object-cover"
        wrapperClassName="w-full h-full"
        placeholderSrc={`${item.url}?thumb=true`}
        afterLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <ZoomIn className="text-white h-8 w-8" />
      </div>
    </div>
  );
};

const ImageDialog = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] max-h-[90%] rounded-lg flex items-center justify-center h-[650px] w-[900px]">
        {item.type === "video" ? (
          <video
            className="w-full h-full object-contain"
            controls
            src={item.url}
            poster={`${item.url}?thumb=true`}
          />
        ) : (
          <img
            src={item.url}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// const AddMediaDialog = ({ isOpen, onClose }) => {
//   const [files, setFiles] = useState([]);
//   const uploadMutation = useUploadAttachment();
//   const queryClient = useQueryClient();

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);

//     // Filter out GIFs and limit to 10 files
//     const validFiles = selectedFiles.filter(
//       (file) =>
//         (file.type.startsWith("image/") || file.type.startsWith("video/")) &&
//         !file.name.endsWith(".gif")
//     );

//     if (validFiles.length + files.length > 10) {
//       toast.error("You can only upload up to 10 media files.");
//       return;
//     }

//     setFiles((prevFiles) => [...prevFiles, ...validFiles].slice(0, 10));
//   };

//   const handleUpload = () => {
//     if (files.length > 0) {
//       const formData = new FormData();
//       files.forEach((file) => {
//         formData.append("files[]", file); // Append each file to the FormData
//       });

//       uploadMutation.mutate(formData, {
//         onSuccess: () => {
//           toast.success("Files uploaded successfully!");
//           setFiles([]);
//           onClose();
//           queryClient.invalidateQueries(["gallery"]);
//         },
//         onError: (error) => {
//           toast.error(
//             "Failed to upload files: " + (error.message || "Unknown error")
//           );
//         },
//       });
//     }
//   };

//   const removeFile = (index) => {
//     setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
//       <DialogContent className="max-w-[90%] w-[700px] max-h-[90%] rounded-lg flex flex-col p-4 justify-between">
//         <DialogTitle className="text-lg font-semibold">
//           Add Media Files
//         </DialogTitle>

//         <Card className="mt-4 bg-brandSecondary">
//           <CardHeader>
//             <Label>Select Media Files</Label>
//           </CardHeader>
//           <CardContent>
//             <input
//               type="file"
//               multiple
//               accept="image/*,video/*" // Accept images and videos
//               onChange={handleFileChange}
//               className="mt-2"
//             />
//             {files.length === 0 ? (
//               <p className="mt-4 text-gray-500">
//                 Select media files to upload.
//               </p>
//             ) : (
//               <div className="mt-4">
//                 <h3 className="text-sm font-medium">Selected Files:</h3>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
//                   {files.map((file, index) => (
//                     <div key={index} className="relative">
//                       {file.type.startsWith("image/") ? (
//                         <img
//                           src={URL.createObjectURL(file)}
//                           alt={file.name}
//                           className="w-full h-32 object-cover rounded"
//                         />
//                       ) : (
//                         <video
//                           src={URL.createObjectURL(file)}
//                           controls
//                           className="w-full h-32 object-cover rounded"
//                         />
//                       )}
//                       <Button
//                         type="button"
//                         variant="destructive"
//                         size="icon"
//                         className="absolute top-1 right-1 rounded-full"
//                         onClick={() => removeFile(index)}
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <div className="mt-4 flex justify-end">
//           <Button
//             onClick={handleUpload}
//             disabled={uploadMutation.isLoading || files.length === 0}
//           >
//             Upload
//           </Button>
//           <Button
//             variant="outline"
//             onClick={onClose}
//             className="ml-2 rounded-full"
//           >
//             Cancel
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

export default function ProfileGallery() {
  const { ref: loadMoreRef, inView } = useInView();
  const [selectedItem, setSelectedItem] = useState(null);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["gallery"],
    queryFn: fetchGalleryItems,
    getNextPageParam: (lastPage) =>
      lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    return (
      <Card className="border-none shadow-none bg-brandSecondary p-4">
        <div className="text-center text-red-500">
          Error loading gallery. Please try again later.
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-none shadow-none bg-brandSecondary p-4">
        <GallerySkeleton />
      </Card>
    );
  }

  const allItems = data?.pages.flatMap((page) => page.attachments) ?? [];

  // if (allItems.length === 0) {
  //   return (
  //     <Card className="border-none shadow-none bg-brandSecondary p-4">
  //       <div className="text-center text-gray-500">No media items found.</div>
  //     </Card>
  //   );
  // }

  return (
    <>
      {/* <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)} className="rounded-full">
          Add Media
        </Button>
      </div> */}

      <div className="flex justify-end">
        <Button
          onClick={() => navigate("/foreroom/createpost/post")}
          className="rounded-full"
        >
          Create Post
        </Button>
      </div>

      <Card className="border-none shadow-none bg-brandSecondary p-4">
        {allItems?.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {allItems?.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "break-inside-avoid",
                  index === 0 ? "mt-0" : "mt-4"
                )}
              >
                <MediaItem item={item} onItemClick={setSelectedItem} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <div>
              <img src="/illustrations/no_media.png" />
            </div>
            <p className="text-gray-400">
              Create new posts with attachments to add a new media item.
            </p>
          </div>
        )}

        {/* Load more trigger */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="h-20 flex items-center justify-center mt-4"
          >
            {isFetchingNextPage && (
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            )}
          </div>
        )}
      </Card>

      {!!selectedItem && (
        <ImageDialog
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}

      {/* {isDialogOpen && (
        <AddMediaDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )} */}
    </>
  );
}
