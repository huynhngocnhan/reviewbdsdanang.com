import type React from "react";
import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};

const ProjectGallery: React.FC<Props> = ({ project }) => {
  const images = project.gallery ?? [];
  const hasGallery = images.length > 0;
  const loopImages = [...images, ...images, ...images];

  return (
    <section className="pt-4 lg:pt-8 ">
      <h2 data-aos="fade-left"
    data-aos-duration="800"
    data-aos-delay="200" className="mb-4 text-center text-xl font-extrabold uppercase tracking-tight text-amber-800 sm:mb-6 sm:text-2xl lg:text-3xl">
        Phối cảnh {project.title}
      </h2>

      <div className="relative h-[200px] w-full overflow-hidden sm:h-[300px] lg:h-[300px]">
        {hasGallery ? (
          <div className="absolute left-0 top-2 w-max animate-gallery-infinite sm:top-4 lg:top-6">
            <div className="flex items-start gap-2 px-3 sm:gap-3 sm:px-4">
              {loopImages.map((image, index) => (
                <article
                  key={`${image.src}-${index}`}
                  className="relative h-[140px] w-[220px] flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-gray-800/40 shadow-md sm:h-[180px] sm:w-[280px] sm:rounded-xl lg:h-[220px] lg:w-[320px]"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500 sm:text-base">
            Hình ảnh dự án đang được cập nhật.
          </div>
        )}
      </div>

      <style>{`
        @keyframes galleryInfinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-gallery-infinite {
          animation: galleryInfinite 45s linear infinite;
        }

        @media (max-width: 640px) {
          .animate-gallery-infinite {
            animation-duration: 30s;
          }
        }
      `}</style>
    </section>
  );
};

export default ProjectGallery;
