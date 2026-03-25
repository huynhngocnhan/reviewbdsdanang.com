import type React from "react";
import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};

type NearbyGroup = {
  minute: string;
  places: string[];
};

const nearbyGroups: NearbyGroup[] = [
  {
    minute: "05",
    places: ["Công viên trung tâm", "Trung tâm thương mại", "Trường học quốc tế"],
  },
  {
    minute: "10",
    places: ["Trung tâm thành phố", "Bệnh viện quốc tế", "Khu hành chính"],
  },
  {
    minute: "20",
    places: ["Sân bay quốc tế", "Ga trung tâm"],
  },
  {
    minute: "30",
    places: ["Khu du lịch ven biển", "Vùng tiện ích mở rộng"],
  },
];

const ProjectLocationV2: React.FC<Props> = ({ project }) => {
  const locationVisual = project.locationImage || project.coverImage;

  return (
    <section className="relative overflow-hidden py-8 md:py-16">
      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-5 text-white">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wide uppercase">Vị trí dự án</h2>
            <h3 className="mt-2 text-4xl sm:text-5xl font-black text-[#f9de2b] uppercase leading-tight">
              {project.title}
            </h3>

            <p className="mt-6 text-white leading-relaxed text-base">{project.locationDescription}</p>

              <a
                href={project.location360Url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center rounded-xl bg-[#f9de2b] px-4 py-2.5 text-[#17372F] font-bold hover:bg-[#efd24b] transition"
              >
                Xem vị trí 360°
              </a>

          </div>

          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <img
              src={locationVisual}
              alt={`${project.title} - vị trí dự án`}
              className="w-full h-full min-h-[450px] object-cover"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {nearbyGroups.map((group) => (
            <div key={group.minute} className="text-white min-w-0">
              <p className="text-5xl font-black text-white">
                {group.minute}
                <span className="text-[#f9de2b] text-xl font-bold tracking-wide uppercase"> PHÚT</span>
              </p>
              <ul className="mt-3 space-y-2 text-white/90 text-sm sm:text-base">
                {group.places.map((place) => (
                  <li key={place}>• {place}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectLocationV2;
