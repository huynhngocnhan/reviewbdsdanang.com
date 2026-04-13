import { memo } from "react";
import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};

const getYouTubeVideoId = (url: string) => {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) return "";

  const embedMatch = trimmedUrl.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embedMatch?.[1]) return embedMatch[1];

  const shortMatch = trimmedUrl.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch?.[1]) return shortMatch[1];

  const watchMatch = trimmedUrl.match(/[?&]v=([^?&/]+)/);
  if (watchMatch?.[1]) return watchMatch[1];

  return "";
};

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) return `https://www.youtube.com/embed/${videoId}`;

  const trimmedUrl = url.trim();
  if (trimmedUrl.includes("youtube.com/embed/")) return trimmedUrl;

  return "";
};

const ProjectProgress: React.FC<Props> = ({ project }) => {
  const description = project.progressDescription?.trim() || "";
  const youtubeUrl = project.progressYoutubeUrl?.trim() || "";
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);
  const videoId = getYouTubeVideoId(youtubeUrl);

  const uploadDate = project.progressVideoUploadDate?.trim() || "";
  const thumbnailUrl =
    project.progressVideoThumbnailUrl?.trim() ||
    (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "");

  const hasDescription = Boolean(description);
  const hasVideo = Boolean(embedUrl);
  const hasFullContent = hasDescription && hasVideo;
  const hasValidVideoSchema = Boolean(hasVideo && uploadDate && thumbnailUrl);

  if (!hasDescription) {
    return null;
  }

  return (
    <section
      id="project-progress"
      aria-labelledby="project-progress-title"
      className="py-14 text-[#f9de2b] sm:py-16"
      itemScope
      itemType={hasValidVideoSchema ? "https://schema.org/VideoObject" : "https://schema.org/CreativeWork"}
    >
      {hasValidVideoSchema ? <meta itemProp="uploadDate" content={uploadDate} /> : null}
      {hasValidVideoSchema ? <meta itemProp="thumbnailUrl" content={thumbnailUrl} /> : null}

      <div className="mx-auto max-w-7xl px-4">
        {hasFullContent ? (
          <>
            <header className="grid gap-5 border-b border-[#17372F]/40 pb-7 md:grid-cols-[1.2fr_1fr] md:items-start lg:items-start">
              <div className="md:order-2 md:justify-self-end md:text-right">
                <p className="text-xl font-extrabold uppercase tracking-[0.28em] text-white">Cập nhật mới nhất</p>
                <h2
                  id="project-progress-title"
                  className="mt-3 text-4xl font-extrabold uppercase leading-tight sm:text-6xl"
                  itemProp="name"
                >
                  Tiến độ dự án
                </h2>
              </div>
              <p
                className="text-sm leading-relaxed whitespace-pre-line text-gray-100 sm:text-base md:order-1 md:mt-5 md:pr-6 lg:pr-8"
                itemProp="description"
              >
                {description}
              </p>
            </header>

            <article className="mt-8 overflow-hidden rounded-2xl bg-white shadow-[0_18px_55px_rgba(23,55,47,0.12)]">
              <div className="relative aspect-video w-full bg-[#17372F]/5">
                <iframe
                  className="h-full w-full"
                  src={embedUrl}
                  title={`Video tiến độ dự án ${project.title}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  {...(hasValidVideoSchema ? { itemProp: "embedUrl" } : {})}
                />
              </div>
            </article>
          </>
        ) : (
          <article className="rounded-2xl border border-white/20 bg-white/5 px-5 py-8 sm:px-8 sm:py-10">
            <header className="text-center">
              <p className="text-lg font-extrabold uppercase tracking-[0.24em] text-white">Cập nhật mới nhất</p>
              <h2
                id="project-progress-title"
                className="mt-3 text-4xl font-extrabold uppercase leading-tight sm:text-5xl"
                itemProp="name"
              >
                Tiến độ dự án
              </h2>
            </header>
            <p
              className="mx-auto whitespace-pre-line mt-6 max-w-6xl text-justify text-base leading-relaxed text-gray-100 sm:text-lg"
              itemProp="description"
            >
              {description}
            </p>
          </article>
        )}
      </div>
    </section>
  );
};

export default memo(ProjectProgress);
