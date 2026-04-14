import { useState, useEffect } from "react";
import type React from "react";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import RegisterForm from "../RegisterForm/RegisterForm";
import type { ProjectData } from "../../constants/projectData";
import { projectService } from "../../services/project.service";
import ProjectOverview from "./ProjectOverview/ProjectOverview";
import ProjectLocate from "./ProjectLocate/ProjectLocate";
import ProjectExtention from "./ProjectExtention/ProjectExtention";
import FloorPlan from "./FloorPlan/FloorPlan";
import ProjectGallery from "./ProjectGallery/ProjectGallery";
import CustomSection from "./CustomSection/CustomSection";
import { Divider } from "antd";

const ProjectDetail: React.FC = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    setLoading(true);
    projectService
      .getProjectBySlug(slug!)
      .then((res) => {
        if (res.success && res.data) {
          setProject(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    projectService
      .getProjects({ status: "PUBLISHED" })
      .then((res) => {
        if (res.success && res.data) {
          setAllProjects(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const registerProjects = allProjects.map((p) => p.title);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100/90">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
        <Footer deferAvatar />
      </div>
    );
  }

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
        <Footer deferAvatar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative">
        <div className="relative h-[80vh] min-h-[480px] w-full overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            width={1920}
            height={1080}
            sizes="100vw"
            className="h-full w-full object-cover shadow-lg"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-6xl mx-auto px-4 pb-10 lg:ml-24 xl:ml-32 2xl:ml-40">
  <div className="max-w-4xl">

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
      <a href="#register" className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600 duration-300 transition " >
         Đăng ký tư vấn </a>
          <a href="#gallery" className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white border border-white/20 hover:bg-white/15 duration-300 transition " > 
          Xem thư viện ảnh </a>
            </div>
      </div>
    </div>

          </div>
        </div>
      </section>

      <main className="w-full pt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-800 uppercase tracking-tight">
            Dự án {project.title}
          </h2>
          <p className="mt-4 text-gray-700 leading-relaxed mx-auto italic border-l-4 border-amber-500 pl-4">
            {project.intro}
          </p>
        </div>


          <ProjectOverview project={project} />

        <div className="px-4 sm:px-6 lg:px-24">
        <Divider/>
        </div>
          <ProjectLocate project={project} />
          <ProjectExtention project={project} />
          <FloorPlan project={project} />
          <div className="px-4 sm:px-6 lg:px-24">
        <Divider/>
        </div>
        {project.customSections && project.customSections.length > 0 && <CustomSection project={project} />}
        {project.gallery && project.gallery.length > 0 && <ProjectGallery project={project}/>}

        

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
