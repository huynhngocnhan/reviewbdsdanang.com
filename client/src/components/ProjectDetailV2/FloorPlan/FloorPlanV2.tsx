import { memo, useMemo } from "react";
import type { ProjectData } from "../../../constants/projectData";
import ZoomableImage from "../../ZoomableImage";

type Props = {
  project: ProjectData;
};

const FloorPlanV2 = ({ project }: Props) => {
  // Create a flattened array with category info for correct display
  const floorPlanWithCategory = useMemo(
    () =>
      (project.floorplans ?? []).flatMap((plan, categoryIndex) =>
        (plan.floorPlanImage ?? []).map((image, imageIndex) => ({
          image,
          categoryIndex,
          imageIndex,
          categoryDescription: plan.description,
        }))
      ),
    [project.floorplans],
  );

  const floorPlanDescription = useMemo(
    () =>
      (project.floorplans ?? [])
        .map((plan) => plan.description)
        .filter(Boolean)
        .join("\n"),
    [project.floorplans],
  );

  return (
    <section
      className="w-full bg-gray-100 py-10 md:py-14"
      aria-labelledby="floorplan-title"
      itemScope
      itemType="https://schema.org/ImageGallery"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <header className="mb-6 text-center">
          <h2
            id="floorplan-title"
            itemProp="name"
            className="flex flex-col items-center justify-center text-3xl sm:text-4xl font-black uppercase tracking-wide text-gray-800"
          >
            Mặt bằng tổng quan <span className="text-4xl font-extrabold md:text-5xl text-[#c76b25]">{project.title}</span>
          </h2>
          <p
            itemProp="description"
            className="mx-auto mt-3 max-w-7xl whitespace-pre-line text-justify sm:text-center text-sm sm:text-base leading-relaxed text-[#6B4E3D]"
          >
            {floorPlanDescription}
          </p>
        </header>

        {floorPlanWithCategory.length > 0 ? (
          <div className="space-y-4">
            {floorPlanWithCategory.map(({ image, categoryIndex, imageIndex }, globalIndex) => (
              <figure key={`${image.src}-${categoryIndex}-${imageIndex}`} className="overflow-hidden rounded-md border shadow-xl">
                <ZoomableImage
                  src={image.src}
                  alt={image.alt || `Sơ đồ mặt bằng ${globalIndex + 1} dự án ${project.title}`}
                  className="w-full"
                  imageClassName="w-full object-contain"
                  showHoverOverlay={false}
                  width={1600}
                  height={900}
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  fetchPriority="low"
                />
                <figcaption className="px-4 py-3 text-center text-sm text-[#6B4E3D]">
                  Sơ đồ mặt bằng {project.title}{image.alt ? ` - ${image.alt}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#D9C3AA] bg-white p-6 text-center text-[#6B4E3D]">
            Hình ảnh mặt bằng đang được cập nhật.
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(FloorPlanV2);
