import type React from "react";
import { useState } from "react";
import type { ProjectData } from "../../../constants/projectData";
import RegisterModalForm from "../../RegisterModalForm/RegisterModalForm";

type Props = {
  project: ProjectData;
};

const ProjectOverviewV2: React.FC<Props> = ({ project }) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-8">
        <h1 className="uppercase text-3xl sm:text-4xl font-extrabold text-[#5C4033] tracking-tight">
          Tổng quan dự án <span className="text-[#c76b25]">{project.title}</span>
        </h1>
        <p className="mt-4 text-[#6B4E3D] leading-relaxed mx-auto italic border-l-4 border-[#A67C52] pl-4 text-left sm:text-center">
          {project.intro}
        </p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-8 items-stretch mb-8 lg:mb-12">
        <div data-aos="fade-right" data-aos-duration="800" className="lg:col-span-5 relative group">
          <div className="relative px-2.5 lg:px-0">
            <div className="relative overflow-hidden rounded-md md:rounded-s-none shadow-2xl min-h-[360px] sm:min-h-[620px] lg:min-h-[760px] h-full">
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
          className="lg:col-span-5 px-6 sm:px-10 lg:px-14 flex flex-col justify-start"
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

          <div className="mt-8 md:mt-8">
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="btn-float group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-red-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-[#8f7358]/35 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8f7358]/45"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Đăng ký nhận thông tin dự án</span>
            </button>
          </div>
        </div>
      </section>

      <RegisterModalForm
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        projectTitle={project.title}
        projectImage={project.heroImage}
      />
    </>
  );
};

export default ProjectOverviewV2;
