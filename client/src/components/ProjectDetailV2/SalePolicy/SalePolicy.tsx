import type React from "react";
import type { ProjectData } from "../../../constants/projectData";
import ZoomableImage from "../../ZoomableImage";

type Props = {
  project: ProjectData;
};

const SalePolicy: React.FC<Props> = ({ project }) => {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 sm:text-3xl font-bold uppercase tracking-[0.2em]">
            Chính sách bán hàng
          </h2>
          <h3 className=" bg-gradient-to-b from-amber-500 to-amber-600 bg-clip-text text-transparent mt-2 text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
              {project.title}
          </h3>
          <p className="mt-4 max-w-5xl font-semibold mx-auto text-[#6B4E3D] leading-relaxed">
            Dự án áp dụng chính sách bán hàng và hỗ trợ tài chính linh hoạt dành cho khách hàng. Bao gồm các phương thức thanh toán, ưu đãi và chương trình hỗ trợ lãi suất theo từng giai đoạn. Chi tiết chính sách và bảng ưu đãi được trình bày trong phần thông tin bên dưới.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <ZoomableImage
            src={project.salePolicy?.policyImage || project.coverImage}
            alt={`${project.title} - Chính sách bán hàng`}
            className="rounded-2xl shadow-2xl"
            imageClassName="min-h-[400px] lg:min-h-[600px]"
          />
          
          <div className="flex flex-col gap-4 justify-between">
            <div className="rounded-2xl border-2 border-[#C96B5B] bg-[#F9F3EC] p-5 sm:p-7 shadow-xl">
              <ul className="space-y-4 text-[#3D2B1F] leading-relaxed">
                <li><span className="font-semibold">• Tòa căn hộ:</span> Peak I, Peak II</li>
                <li><span className="font-semibold">• Loại hình căn hộ:</span> Studio, 1PN, 1PN+1, 2PN, 2PN+1, 3PN, 4PN, Duplex, Penthouse</li>
                <li><span className="font-semibold">• Diện tích căn hộ:</span> 34,4 – 130 m²</li>
                <li><span className="font-semibold">• Giá bán tham khảo:</span> 5,1 – 19,5 tỷ/căn</li>
                <li><span className="font-semibold">• Nhận đặt chỗ từ </span><span className="text-[#D53F3F] font-semibold">50 triệu</span></li>
                <li>
                  <span className="font-semibold">• Hỗ trợ vay vốn:</span>
                  <ul className="ml-6 mt-2 space-y-1">
                    <li>• Vay tối đa <span className="text-[#D53F3F] font-semibold">70%</span> – hỗ trợ lãi suất <span className="text-[#D53F3F] font-semibold">0%</span> đến <span className="text-[#D53F3F] font-semibold">03/2029</span></li>
                    <li>• Vay tối đa <span className="text-[#D53F3F] font-semibold">50%</span> – hỗ trợ lãi suất <span className="text-[#D53F3F] font-semibold">0%</span> đến <span className="text-[#D53F3F] font-semibold">06/2029</span></li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">• Chiết khấu thanh toán:</span>
                  <ul className="ml-6 mt-2 space-y-1">
                    <li>• <span className="text-[#D53F3F] font-semibold">8%</span> khi thanh toán theo tiến độ</li>
                    <li>• Lên tới <span className="text-[#D53F3F] font-semibold">17%</span> khi thanh toán sớm</li>
                  </ul>
                </li>
                <li>• Ưu đãi tri ân cư dân: Chiết khấu thêm <span className="text-[#D53F3F] font-semibold">1%</span></li>
                <li>• Quà tặng: <span className="text-[#D53F3F] font-semibold">24</span> tháng phí quản lý dịch vụ</li>
                <li>• Bàn giao tiêu chuẩn hoàn thiện theo dòng căn hộ <span className="text-[#D53F3F] font-semibold">Lumière Series</span></li>
              </ul>
            </div>

            <div className="px-2">
              <p className="mt-2 text-center text-sm leading-relaxed text-[#6B4E3D]">
                Chính sách bán hàng và ưu đãi có thể được cập nhật theo từng giai đoạn. Quý khách vui lòng liên hệ để được cung cấp thông tin chi tiết và phù hợp nhu cầu.
              </p>

              <div className="mt-6 flex items-center justify-center gap-4">
                <a href="tel:0938885879" className="btn-float inline-flex items-center rounded-full bg-[#B6742C] px-4 py-3 text-white font-bold text-base hover:bg-[#9B6122] transition">
                  <span className="mr-2">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M6.62 10.79a15.466 15.466 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
                  </svg>
                  </span>
                  <span>0938885879</span>
                </a>
                <a href="https://zalo.me/0901830909" target="_blank" rel="noreferrer" className="btn-ladi">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="60" height="60" viewBox="0 0 48 48">
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
