import { memo } from "react";
import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};

const getYouTubeEmbedUrl = (url: string) => {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) return "";
  if (trimmedUrl.includes("youtube.com/embed/")) return trimmedUrl;

  const shortMatch = trimmedUrl.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  const watchMatch = trimmedUrl.match(/[?&]v=([^?&/]+)/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  return trimmedUrl;
};

const ProjectProgress: React.FC<Props> = ({ project }) => {
  const description = project.progressDescription?.trim() || "";
  const youtubeUrl = project.progressYoutubeUrl?.trim() || "";
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

  const hasDescription = Boolean(description);
  const hasVideo = Boolean(embedUrl);
  const hasFullContent = hasDescription && hasVideo;

  if (!hasDescription) {
    return null;
  }

  return (
    <section
      id="project-progress"
      aria-labelledby="project-progress-title"
      className="py-14 text-[#f9de2b] sm:py-16"
      itemScope
      itemType={hasVideo ? "https://schema.org/VideoObject" : "https://schema.org/CreativeWork"}
    >
      <div className="mx-auto max-w-7xl px-4">
        {hasFullContent ? (
          <>
            <header className="grid gap-5 border-b border-[#17372F]/40 pb-7 md:grid-cols-[1.2fr_1fr] md:items-start lg:items-end">
              <div className="md:order-2 md:justify-self-end md:text-right">
                <p className="text-xl font-extrabold uppercase tracking-[0.28em] text-white">Cập nhật mới nhất</p>
                <h2 id="project-progress-title" className="mt-3 text-4xl font-extrabold uppercase leading-tight sm:text-6xl" itemProp="name">
                  Tiến độ dự án
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-100 sm:text-base md:order-1 md:mt-5 md:pr-6 lg:pr-8" itemProp="description">
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
                  itemProp="embedUrl"
                />
              </div>
            </article>
          </>
        ) : (
          <article className="rounded-2xl border border-white/20 bg-white/5 px-5 py-8 sm:px-8 sm:py-10">
            <header className="text-center">
              <p className="text-lg font-extrabold uppercase tracking-[0.24em] text-white">Cập nhật mới nhất</p>
              <h2 id="project-progress-title" className="mt-3 text-4xl font-extrabold uppercase leading-tight sm:text-5xl" itemProp="name">
                Tiến độ dự án
              </h2>
            </header>
            <p className="mx-auto mt-6 max-w-4xl text-center text-base leading-relaxed text-gray-100 sm:text-lg" itemProp="description">
              {description}
            </p>
          </article>
        )}
      </div>
    </section>
  );
};

export default memo(ProjectProgress);
