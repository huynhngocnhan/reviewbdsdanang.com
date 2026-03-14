import type React from "react";
import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};


const ProjectOverview: React.FC<Props> = ({ project }) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-8 items-stretch mb-8 lg:mb-12">
      <div
        data-aos="fade-right"
        data-aos-duration="800"
        className="lg:col-span-5 relative group"
      >
        <div className="relative px-2.5 lg:px-0">
      <div className="relative overflow-hidden rounded-md md:rounded-s-none shadow-2xl min-h-[300px] sm:min-h-[500px] lg:min-h-[600px] h-full">
    
      <img
        src={project.heroImage}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.03]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  </div>
      </div>

      <div
        data-aos="fade-left"
        data-aos-duration="800"
        data-aos-delay="200"
        className="lg:col-span-5 px-6 sm:px-10 lg:px-14 lg:pl- flex flex-col justify-start"
      >
        <div>
          <p className="pt-4 md:pt-0 text-base font-extrabold text-gray-800 uppercase tracking-widest">
            Thông tin chi tiết
          </p>
          <ul className="mt-4 space-y-4">
            {project.specs.map((s) => (
              <li key={s.label} className="flex items-start gap-4 group">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600 group-hover:scale-150 transition-transform" />
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  <strong className="text-gray-900 font-bold">{s.label}:</strong>{" "}
                  {s.value}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProjectOverview;
