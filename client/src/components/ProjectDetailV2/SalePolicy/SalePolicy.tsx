import type React from "react";
import type { ProjectData, SalePolicyItem } from "../../../constants/projectData";
import ZoomableImage from "../../ZoomableImage";

type Props = {
  project: ProjectData;
};

const fallbackItems: SalePolicyItem[] = [
  { title: "Tòa căn hộ", value: "Peak I, Peak II" },
  { title: "Loại hình căn hộ", value: "Studio, 1PN, 1PN+1, 2PN, 2PN+1, 3PN, 4PN, Duplex, Penthouse" },
  { title: "Diện tích căn hộ", value: "34,4 – 130 m²" },
  { title: "Giá bán tham khảo", value: "5,1 – 19,5 tỷ/căn" },
  { title: "Nhận đặt chỗ", value: "Từ 50 triệu" },
  {
    title: "Hỗ trợ vay vốn",
    subItems: ["Vay tối đa 70% – hỗ trợ lãi suất 0% đến 03/2029", "Vay tối đa 50% – hỗ trợ lãi suất 0% đến 06/2029"],
  },
  {
    title: "Chiết khấu thanh toán",
    subItems: ["8% khi thanh toán theo tiến độ", "Lên tới 17% khi thanh toán sớm"],
  },
  { title: "Ưu đãi tri ân cư dân", value: "Chiết khấu thêm 1%" },
  { title: "Quà tặng", value: "24 tháng phí quản lý dịch vụ" },
  { title: "Bàn giao", value: "Tiêu chuẩn hoàn thiện theo dòng căn hộ Lumière Series" },
];

const SalePolicy: React.FC<Props> = ({ project }) => {
  const policy = project.salePolicy;

  const heading = policy?.heading || "Chính sách bán hàng";
  const subheading = policy?.subheading || project.title;
  const description =
    policy?.description ||
    "Dự án áp dụng chính sách bán hàng và hỗ trợ tài chính linh hoạt dành cho khách hàng. Bao gồm các phương thức thanh toán, ưu đãi và chương trình hỗ trợ lãi suất theo từng giai đoạn. Chi tiết chính sách và bảng ưu đãi được trình bày trong phần thông tin bên dưới.";
  const items = policy?.items && policy.items.length > 0 ? policy.items : fallbackItems;
  const footerNote =
    policy?.footerNote ||
    "Chính sách bán hàng và ưu đãi có thể được cập nhật theo từng giai đoạn. Quý khách vui lòng liên hệ để được cung cấp thông tin chi tiết và phù hợp nhu cầu.";
  const contactPhone = policy?.contactPhone || "0938885879";
  const contactPhoneHref = `tel:${contactPhone.replace(/\s+/g, "")}`;

  return (
    <section
      id="sale-policy"
      aria-labelledby="sale-policy-title"
      className="w-full py-12 md:py-16"
      itemScope
      itemType="https://schema.org/OfferCatalog"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <h2 id="sale-policy-title" className="text-2xl font-bold uppercase tracking-[0.2em] text-gray-900 sm:text-3xl" itemProp="name">
            {heading}
          </h2>
          <p className="mt-2 bg-gradient-to-b from-amber-500 to-amber-600 bg-clip-text text-4xl font-extrabold uppercase tracking-tight text-transparent sm:text-5xl">
            {subheading}
          </p>
          <p className="mx-auto mt-4 max-w-5xl font-semibold leading-relaxed text-[#6B4E3D]" itemProp="description">
            {description}
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <ZoomableImage
            src={policy?.policyImage || project.coverImage}
            alt={`${project.title} - Chính sách bán hàng`}
            className="rounded-2xl shadow-2xl"
            imageClassName="min-h-[400px] lg:min-h-[600px]"
          />

          <div className="flex flex-col justify-between gap-4">
            <article className="rounded-2xl border-2 border-[#C96B5B] bg-[#F9F3EC] p-5 shadow-xl sm:p-7">
              <ul className="space-y-4 leading-relaxed text-[#3D2B1F]">
                {items.map((item, index) => (
                  <li key={`${item.title}-${index}`} itemProp="itemListElement" itemScope itemType="https://schema.org/Offer">
                    <p>
                      <span className="font-semibold">• {item.title}:</span>{" "}
                      {item.value ? <span itemProp="description">{item.value}</span> : null}
                    </p>

                    {item.subItems && item.subItems.length > 0 ? (
                      <ul className="ml-6 mt-2 list-disc space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={`${item.title}-sub-${subIndex}`}>
                            <span itemProp="description">{subItem}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </article>

            <div className="px-2">
              <p className="mt-2 text-center text-sm leading-relaxed text-[#6B4E3D]">{footerNote}</p>

              <div className="mt-6 flex items-center justify-center gap-4">
                <a
                  href={contactPhoneHref}
                  className="btn-float inline-flex items-center rounded-full bg-[#B6742C] px-4 py-3 text-base font-bold text-white transition hover:bg-[#9B6122]"
                  aria-label={`Gọi tư vấn ${contactPhone}`}
                >
                  <span className="mr-2">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="M6.62 10.79a15.466 15.466 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </span>
                  <span>{contactPhone}</span>
                </a>
                <a href="https://zalo.me/0901830909" target="_blank" rel="noreferrer" className="btn-ladi" aria-label="Liên hệ tư vấn qua Zalo">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="60" height="60" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#2962ff" d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10	c4.722,0,8.883-2.348,11.417-5.931V36H15z"></path><path fill="#eee" d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19	c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742	c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083	C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z"></path><path fill="#2962ff" d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75	S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z"></path><path fill="#2962ff" d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z"></path><path fill="#2962ff" d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75	S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5	c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z"></path><path fill="#2962ff" d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5	c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalePolicy;
