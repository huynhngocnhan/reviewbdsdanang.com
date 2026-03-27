import { useState } from "react";
import type React from "react";

import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};

type ApartmentDesignItem = {
  title: string;
  badge: string;
  image: string;
};

const apartmentDesignMock: {
  apartmentDesignDes: {
    description: string;
    highlights: string[];
  };
  items: ApartmentDesignItem[];
} = {
  apartmentDesignDes: {
    description:
      "Thiết kế tối ưu công năng, đa dạng lựa chọn và đảm bảo ánh sáng tự nhiên. Mỗi loại căn hộ đều có triết lý bố trí riêng, phù hợp từng phong cách sống hiện đại.",
    highlights: [
      "Studio: 34.4m² – 40.3m², linh hoạt cho người độc thân",
      "1PN: 45.3m² – 50.1m², tối ưu không gian sinh hoạt",
      "2PN: 63.3m² – 72.3m², phù hợp gia đình trẻ",
      "3PN & 4PN: thiết kế rộng rãi, tăng riêng tư",
      "Penthouse & Duplex: tầm nhìn rộng, phong cách độc bản",
    ],
  },
  items: [
    {
      title: "Studio",
      badge: "Studio",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "1 Phòng ngủ",
      badge: "1PN",
      image:
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "2 Phòng ngủ",
      badge: "2PN",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "3 Phòng ngủ",
      badge: "3PN",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "3PN Lift",
      badge: "3PNL",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "4 Phòng ngủ",
      badge: "4PN",
      image:
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

const ApartmentDesign: React.FC<Props> = ({ project }) => {
  const [selectedImage, setSelectedImage] = useState<ApartmentDesignItem | null>(null);
  const { apartmentDesignDes, items } = apartmentDesignMock;

  return (    <section className="text-white" aria-labelledby="apartment-design-title">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <header className="text-center">
          <p className="text-lg font-semibold uppercase tracking-[0.28em] text-white">Thiết kế căn hộ</p>
          <h2
            id="apartment-design-title"
            className="mt-3 text-4xl font-extrabold uppercase text-[#ffe228] sm:text-5xl"
          >
            {project.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-white/90 sm:text-lg">
            {apartmentDesignDes.description}
          </p>

          <ul className="mx-auto mt-6 grid max-w-4xl gap-2 text-left text-sm text-white sm:grid-cols-2">
            {apartmentDesignDes.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-amber-400" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={`${item.title}-${item.badge}`}
              className="group relative overflow-hidden bg-emerald-800 rounded-xl shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute left-4 top-4 z-10 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#2C2C2C] shadow-lg">
                {item.badge}
              </div>

              <button
                type="button"
                className="relative block w-full overflow-hidden text-left"
                onClick={() => setSelectedImage(item)}
                aria-label={`Xem chi tiết hình ảnh ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={`Thiết kế căn hộ ${item.title}`}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 transition group-hover:opacity-60" />
                <span className="absolute bottom-4 left-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  Xem ảnh lớn
                </span>
              </button>

              <div className="px-5 pb-6 pt-4">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/70">
                  Thiết kế tối ưu ánh sáng tự nhiên và công năng, phù hợp đa dạng nhu cầu sử dụng.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-10">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-[#111D18] shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20"
              aria-label="Đóng ảnh"
            >
              Đóng
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="h-[70vh] w-full object-contain bg-black"
            />

            <div className="px-6 py-4">
              <h4 className="text-lg font-semibold text-white">{selectedImage.title}</h4>
              <p className="mt-1 text-sm text-white/70">
                Hình ảnh minh họa mặt bằng tham khảo cho loại căn hộ này.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ApartmentDesign;
