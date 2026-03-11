import type React from "react";
import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};

const ProjectOverview: React.FC<Props> = ({ project }) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start mb-8 lg:mb-12">
      <div
        data-aos="fade-right"
        data-aos-duration="800"
        className="lg:col-span-5 relative group"
      >
        <div className="relative overflow-hidden px-4 lg:px-0 lg:rounded-r-[15px] shadow-2xl h-[250px] sm:h-[400px] lg:h-[550px]">
          <img
            src={project.heroImage}
            alt={project.title}
            className="h-full w-full object-cover transform transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      </div>

      <div
        data-aos="fade-left"
        data-aos-duration="800"
        data-aos-delay="200"
        className="lg:col-span-5 p-6 sm:p-10 lg:p-16 flex flex-col justify-start"
      >
        <div>
          <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">
            Thông tin chi tiết
          </h3>
          <ul className="mt-6 space-y-4">
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
