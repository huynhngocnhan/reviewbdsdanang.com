import type React from "react";
import Header from "../components/Header/Header";
import VideoBanner from "../components/VideoBanner/VideoBanner";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <VideoBanner />
        </div>
        <div className="h-screen bg-slate-500">
           
        </div>
    </>
  );
};

export default HomePage;
