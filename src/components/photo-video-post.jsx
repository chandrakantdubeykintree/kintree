import AsyncComponent from "./async-component";
import { CardContent } from "./ui/card";
import LinkPreview from "./link-preview";

import { useState } from "react";
import PhotoVideoCarousel from "./photo-video-carousel";
import { useTranslation } from "react-i18next";

export default function PhotoVideoPost({ post }) {
  const { t } = useTranslation();
  const {
    id,
    privacy,
    post_data,
    author_details,
    reactions,
    user_reaction,
    comment_counts,
    created_at,
    updated_at,
  } = post;
  const [viewPostAttachmentModal, setViewPostAttachmentModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const renderText = (text) => {
    if (!text) return null;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const extractUrls = (content) => content.match(urlRegex) || [];

    const renderContent = (content) => {
      const parts = content.split(urlRegex);
      const urls = content.match(urlRegex) || [];
      let urlIndex = 0;

      return parts.map((part, index) => {
        if (urls.includes(part)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brandPrimary hover:text-brandPrimary/80 hover:underline"
            >
              {part}
            </a>
          );
        }
        return part;
      });
    };

    const renderParagraphs = (content) => {
      const paragraphs = content.split("\n");
      const urls = extractUrls(content);

      return (
        <>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-2 last:mb-0">
              {renderContent(paragraph)}
            </p>
          ))}
          {/* Show preview for the first link only */}
          {urls[0] && <LinkPreview url={urls[0]} />}
        </>
      );
    };

    if (text.length < 150) {
      return <div className="mb-4">{renderParagraphs(text)}</div>;
    }

    let truncatedText = text.substring(0, 150);
    truncatedText = truncatedText.substring(0, truncatedText.lastIndexOf(" "));

    return (
      <div className="mb-4">
        <div className="text-md font-normal transition-all duration-300 ease-in-out">
          {isExpanded
            ? renderParagraphs(text)
            : renderParagraphs(truncatedText + "...")}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-brandPrimary hover:text-brandPrimary/80 text-sm font-medium mt-2 transition-colors duration-200"
        >
          {isExpanded ? t("see_less") : t("see_more")}
        </button>
      </div>
    );
  };

  const renderAttachments = () => {
    if (!post_data?.attachments?.length) return null;

    const gridClassName = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-2",
      4: "grid-cols-2",
    }[Math.min(post_data?.attachments.length, 4)];

    return (
      <div className={`grid ${gridClassName} gap-1 max-h-[500px] mb-4`}>
        {post_data?.attachments.slice(0, 4).map((attachment, index) => (
          <div
            key={attachment.id}
            className={`relative ${
              post_data?.attachments.length === 3 && index === 2
                ? "col-span-2"
                : ""
            } overflow-hidden cursor-pointer`}
            onClick={() => setViewPostAttachmentModal(true)}
          >
            {attachment.type === "video" ? (
              <div className="relative overflow-hidden">
                <video
                  src={attachment.url}
                  className={`w-full h-60 object-cover ${
                    post_data?.attachments?.length <= 1 &&
                    "max-h-full h-[350px]"
                  } rounded-lg hover:scale-110 transition-transform duration-300`}
                  controls
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <img
                src={attachment.url}
                alt=""
                className={`w-full h-60 ${
                  post_data?.attachments?.length <= 1 && "max-h-full h-[350px]"
                } object-cover rounded-lg hover:scale-110 transition-transform duration-300`}
              />
            )}
            {index === 3 && post_data?.attachments?.length > 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-white text-2xl font-bold">
                  +{post_data?.attachments?.length - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  return (
    <AsyncComponent>
      <CardContent className="p-0">
        {renderText(post_data?.body)}
        {renderAttachments()}
      </CardContent>
      {viewPostAttachmentModal && (
        <PhotoVideoCarousel
          isOpen={viewPostAttachmentModal}
          onClose={() => setViewPostAttachmentModal(false)}
          attachments={post_data?.attachments}
        />
      )}
    </AsyncComponent>
  );
}
