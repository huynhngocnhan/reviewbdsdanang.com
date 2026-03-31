import { useState } from "react";
import type React from "react";
import { Divider } from "antd";
import type { ProjectData, ProjectCategory } from "../../constants/projectData";

type FilterType = ProjectCategory | "all" | "featured";

type Props = {
  projectData: ProjectData[];
};

const HomePageCard: React.FC<Props> = ({ projectData }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("featured");

  const filteredProjects = (() => {
    switch (activeFilter) {
      case "featured":
        return projectData.filter((item) => item.isFeatured);
      case "all":
        return projectData;
      default:
        return projectData.filter((item) => item.category === activeFilter);
    }
  })();

  const buttonBaseClass = "px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 sm:px-6 sm:py-3 sm:text-base sm:rounded-2xl w-full sm:w-auto";
  const buttonActiveClass = "bg-[#8F6552] text-white border-none shadow-lg";
  const buttonInactiveClass =
    "bg-white text-gray-700 border border-gray-300 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700";

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 bg-gray-100/90">
      <div className="mb-4 flex flex-col items-center justify-center space-y-5 pt-4 sm:space-y-6 lg:mb-8 lg:pt-2">
        <h2
          data-aos="fade-up"
          data-aos-duration="800"
          className="px-2 text-center text-2xl font-bold uppercase leading-tight text-amber-900 sm:text-3xl lg:text-4xl"
        >
          Các dự án bất động sản tại Đà Nẵng
        </h2>
        <div
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="100"
          className="flex flex-wrap justify-center gap-2 sm:gap-4"
        >
          <button
            onClick={() => setActiveFilter("featured")}
            className={`${buttonBaseClass} ${
              activeFilter === "featured" ? buttonActiveClass : buttonInactiveClass
            }`}
          >
            Dự án nổi bật
          </button>
          <button
            onClick={() => setActiveFilter("all")}
            className={`${buttonBaseClass} ${
              activeFilter === "all" ? buttonActiveClass : buttonInactiveClass
            }`}
          >
            Tất cả dự án
          </button>
          <button
            onClick={() => setActiveFilter("SUN")}
            className={`${buttonBaseClass} ${
              activeFilter === "SUN" ? buttonActiveClass : buttonInactiveClass
            }`}
          >
            Dự án Sun Group
          </button>
          <button
            onClick={() => setActiveFilter("VIN")}
            className={`${buttonBaseClass} ${
              activeFilter === "VIN" ? buttonActiveClass : buttonInactiveClass
            }`}
          >
            Dự án Vin Home
          </button>
          <button
            onClick={() => setActiveFilter("OTHER")}
            className={`${buttonBaseClass} ${
              activeFilter === "OTHER" ? buttonActiveClass : buttonInactiveClass
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
          filteredProjects.map((item, index) => (
            <a
              key={item.id}
              href={`/du-an/${item.slug}`}
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={index * 100}
              className="bg-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-200">
                <img
                  src={item.coverImage}
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
                  {item.shortDescription}
                </p>
                <span
                  className="group inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-medium text-sm py-2 px-4 rounded-lg border border-amber-500/50 hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  Xem chi tiết
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePageCard;
