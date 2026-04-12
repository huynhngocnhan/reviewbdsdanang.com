import { lazy, Suspense, useEffect, useMemo, useState } from "react";
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
import FullWidthForm from "../FullWidthForm/FullWidthForm";
import LeftOverlay from "../LeftOverlay/LeftOverlay";
import TabBarOverlay from "../TabBarOverlay/TabBarOverlay";
import ContactOverlay from "../ContactOverlay/ContactOverlay";

const FloorPlanV2 = lazy(() => import("./FloorPlan/FloorPlanV2"));
const ApartmentDesign = lazy(() => import("./ApartmentDesign/ApartmentDesign"));
const ProjectExtentionV2 = lazy(() => import("./ProjectExtentionV2/ProjectExtentionV2"));
const HandoverStandard = lazy(() => import("./HandoverStandard/HandoverStandard"));
const ProjectProgress = lazy(() => import("./ProjectProgress/ProjectProgress"));

const baseProjectTabs = [
  { id: "reason-to-buy", label: "Giá trị" },
  { id: "sale-policy", label: "Chính sách" },
  { id: "lead-form", label: "Tư vấn"},
  { id: "overview", label: "Tổng quan" },
  { id: "location", label: "Vị trí" },
  { id: "floorplan", label: "Mặt bằng" },
  { id: "apartment-design", label: "Thiết kế" },
  { id: "utilities", label: "Tiện ích" },
  { id: "handover", label: "Tiêu chuẩn" },
  { id: "progress", label: "Tiến độ" },
  { id: "register", label: "Liên hệ" },
];

const ProjectDetailV2 = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(() => true);
  const [allProjects, setAllProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    let isMounted = true;

    Promise.resolve().then(() => {
      if (isMounted) setLoading(true);
    });

    projectService
      .getProjectBySlugCached(slug!)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setProject(res.data);
        } else {
          setProject(null);
        }
      })
      .catch(() => {
        if (isMounted) setProject(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    projectService
      .getPublishedProjectsCached(100)
      .then((data) => {
        setAllProjects(data);
      })
      .catch(() => {});
  }, []);

  const registerProjects = useMemo(() => allProjects.map((p) => p.title), [allProjects]);
  const projectHighlights = useMemo(() => project?.highlights ?? [], [project]);

  const hasHandoverContent = useMemo(() => {
    if (!project?.handoverStandard) return false;

    const hasDescription = Boolean(project.handoverStandard.des?.trim());
    const hasItems = project.handoverStandard.items?.some((item) =>
      Boolean(item.imgUrl?.trim() || item.title?.trim() || item.subtitle?.trim() || item.des?.trim())
    );

    return hasDescription || Boolean(hasItems);
  }, [project]);

  const hasProgressContent = useMemo(() => {
    if (!project) return false;

    return Boolean(project.progressDescription?.trim());
  }, [project]);

  const hasUtilitiesContent = useMemo(() => {
    if (!project) return false;

    return Boolean(
      project.extentionImages?.some((item) => Boolean(item.src?.trim() || item.title?.trim() || item.alt?.trim()))
    );
  }, [project]);

  const projectTabs = useMemo(
    () =>
      baseProjectTabs.filter((tab) => {
        if (tab.id === "utilities") return hasUtilitiesContent;
        if (tab.id === "handover") return hasHandoverContent;
        if (tab.id === "progress") return hasProgressContent;
        return true;
      }),
    [hasUtilitiesContent, hasHandoverContent, hasProgressContent],
  );

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

      <section className="relative" aria-labelledby="project-hero-title">
        <div className="relative h-[90vh] min-h-screen w-full overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            className="h-full w-full object-cover shadow-lg"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-6xl mx-auto px-4 pb-20 lg:ml-24 xl:ml-32 2xl:ml-40">
              <div className="max-w-4xl">
                <p className="text-amber-300/90 font-semibold tracking-wide text-sm">
                  {project.locationText}
                </p>

                <h1
                  id="project-hero-title"
                  className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight"
                >
                  {project.title}
                </h1>

                <p className="mt-3 text-white/85 text-base sm:text-lg">{project.subtitle}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {projectHighlights.map((h) => (
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
                    href="#project-content"
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white border border-white/20 hover:bg-white/15 duration-300 transition"
                  >
                    Xem thông tin chi tiết
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="project-content" className="w-full bg-[#F3E8DC]">
        <section id="reason-to-buy" className="bg-[#876347] py-10">
          <ReasonToBuy project={project} />
        </section>

        <section id="sale-policy">
          <SalePolicy project={project} />
        </section>

        <section id="lead-form">
          <LeadForm project={project} projectOptions={registerProjects} />
        </section>

        <section id="overview" className="bg-[#F3E8DC] py-12">
          <ProjectOverviewV2 project={project} />
        </section>
        <section id="location" className="bg-[#876347] py-10">
          <ProjectLocationV2 project={project} />
        </section>
        <section id="floorplan">
          <Suspense fallback={null}>
            <FloorPlanV2 project={project} />
          </Suspense>
        </section>
        <section>
          <FullWidthForm project={project} />
        </section>
        <section id="apartment-design" className="bg-[#876347] py-4">
          <Suspense fallback={null}>
            <ApartmentDesign project={project} />
          </Suspense>
        </section>
        {hasUtilitiesContent ? (
          <section id="utilities" className="bg-[#876347]">
            <Suspense fallback={null}>
              <ProjectExtentionV2 project={project} />
            </Suspense>
          </section>
        ) : null}
        {hasHandoverContent ? (
          <section id="handover">
            <Suspense fallback={null}>
              <HandoverStandard project={project} />
            </Suspense>
          </section>
        ) : null}
        <section>
          <FullWidthForm project={project} />
        </section>
        {hasProgressContent ? (
          <section id="progress" className="bg-[#876347]">
            <Suspense fallback={null}>
              <ProjectProgress project={project} />
            </Suspense>
          </section>
        ) : null}
        <section id="register" >
            <RegisterForm projects={registerProjects} />
          </section>
      </main>
      <ContactOverlay phoneNumber="0938885879" zaloUrl="https://zalo.me/0901830909" tiktokUrl="https://www.tiktok.com/@reviewbdsdanang.com"/>
      <LeftOverlay projectTitle={project.title} projectImage={project.coverImage} />
      <TabBarOverlay items={projectTabs} />
      <Footer />
    </div>
  );
};

export default ProjectDetailV2;
