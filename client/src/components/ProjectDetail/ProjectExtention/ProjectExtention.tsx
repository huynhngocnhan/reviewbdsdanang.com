import type React from "react";
import { Carousel } from "antd";
import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};

const ProjectExtention: React.FC<Props> = ({ project }) => {
  const extentionImages = project.extentionImages ?? [];
  // Lọc riêng tiện ích có ảnh cho carousel và tất cả cho danh sách
  const amenitiesWithImages = extentionImages.filter(item => item.src);
  const hasExtentionImages = extentionImages.length > 0;
  const hasAmenitiesWithImages = amenitiesWithImages.length > 0;

  return (
    <section className="mt-12 sm:mt-20 bg-gray-100 py-12 px-4 sm:px-6 lg:px-24">
      <div data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="200" 
        className="justify-center mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-800 uppercase tracking-tight">Tiện ích nổi bật</h2>
        <p className="mx-auto mt-2 max-w-6xl text-gray-600">
          {project.extentionDescription ??
            "Những đặc quyền nâng tầm trải nghiệm sống và giá trị khai thác."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start lg:justify-center">
        <div data-aos="fade-right"
        data-aos-duration="800"
        data-aos-delay="200"  className="lg:col-span-4 lg:col-start-2">
          {hasExtentionImages ? (
            <div className="grid grid-cols-2 gap-2">
              {extentionImages.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm transition-all hover:border-amber-400 hover:shadow-md"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <span className="text-[10px] font-bold text-amber-600">{index + 1}</span>
                  </div>
                  <h4 className="text-xs font-medium text-gray-800">{item.title}</h4>
                </article>
              ))}
            </div>
          ) : (
            <article className="h-full rounded-[15px] border border-gray-200 bg-gray-50 p-5 text-gray-600">
              Danh sách tiện ích chi tiết đang được cập nhật.
            </article>
          )}
        </div>

        <div data-aos="fade-left"
        data-aos-duration="800"
        data-aos-delay="300" className="lg:col-span-5">
          {hasAmenitiesWithImages ? (
            <div className="h-full overflow-hidden rounded-[15px] shadow-xl">
              <Carousel autoplay dots className="project-extention-carousel">
                {amenitiesWithImages.map((image, index) => (
                  <div key={`${image.src}-${index}`}>
                    <div className="relative h-[200px] sm:h-[300px] lg:h-[320px]">
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
