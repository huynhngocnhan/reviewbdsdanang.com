import type React from "react";
import Header from "../components/Header/Header";
import VideoBanner from "../components/VideoBanner/VideoBanner";
import HomePageCard from "../components/HomePageCard/HomePageCard";
import type { ProjectProps } from "../components/HomePageCard/HomePageCard";

const projectData: ProjectProps[] = [
  {
    title: "Căn hộ Sun Symphony",
    description:
      "Sun Symphony Residence Đà Nẵng là một dự án bất động sản cao cấp do tập đoàn Sun Group đầu tư và phát triển có pháp lý sở hữu lâu dài – Tọa lạc tại vị trí đắc địa bên bờ sông Hàn thơ mộng, đường Trần Hưng Đạo, Quận Sơn Trà, Đà Nẵng…",
    image:
      "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg",
    link: "/home-page-card-1",
    type: "sun",
  },
  {
    title: "Dự án Sun Group 2",
    description:
      "Sun Symphony Residence Đà Nẵng là một dự án bất động sản cao cấp do tập đoàn Sun Group đầu tư và phát triển có pháp lý sở hữu lâu dài – Tọa lạc tại vị trí đắc địa bên bờ sông Hàn thơ mộng, đường Trần Hưng Đạo, Quận Sơn Trà, Đà Nẵng…",
    image:
      "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg",
    link: "/home-page-card-2",
    type: "sun",
  },
  {
    title: "VinHome Ocean Park",
    description:
      "Dự án Vin Home tại Đà Nẵng. Sun Symphony Residence Đà Nẵng là một dự án bất động sản cao cấp do tập đoàn Sun Group đầu tư và phát triển có pháp lý sở hữu lâu dài – Tọa lạc tại vị trí đắc địa bên bờ sông Hàn thơ mộng, đường Trần Hưng Đạo, Quận Sơn Trà, Đà Nẵng…",
    image:
      "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
    link: "/home-page-card-3",
    type: "vin",
  },
  {
    title: "Căn hộ cao cấp The Arena",
    description:
      "Căn hộ cao cấp khác tại Đà Nẵng. Sun Symphony Residence Đà Nẵng là một dự án bất động sản cao cấp do tập đoàn Sun Group đầu tư và phát triển có pháp lý sở hữu lâu dài – Tọa lạc tại vị trí đắc địa bên bờ sông Hàn thơ mộng, đường Trần Hưng Đạo, Quận Sơn Trà, Đà Nẵng…",
    image:
      "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg",
    link: "/home-page-card-4",
    type: "other",
  },
];

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="">
        <VideoBanner />
      </div>
      <div className="">
        <HomePageCard projectData={projectData} />
      </div>
    </>
  );
};

export default HomePage;
