import type React from "react";
import { useMemo, } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import RegisterForm from "../RegisterForm/RegisterForm";
import { MOCK_PROJECTS } from "../../constants/projectData";
import ProjectOverview from "./ProjectOverview/ProjectOverview";
import ProjectLocate from "./ProjectLocate/ProjectLocate";
import ProjectExtention from "./ProjectExtention/ProjectExtention";
import FloorPlan from "./FloorPlan/FloorPlan";
import ProjectGallery from "./ProjectGallery/ProjectGallery";
import { Divider } from "antd";

const ProjectDetail: React.FC = () => {
  const { slug } = useParams();
  const project = useMemo(
    () => MOCK_PROJECTS.find((p) => p.slug === slug) ?? null,
    [slug]
  );


  const registerProjects = useMemo(
    () => MOCK_PROJECTS.map((p) => p.title),
    []
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100/90">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-2xl font-bold text-gray-900">
            Không tìm thấy dự án
          </h1>
          <p className="mt-2 text-gray-600">
            Đường dẫn không đúng hoặc dự án chưa được cập nhật.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative">
        <div className="relative h-[80vh] min-h-[480px] w-full overflow-hidden">
          <img
            src={project.heroImage}
            alt={project.title}
            className="h-full w-full object-cover shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
              <div className="max-w-3xl">
                <p className="text-amber-300/90 font-semibold tracking-wide text-sm">
                  {project.locationText}
                </p>
                <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                  {project.title}
                </h1>
                <p className="mt-3 text-white/85 text-base sm:text-lg">
                  {project.subtitle}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-full bg-amber-500/15 border border-amber-300/40 px-3 py-1 text-xs font-semibold text-amber-100"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    href="#register"
                    className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600 duration-300 transition "
                  >
                    Đăng ký tư vấn
                  </a>
                  <a
                    href="#gallery"
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white border border-white/20 hover:bg-white/15 duration-300 transition "
                  >
                    Xem thư viện ảnh
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="w-full pt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-800 uppercase tracking-tight">
            {project.title}
          </h2>
          <p className="mt-4 text-gray-700 leading-relaxed max-w-4xl mx-auto italic">
            {project.intro}
          </p>
        </div>


          <ProjectOverview project={project} />

        <div className="px-8 lg:px-24">
        <Divider/>
        </div>
          <ProjectLocate project={project} />
          <ProjectExtention project={project} />
          <FloorPlan project={project} />
          <div className="px-8 lg:px-24">
        <Divider/>
        </div>
          <ProjectGallery project={project} />

        

        <section id="register" className="">
          <RegisterForm projects={registerProjects} />
        </section>
      </main>

      <div className="sticky bottom-0 z-40 bg-white/80 backdrop-blur border-t border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Nhận bảng giá & ưu đãi
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {project.title} - {project.locationText}
            </p>
          </div>
          <a
            href="#register"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600 transition"
          >
            Đăng ký tư vấn ngay
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
