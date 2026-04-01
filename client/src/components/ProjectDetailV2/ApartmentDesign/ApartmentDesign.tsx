import { useMemo, useState } from "react";

import type { ProjectData, ApartmentItem } from "../../../constants/projectData";
import ApartmentForm from "../../ApartmentForm/ApartmentForm";

type Props = {
  project: ProjectData;
};

// Fallback mock data khi project.apartmentDesign không có dữ liệu
const DEFAULT_APARTMENT_DESIGN = {
  des: "Thiết kế tối ưu công năng, đa dạng lựa chọn và đảm bảo ánh sáng tự nhiên. Mỗi loại căn hộ đều có triết lý bố trí riêng, phù hợp từng phong cách sống hiện đại.",
  desDetails: [
    "Studio: 34.4m² – 40.3m², linh hoạt cho người độc thân",
    "1PN: 45.3m² – 50.1m², tối ưu không gian sinh hoạt",
    "2PN: 63.3m² – 72.3m², phù hợp gia đình trẻ",
    "3PN & 4PN: thiết kế rộng rãi, tăng riêng tư",
    "Penthouse & Duplex: tầm nhìn rộng, phong cách độc bản",
  ] as string[],
  apartmentItems: [
    {
      name: "Studio",
      label: "Studio",
      description: "Thiết kế tối ưu ánh sáng tự nhiên và công năng, phù hợp đa dạng nhu cầu sử dụng.",
      price: "5,1 tỷ/căn",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "1 Phòng ngủ",
      label: "1PN",
      description: "Thiết kế tối ưu ánh sáng tự nhiên và công năng, phù hợp đa dạng nhu cầu sử dụng.",
      price: "5,2 tỷ/căn",
      image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "2 Phòng ngủ",
      label: "2PN",
      description: "Thiết kế tối ưu ánh sáng tự nhiên và công năng, phù hợp đa dạng nhu cầu sử dụng.",
      price: "5,3 tỷ/căn",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "3 Phòng ngủ",
      label: "3PN",
      description: "Thiết kế tối ưu ánh sáng tự nhiên và công năng, phù hợp đa dạng nhu cầu sử dụng.",
      price: "5,4 tỷ/căn",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "3PN Lift",
      label: "3PNL",
      description: "Thiết kế tối ưu ánh sáng tự nhiên và công năng, phù hợp đa dạng nhu cầu sử dụng.",
      price: "5,1 tỷ/căn",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "4 Phòng ngủ",
      label: "4PN",
      description: "Thiết kế tối ưu ánh sáng tự nhiên và công năng, phù hợp đa dạng nhu cầu sử dụng.",
      price: "5,1 tỷ/căn",
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    },
  ] as ApartmentItem[],
};

const ApartmentDesign = ({ project }: Props) => {
  const [selectedImage, setSelectedImage] = useState<ApartmentItem | null>(null);

  // Lấy dữ liệu từ project.apartmentDesign, fallback sang mock nếu không có
  const apartmentDesignData = useMemo(() => ({
    des: project.apartmentDesign?.des ?? DEFAULT_APARTMENT_DESIGN.des,
    desDetails: project.apartmentDesign?.desDetails ?? DEFAULT_APARTMENT_DESIGN.desDetails,
    apartmentItems: project.apartmentDesign?.apartmentItems ?? DEFAULT_APARTMENT_DESIGN.apartmentItems,
  }), [project.apartmentDesign]);

  const apartmentHighlights = useMemo(
    () => apartmentDesignData.desDetails,
    [apartmentDesignData.desDetails]
  );
  const apartmentItems = useMemo(
    () => apartmentDesignData.apartmentItems,
    [apartmentDesignData.apartmentItems]
  );

  return (
    <section
      className="text-white"
      aria-labelledby="apartment-design-title"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="mx-auto max-w-6xl px-4 py-14">
        <header className="text-center">
          <p className="text-lg font-extrabold uppercase tracking-[0.28em] text-white">
            Thiết kế căn hộ
          </p>
          <h2
            id="apartment-design-title"
            itemProp="name"
            className="mt-3 text-4xl font-extrabold uppercase text-[#ffe228] sm:text-5xl"
          >
            {project.title}
          </h2>
          <p
            itemProp="description"
            className="mx-auto mt-4 max-w-3xl text-base text-white/90 sm:text-lg"
          >
            {apartmentDesignData.des}
          </p>

          {apartmentHighlights.length > 0 && (
            <ul
              className="mx-auto mt-6 grid max-w-4xl gap-2 text-left text-sm text-white sm:grid-cols-2"
              aria-label={`Ưu điểm thiết kế căn hộ ${project.title}`}
            >
              {apartmentHighlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-amber-400" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
        </header>

        {apartmentItems.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apartmentItems.map((item, index) => (
              <article
                key={`${item.name}-${item.label}`}
                className="group relative overflow-hidden rounded-xl bg-[#17372F]/40 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/Product"
              >
                <meta itemProp="position" content={String(index + 1)} />
                <div className="absolute left-4 top-4 z-10 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#2C2C2C] shadow-lg">
                  {item.label}
                </div>

                <button
                  type="button"
                  className="relative block w-full overflow-hidden text-left"
                  onClick={() => setSelectedImage(item)}
                  aria-label={`Xem chi tiết hình ảnh ${item.name}`}
                >
                  <img
                    src={item.image}
                    alt={`Thiết kế căn hộ ${item.name}`}
                    itemProp="image"
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 transition group-hover:opacity-60" />
                  <span className="absolute bottom-4 left-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    Xem ảnh lớn
                  </span>
                </button>

                <div className="px-5 pb-6 pt-4">
                  <h3
                    className="flex justify-between text-lg font-semibold uppercase text-white"
                    itemProp="name"
                  >
                    <span>{item.name}</span>
                    <span className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-sm text-white/90">
                      {item.price}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm text-white/90">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-white/60">Dữ liệu đang được cập nhật.</p>
        )}

        <ApartmentForm apartmentOptions={apartmentItems} project={project} />
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-10">
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-[#111D18] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Ảnh thiết kế ${selectedImage.name}`}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-white/20"
              aria-label="Đóng ảnh"
            >
              X
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.name}
              className="h-[70vh] w-full object-contain bg-black"
              decoding="async"
            />

            <div className="px-6 py-4">
              <h4 className="text-lg font-semibold text-white">{selectedImage.name}</h4>
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
