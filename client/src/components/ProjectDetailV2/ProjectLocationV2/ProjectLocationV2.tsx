import { memo } from "react";
import type { ProjectData } from "../../../constants/projectData";
import ZoomableImage from "../../ZoomableImage";

type Props = {
  project: ProjectData;
};

const ProjectLocationV2 = ({ project }: Props) => {
  const nearbyGroups = project.nearbyGroups || [];
  const nearbyTrafficItems = project.nearbyTrafficItems || [];

  return (
    <section
      className="relative overflow-hidden py-8 md:py-16"
      aria-labelledby="project-location-title"
    >
      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-5 text-white">
            <h2
              id="project-location-title"
              className="text-3xl sm:text-4xl font-black tracking-wide uppercase"
            >
              Vị trí dự án
            </h2>
            <h3 className="mt-2 text-4xl sm:text-5xl font-black text-[#f9de2b] uppercase leading-tight">
              {project.title}
            </h3>

            <p className="mt-6 whitespace-pre-line text-white leading-relaxed text-base">
              {project.locationDescription}
            </p>

            <div className="space-x-4">
              {project.location360Url && (
                <a
                  href={project.location360Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Xem vị trí 360 độ của dự án ${project.title}`}
                  className="btn-float mt-5 inline-flex items-center rounded-xl bg-[#f9de2b] px-4 py-2.5 text-[#17372F] font-bold hover:bg-[#efd24b] transition"
                >
                  Xem vị trí 360°
                </a>
              )}
            </div>
          </div>

          <ZoomableImage
            src={project.locationImage || project.coverImage}
            alt={`${project.title} - vị trí dự án`}
            className="lg:col-span-7 rounded-2xl border border-white/20 shadow-2xl"
            imageClassName="min-h-[450px]"
          />

          {project.mapEmbedUrl && (
            <div className="mt-4 lg:col-span-7 overflow-hidden rounded-2xl border border-white/20">
              <iframe
                src={project.mapEmbedUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Bản đồ vị trí dự án ${project.title}`}
              />
            </div>
          )}

          {nearbyGroups.length > 0 && (
            <div className="mt-4 lg:col-span-5 grid grid-cols-2 gap-4 content-start" aria-label="Khoảng cách tiện ích theo thời gian di chuyển">
              {nearbyGroups.map((group, index) => (
                <div key={`${group.minute}-${index}`} className="text-white min-w-0">
                  <p className="text-5xl lg:text-6xl font-black text-white">
                    {group.minute}
                    <span className="text-[#f9de2b] text-2xl lg:text-3xl font-extrabold tracking-wide uppercase"> PHÚT</span>
                  </p>
                  {group.description && (
                    <p className="mt-2 text-white/90 text-sm whitespace-pre-line leading-relaxed">
                      {group.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {nearbyTrafficItems.length > 0 && (
          <div className="mt-10">
            <h3 className="text-3xl sm:text-4xl font-extrabold uppercase text-white">
              Các tuyến giao thông huyết mạch:
            </h3>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {nearbyTrafficItems.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="overflow-hidden rounded-md bg-[#17372F]/40 text-white shadow-lg"
                >
                  {item.img && (
                    <div className="relative h-44">
                      <img
                        src={item.img}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="text-base font-extrabold uppercase leading-snug">{item.title}</h4>
                    {item.des && (
                      <p className="mt-2 text-sm text-white/85 leading-relaxed">{item.des}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(ProjectLocationV2);
