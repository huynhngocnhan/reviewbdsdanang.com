import { useState, useEffect } from "react";
import type React from "react";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import RegisterForm from "../RegisterForm/RegisterForm";
import type { ProjectData } from "../../constants/projectData";
import { projectService } from "../../services/project.service";
import ProjectOverviewV2 from "./ProjectOverviewV2/ProjectOverviewV2";
import ReasonToBuy from "./ReasonToBuy/ReasonToBuy";
import SalePolicy from "./SalePolicy/SalePolicy";
import LeadForm from "./LeadForm/LeadForm";
import ProjectLocationV2 from "./ProjectLocationV2/ProjectLocationV2";
import FloorPlanV2 from "./FloorPlan/FloorPlanV2";
import FullWidthForm from "../FullWidthForm/FullWidthForm";
import LeftOverlay from "../LeftOverlay/LeftOverlay";
import ApartmentDesign from "./ApartmentDesign/ApartmentDesign";
import ProjectExtentionV2 from "./ProjectExtentionV2/ProjectExtentionV2";
import HandoverStandard from "./HandoverStandard/HandoverStandard";

const ProjectDetailV2: React.FC = () => {
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
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100/90">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-2xl font-bold text-gray-900">Không tìm thấy dự án</h1>
          <p className="mt-2 text-gray-600">Đường dẫn không đúng hoặc dự án chưa được cập nhật.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative">
        <div className="relative h-[90vh] min-h-screen w-full overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            className="h-full w-full object-cover shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-6xl mx-auto px-4 pb-20 lg:ml-24 xl:ml-32 2xl:ml-40">
              <div className="max-w-4xl">
                <p className="text-amber-300/90 font-semibold tracking-wide text-sm">
                  {project.locationText}
                </p>

                <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                  {project.title}
                </h1>

                <p className="mt-3 text-white/85 text-base sm:text-lg">{project.subtitle}</p>

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
                    className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600 duration-300 transition"
                  >
                    Đăng ký tư vấn
                  </a>
                  <a
                    href="#gallery"
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white border border-white/20 hover:bg-white/15 duration-300 transition"
                  >
                    Xem thư viện ảnh
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="w-full bg-[#F3E8DC]">
        <section className="bg-[#876347] py-10">
          <ReasonToBuy project={project} />
        </section>

        <section>
          <SalePolicy project={project} />
        </section>

        <section>
          <LeadForm project={project} projectOptions={registerProjects} />
        </section>

        <section className="bg-[#F3E8DC] py-12">
          <ProjectOverviewV2 project={project} />
        </section>
        <section className="bg-[#876347] py-10">
          <ProjectLocationV2 project={project} />
        </section>
        <section>
          <FloorPlanV2 project={project} />
        </section>
        <section>
          <FullWidthForm project={project} />
        </section>
        <section className="bg-[#876347] py-4">
          <ApartmentDesign project={project} />
        </section>
        <section className="bg-[#876347]">
          <ProjectExtentionV2 project={project} />
        </section>
        <section className="bg-[#F3E8DC] py-12">
          <HandoverStandard project={project} />
        </section>
        <section id="register" >
            <RegisterForm projects={registerProjects} />
          </section>
      </main>
      <LeftOverlay projectTitle={project.title} projectImage={project.coverImage} />

      <Footer />
    </div>
  );
};

export default ProjectDetailV2;
