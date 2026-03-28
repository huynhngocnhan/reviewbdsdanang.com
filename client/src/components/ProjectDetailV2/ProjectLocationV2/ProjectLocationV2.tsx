import type React from "react";
import type { ProjectData } from "../../../constants/projectData";
import ZoomableImage from "../../ZoomableImage";

type Props = {
  project: ProjectData;
};

type NearbyTrafficItem = {
  url: string;
  title: string;
  des: string;
};

type NearbyGroup = {
  minute: string;
  places: string[];
  trafficItems?: NearbyTrafficItem[];
};

const nearbyGroups: NearbyGroup[] = [
  {
    minute: "05",
    places: ["Công viên trung tâm", "Trung tâm thương mại", "Trường học quốc tế"],
    trafficItems: [
      {
        url: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1200&q=80",
        title: "CẦU TỨ LIÊN",
        des: "Chính thức khởi công tháng 05/2025 và dự kiến hoàn thành trong năm 2027.",
      },
      {
        url: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1200&q=80",
        title: "TRUNG TÂM HỘI CHỢ TRIỂN LÃM QUỐC GIA",
        des: "Triển lãm Thành tựu Đất nước 80 năm tại Trung tâm Triển lãm Việt Nam (Grand Expo).",
      },
      {
        url: "https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=1200&q=80",
        title: "CAO TỐC KẾT NỐI VỚI SÂN BAY GIA BÌNH",
        des: "Tuyến kết nối sân bay Gia Bình (Bắc Ninh) với Hà Nội, tăng năng lực giao thông khu vực.",
      },
      {
        url: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
        title: "TUYẾN ĐƯỜNG SẮT KẾT NỐI HÀ NỘI - QUẢNG NINH",
        des: "Dự án đường sắt liên vùng, tăng liên kết giao thương và giảm tải giao thông đường bộ.",
      },
      {
        url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80",
        title: "TUYẾN METRO SỐ 4",
        des: "Tuyến metro đô thị trọng điểm, góp phần hoàn thiện mạng lưới giao thông Hà Nội.",
      },
    ],
  },
  {
    minute: "10",
    places: ["Trung tâm thành phố", "Bệnh viện quốc tế", "Khu hành chính"],
  },
  {
    minute: "20",
    places: ["Sân bay quốc tế", "Ga trung tâm"],
  },
  {
    minute: "30",
    places: ["Khu du lịch ven biển", "Vùng tiện ích mở rộng"],
  },
];

const ProjectLocationV2: React.FC<Props> = ({ project }) => {
  const locationVisual = project.locationImage || project.coverImage;

  return (
    <section className="relative overflow-hidden py-8 md:py-16">
      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-5 text-white">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wide uppercase">Vị trí dự án</h2>
            <h3 className="mt-2 text-4xl sm:text-5xl font-black text-[#f9de2b] uppercase leading-tight">
              {project.title}
            </h3>

            <p className="mt-6 whitespace-pre-line text-white leading-relaxed text-base">{project.locationDescription}</p>

              <a
                href={project.location360Url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center rounded-xl bg-[#f9de2b] px-4 py-2.5 text-[#17372F] font-bold hover:bg-[#efd24b] transition"
              >
                Xem vị trí 360°
              </a>

          </div>

          <ZoomableImage
            src={locationVisual}
            alt={`${project.title} - vị trí dự án`}
            className="lg:col-span-7 rounded-2xl border border-white/20 shadow-2xl"
            imageClassName="min-h-[450px]"
          />
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {nearbyGroups.map((group) => (
            <div key={group.minute} className="text-white min-w-0">
              <p className="text-5xl font-black text-white">
                {group.minute}
                <span className="text-[#f9de2b] text-xl font-bold tracking-wide uppercase"> PHÚT</span>
              </p>
              <ul className="mt-3 space-y-2 text-white/90 text-sm sm:text-base">
                {group.places.map((place) => (
                  <li key={place}>• {place}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {nearbyGroups.some((group) => group.trafficItems?.length) && (
          <div className="mt-10">
            <h3 className="text-3xl sm:text-4xl font-extrabold uppercase text-white">
              Các tuyến giao thông huyết mạch:
            </h3>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {nearbyGroups.flatMap((group) => group.trafficItems ?? []).map((item) => (
                <article
                  key={item.title}
                  className="overflow-hidden rounded-md bg-[#17372F]/40 text-white shadow-lg"
                >
                  <div className="relative h-44">
                    <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  </div>

                  <div className="p-4">
                    <h4 className="text-base font-extrabold uppercase leading-snug">{item.title}</h4>
                    <p className="mt-2 text-sm text-white/85 leading-relaxed">{item.des}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectLocationV2;
