import type React from "react";
import { Carousel } from "antd";
import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};

const ProjectExtention: React.FC<Props> = ({ project }) => {
  const extentionImages = project.extentionImages ?? [];
  const hasExtentionImages = extentionImages.length > 0;

  return (
    <section className="mt-12 sm:mt-20 bg-gray-100 py-12 px-8 lg:px-24">
      <div className="justify-center mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-800 uppercase tracking-tight">Tiện ích nổi bật</h2>
        <p className="mx-auto mt-2 max-w-3xl text-gray-600">
          {project.extentionDescription ??
            "Những đặc quyền nâng tầm trải nghiệm sống và giá trị khai thác."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-3">
          {hasExtentionImages ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {extentionImages.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="rounded-[15px] border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <article className="h-full rounded-[15px] border border-gray-200 bg-gray-50 p-5 text-gray-600">
              Danh sách tiện ích chi tiết đang được cập nhật.
            </article>
          )}
        </div>

        <div className="lg:col-span-9">
          {hasExtentionImages ? (
            <div className="h-full overflow-hidden rounded-[15px] shadow-xl">
              <Carousel autoplay dots className="project-extention-carousel">
                {extentionImages.map((image, index) => (
                  <div key={`${image.src}-${index}`}>
                    <div className="relative h-[220px] sm:h-[300px] lg:h-[500px]">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-5 sm:p-7 text-white">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/75">
                          Tiện ích {index + 1}
                        </p>
                        <h3 className="mt-1 text-lg sm:text-2xl font-semibold">{image.alt}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          ) : (
            <div className="rounded-[15px] border border-gray-200 bg-gray-50 p-6 sm:p-8 text-gray-600">
              Hình ảnh tiện ích đang được cập nhật.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectExtention;
