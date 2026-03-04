import type React from "react";
import Header from "../components/Header/Header";
import VideoBanner from "../components/VideoBanner/VideoBanner";
import HomePageCard from "../components/HomePageCard/HomePageCard";
import { MOCK_PROJECTS } from "../constants/projectData";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import Footer from "../components/Footer/Footer";



const HomePage: React.FC = () => {
  const projectTitles = MOCK_PROJECTS.map((project) => project.title);

  return (
    <div className="bg-gray-100/90">
      <Header />
      <VideoBanner />
      <HomePageCard projectData={MOCK_PROJECTS} />
      <RegisterForm projects={projectTitles} />
      <Footer />
    </div>
  );
};

export default HomePage;
