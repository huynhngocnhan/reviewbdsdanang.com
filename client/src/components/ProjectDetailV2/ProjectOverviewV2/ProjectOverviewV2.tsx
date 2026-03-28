import type React from "react";
import { useState } from "react";
import type { ProjectData } from "../../../constants/projectData";
import RegisterModalForm from "../../RegisterModalForm/RegisterModalForm";
import ZoomableImage from "../../ZoomableImage";

type Props = {
  project: ProjectData;
};

const ProjectOverviewV2: React.FC<Props> = ({ project }) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <>
      <section
        className="mx-auto mb-10 w-full max-w-8xl px-4 sm:px-8 lg:mb-16"
        aria-labelledby="project-overview-title"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-11 lg:gap-8">
          <article data-aos="fade-right" data-aos-duration="800" className="lg:col-span-6">
            <ZoomableImage
              src={project.heroImage}
              alt={`Tổng quan phối cảnh dự án ${project.title}`}
              className="h-full min-h-[320px] rounded-xl shadow-2xl sm:min-h-[420px] lg:min-h-[520px]"
              imageClassName="h-full w-full"
            />
          </article>

          <article
            data-aos="fade-left"
            data-aos-duration="800"
            data-aos-delay="150"
            className="lg:col-span-5 rounded-xl p-2"
          >
            <header className="text-left">
              <p className="text-base font-extrabold uppercase tracking-[0.2em] text-[#8A6A4F]">
                Tổng quan dự án
              </p>
              <h2
                id="project-overview-title"
                className="mt-2 text-2xl font-extrabold uppercase tracking-tight text-[#5C4033] sm:text-4xl"
              >
                {project.title}
              </h2>
              <p className="whitespace-pre-line mt-4 border-l-4 text-base md:text-[15px] border-[#A67C52] pl-4 text-[#6B4E3D] italic leading-relaxed">
                {project.intro}
              </p>
            </header>

            <div className="mt-6">
              <h3 className="text-base md:text-[15px] font-extrabold uppercase tracking-widest text-[#5C4033]">
                Thông tin chi tiết:
              </h3>
              <ul className="mt-3 space-y-3" aria-label={`Thông tin dự án ${project.title}`}>
                {project.specs.map((s) => (
                  <li key={s.label} className="flex gap-3 text-[15px] text-[#3D2B1F]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c76b25]" />
                    <p className="leading-relaxed">
                      <strong className="font-semibold text-[#5C4033]">{s.label}:</strong> {s.value}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="btn-float w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-700 sm:w-auto"
              >
                Đăng ký nhận thông tin dự án
              </button>
            </div>
          </article>
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
