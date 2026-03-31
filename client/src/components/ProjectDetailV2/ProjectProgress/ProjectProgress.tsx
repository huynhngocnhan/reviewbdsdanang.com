import { MOCK_PROJECT_PROGRESS, type ProjectData } from "../../../constants/projectData";

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
  // Lấy từ form admin (progressDescription, progressYoutubeUrl), fallback sang mock
  const description = project.progressDescription?.trim() || MOCK_PROJECT_PROGRESS.des;
  const youtubeUrl = project.progressYoutubeUrl?.trim() || MOCK_PROJECT_PROGRESS.youtubeUrl;
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

  if (!description && !embedUrl) {
    return null;
  }

  return (
    <section
      id="project-progress"
      aria-labelledby="project-progress-title"
      className="py-14 text-[#f9de2b] sm:py-16"
      itemScope
      itemType="https://schema.org/VideoObject"
    >
      <div className="mx-auto max-w-7xl px-4">
        <header className="grid gap-5 border-b border-[#17372F]/40 pb-7 md:grid-cols-[1.2fr_1fr] md:items-start lg:items-end">
          <div className="md:order-2 md:justify-self-end md:text-right">
            <p className="text-xl font-semibold uppercase tracking-[0.28em] text-white">Cập nhật mới nhất</p>
            <h2 id="project-progress-title" className="mt-3 text-4xl font-extrabold uppercase leading-tight sm:text-6xl" itemProp="name">
              Tiến độ dự án
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-100 sm:text-base md:order-1 md:mt-5 md:pr-6 lg:pr-8" itemProp="description">
            {description}
          </p>
        </header>

        {embedUrl ? (
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
        ) : null}
      </div>
    </section>
  );
};

export default ProjectProgress;
