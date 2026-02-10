import { useState } from "react";
import type React from "react";
import { Divider } from "antd";

export type ProjectType = "sun" | "vin" | "other";

export type ProjectProps = {
  title: string;
  description: string;
  image: string;
  link: string;
  type: ProjectType;
};

type Props = {
  projectData: ProjectProps[];
};

const HomePageCard: React.FC<Props> = ({ projectData }) => {
  const [activeFilter, setActiveFilter] = useState<ProjectType | "all">("all");

  const filteredProjects =
    activeFilter === "all"
      ? projectData
      : projectData.filter((item) => item.type === activeFilter);

  const buttonBaseClass = " font-light px-6 py-3 rounded-3xl transition-colors";
  const buttonActiveClass = "border-red-600 bg-yellow-600/90 text-white";
  const buttonInactiveClass =
    "border-gray-400 bg-gray-300 text-gray-800 hover:border-gray-500";

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 bg-gray-100/90">
      <div className="flex flex-col items-center justify-center space-y-8 pt-4 mb-4 lg:pt-2 lg:mb-8 ">
        <h2 className="text-4xl font-bold uppercase text-center text-gray-800">
          Các dự án bất động sản tại Đà Nẵng
        </h2>
        <div className="flex flex-wrap justify-center gap-4 ">
          <button
            onClick={() => setActiveFilter("sun")}
            className={`${buttonBaseClass} ${
              activeFilter === "sun" ? buttonActiveClass : buttonInactiveClass
            }`}
          >
            Dự án của Sun Group
          </button>
          <button
            onClick={() => setActiveFilter("vin")}
            className={`${buttonBaseClass} ${
              activeFilter === "vin" ? buttonActiveClass : buttonInactiveClass
            }`}
          >
            Dự án của Vin Home
          </button>
          <button
            onClick={() => setActiveFilter("other")}
            className={`${buttonBaseClass} ${
              activeFilter === "other" ? buttonActiveClass : buttonInactiveClass
            }`}
          >
            Căn hộ cao cấp khác
          </button>
        </div>
        <Divider  />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:px-20">
        {filteredProjects.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-12">
            Chưa có dự án nào trong danh mục này.
          </p>
        ) : (
          filteredProjects.map((item) => (
            <div
              key={item.title}
              className="bg-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/400x300?text=Image";
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>
              <div className="flex flex-col justify-center items-center p-4">
                <h2 className="text-xl text-gray-800 font-bold mb-2">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                  {item.description}
                </p>
                <a
                  href={item.link}
                  className="group inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-medium text-sm py-2 px-4 rounded-lg border border-amber-500/50 hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  Xem chi tiết
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePageCard;
