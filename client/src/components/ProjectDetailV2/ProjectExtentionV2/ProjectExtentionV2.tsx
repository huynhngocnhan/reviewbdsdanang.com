import type React from "react";
import ZoomableImage from "../../ZoomableImage";
import type { ProjectData, ExtentionDestination } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};

type Destination = {
  title: string;
  description: string;
  image: string;
};

const fallbackDestinations: Destination[] = [
  {
    title: "Trung tâm thương mại hiện đại",
    description: "Không gian mua sắm - giải trí đa tầng, kết nối nhanh từ dự án.",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Công viên cảnh quan",
    description: "Không gian xanh rộng lớn cho hoạt động thư giãn và thể thao ngoài trời.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Trung tâm sự kiện",
    description: "Điểm đến văn hóa, hội nghị và sự kiện quy mô khu vực.",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Khách sạn & dịch vụ quốc tế",
    description: "Chuỗi dịch vụ lưu trú, ẩm thực và hội họp tiêu chuẩn cao cấp.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
];

const ProjectExtentionV2: React.FC<Props> = ({ project }) => {
  const amenities = project.extentionImages ?? [];

  // Lấy từ project.extentionDestinations (từ form admin), fallback sang mock
  const nearbyDestinations: Destination[] = (project.extentionDestinations?.length ?? 0) > 0
    ? project.extentionDestinations!.map((d: ExtentionDestination) => ({
        title: d.des?.split("\n")[0] ?? "",
        description: d.des ?? "",
        image: d.img ?? "",
      }))
    : fallbackDestinations;

  return (
    <section className="text-white" aria-labelledby="project-extension-title">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            <p className="text-xl  font-semibold uppercase tracking-[0.28em] text-white">Hệ tiện ích mở rộng</p>
            <h2 id="project-extension-title" className="mt-3 text-4xl font-extrabold uppercase text-[#ffe228] sm:text-6xl">
              {project.title}
            </h2>
          </div>

          <div>
            <p className="whitespace-pre-line text-sm text-white sm:text-base">
              {project.extentionDescription ||
                "Không gian sống được quy hoạch theo triết lý wellness hiện đại, tối ưu trải nghiệm thư giãn, vận động và kết nối cộng đồng cư dân."}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((amenity) => (
            <article
              key={`${amenity.title}-${amenity.src}`}
              className="group relative overflow-hidden rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
            >
              <ZoomableImage
                src={amenity.src}
                alt={amenity.alt || amenity.title}
                className="relative block h-56 w-full text-left"
                imageClassName="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                showHoverOverlay={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90" />
              <div className="pointer-events-none absolute bottom-2 left-4 right-4">
                <h3 className="text-sm uppercase text-center font-bold text-white">{amenity.title}</h3>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <header>
            <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl tracking-[0.16em] uppercase">Và Hưởng trọn hệ tiện ích đại đô thị</h3>
          </header>

          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {nearbyDestinations.map((destination) => (
              <article
                key={`${destination.title}-${destination.image}`}
                className="overflow-hidden rounded-md shadow-[0_16px_35px_rgba(0,0,0,0.3)]"
              >
                <img src={destination.image} alt={destination.title} loading="lazy" className="h-40 w-full object-cover" />
                <div className="p-2">
                  <p className="text-center text-sm text-white/90">{destination.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectExtentionV2;
