import type React from "react";
import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};

const ProjectLocate: React.FC<Props> = ({ project }) => {
  return (

    <div className="px-8 lg:px-12 space-y-4 text-center mt-4 lg:mt-8">
          <h2 data-aos="flip-left"
    data-aos-duration="800"
    data-aos-delay="200" className="text-2xl sm:text-3xl font-extrabold text-amber-800 uppercase tracking-tight">Vị trí {project.title}</h2>
          <p className="text-gray-700 leading-relaxed  mx-auto "> {project.locationDescription} </p>
        <div className="shadow-2xl h-[250px] sm:h-[400px] lg:h-[700px]">
          <img
            src={project.locationImage}
            alt={project.title}
            className="h-full w-full rounded-lg transform transition duration-700 group-hover:scale-[1.03]"
          />
        </div>
        </div>
  );
};
export default ProjectLocate;