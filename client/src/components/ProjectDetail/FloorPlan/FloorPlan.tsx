import type React from "react";
import { Carousel } from "antd";
import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};

const FloorPlan: React.FC<Props> = ({ project }) => {
  const floorplans = project.floorplans ?? [];
  const hasFloorplans = floorplans.length > 0;
  const floorPlanImages = floorplans.flatMap((plan) => plan.floorPlanImage ?? []);

  return (
    <section data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay="200" 
        className="mt-12 px-8 lg:px-12 sm:mt-16 items-center justify-center">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-800 text-center uppercase tracking-tight">Sơ Đồ Mặt bằng {project.title}</h2>
      <p className="mt-2 text-gray-600 text-center mx-auto max-w-7xl">
        {floorplans.map((plan) => plan.description).join(" ") ||
          "Thông tin mặt bằng đang được cập nhật."}
      </p>

      {hasFloorplans && floorPlanImages.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-[5px] shadow-xl mx-auto max-w-5xl ">
          <Carousel autoplay arrows dots className="project-floorplan-carousel">
            {floorPlanImages.map((image, index) => (
              <div key={`${image.src}-${index}`}>
                <div className="relative h-[300px] sm:h-[320px] lg:h-full">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      ) : (
        <div className="mt-6 rounded-[15px] border border-gray-200 bg-gray-50 p-6 sm:p-8 text-gray-600">
          Hình ảnh mặt bằng đang được cập nhật.
        </div>
      )}
    </section>
  );
};

export default FloorPlan;
