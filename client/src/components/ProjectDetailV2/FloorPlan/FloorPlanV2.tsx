import type React from "react";
import type { ProjectData } from "../../../constants/projectData";
import ZoomableImage from "../../ZoomableImage";

type Props = {
  project: ProjectData;
};

const FloorPlanV2: React.FC<Props> = ({ project }) => {
  const floorPlanImages = (project.floorplans ?? []).flatMap((plan) => plan.floorPlanImage ?? []);

  return (
    <section className="w-full bg-gray-100 py-10 md:py-14" aria-labelledby="floorplan-title">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <header className="mb-6 text-center">
          <h2
            id="floorplan-title"
            className="flex flex-col items-center justify-center text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-gray-800"
          >
            Mặt bằng tổng quan <span className="text-4xl md:text-5xl text-[#c76b25]">{project.title}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-5xl whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#6B4E3D]">
            {project.floorplans?.map((plan) => plan.description).join("\n")}
          </p>
        </header>

        {floorPlanImages.length > 0 ? (
          <div className="space-y-4">
            {floorPlanImages.map((image, index) => (
              <figure key={`${image.src}-${index}`} className="overflow-hidden rounded-md border shadow-xl">
                <ZoomableImage
                  src={image.src}
                  alt={image.alt || `Sơ đồ mặt bằng ${index + 1} dự án ${project.title}`}
                  className="w-full"
                  imageClassName="w-full object-contain"
                  showHoverOverlay={false}
                />
                <figcaption className="px-4 py-3 text-center text-sm text-[#6B4E3D]">
                  Sơ đồ mặt bằng {index + 1} - {project.title}
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

export default FloorPlanV2;
