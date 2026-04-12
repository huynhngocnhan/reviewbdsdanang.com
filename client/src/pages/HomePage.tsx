import { useState, useEffect } from "react";
import type React from "react";
import AOS from "aos";
import Header from "../components/Header/Header";
import VideoBanner from "../components/VideoBanner/VideoBanner";
import HomePageCard from "../components/HomePageCard/HomePageCard";
import type { ProjectData } from "../constants/projectData";
import { projectService } from "../services/project.service";
import Partner from "../components/Partner/Partner";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import Footer from "../components/Footer/Footer";

const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    projectService
      .getProjects({ status: "PUBLISHED", limit: 100 })
      .then((res) => {
        if (res.success && res.data) {
          setProjects(res.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [projects]);

  const projectTitles = projects.map((p) => p.title);

  return (
    <div className="bg-gray-100/90">
      <Header />
      <VideoBanner />
      <HomePageCard projectData={projects} />
      <Partner/>
      <RegisterForm projects={projectTitles} />
      <Footer />
    </div>
  );
};

export default HomePage;
