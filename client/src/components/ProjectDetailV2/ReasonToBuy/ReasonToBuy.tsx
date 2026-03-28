import type React from "react";
import { useState } from "react";
import { MOCK_PROJECTS } from "../../../constants/projectData";
import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
};

const ReasonToBuy: React.FC<Props> = ({ project }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const mockProject = MOCK_PROJECTS.find((p) => p.slug === project.slug);

  const reasonToBuyTitle =
    project.reasonToBuyTitle || mockProject?.reasonToBuyTitle || "Giá trị cốt lõi";
  const reasonToBuyDescription =
    project.reasonToBuyDescription ||
    mockProject?.reasonToBuyDescription ||
    `Bất động sản không chỉ là tài sản – với người biết nhìn xa, đó là GIA TÀI ĐỂ ĐỜI. Và Sun Symphony Residence chính là lựa chọn mua trước – thắng lớn dành cho nhà đầu tư thông thái:

💥 Nền giá hấp dẫn, thấp hơn mặt bằng lân cận – biên lợi nhuận rõ ràng ngay từ khi xuống tiền.
💥 Mua khi hạ tầng đang bứt tốc – đón trọn dư địa tăng giá theo từng giai đoạn hoàn thiện.
💥 Mua ở giai đoạn đầu triển khai – tối ưu cơ hội tăng trưởng khi dự án thành hình.

💎 TẠI SAO LẠI LỰA CHỌN SUN SYMPHONY RESIDENCE?
✨Vị trí ven sông Hàn đắt giá, kết nối nhanh đến trung tâm thành phố.
✨Chủ đầu tư uy tín, quy hoạch đồng bộ, tiện ích nội khu chất lượng cao.
✨Sản phẩm phù hợp cả nhu cầu an cư sang trọng và đầu tư dài hạn.
⏳ Trong bất động sản, thời điểm là TẤT CẢ. Người chiến thắng luôn là người đi trước.`;
  const reasonToBuyImage =
    project.reasonToBuyImage || mockProject?.reasonToBuyImage || project.heroImage;
  const reasonToBuyImageAlt =
    project.reasonToBuyImageAlt || mockProject?.reasonToBuyImageAlt || project.title;

  const handleChange = (field: "name" | "phone", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValidPhone = (value: string) => /^(0|\+84)[0-9]{9,10}$/.test(value.trim());

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim() || !isValidPhone(formData.phone)) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
    setFormData({ name: "", phone: "" });
  };

  return (
    <section className="w-full bg-transparent py-8 md:py-10" id="reason-to-buy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl text-white sm:text-3xl font-extrabold uppercase tracking-[0.16em]">
            {reasonToBuyTitle} <span className="text-4xl lg:text-5xl font-extrabold text-[#f9de2b]">{project.title}</span>
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-10 items-start">
          <div className="rounded-2xl p-4 sm:p-7 text-[#6B4E3D]">
            <p className="whitespace-pre-line text-lg lg:text-base leading-8 italic text-gray-100">{reasonToBuyDescription}</p>

            <div className="mt-6 rounded-2xl border border-[#C8A889] bg-[#E9D9C8] p-5 sm:p-6 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-[#5C4033] uppercase tracking-wide">
                Đăng ký nhận tư vấn
              </h3>
              <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Họ và tên"
                    className="h-10 w-full rounded-xl border border-[#C8A889] bg-[#F7EFE6] px-4 text-[#5C4033] placeholder:text-[#9A7B5E] outline-none transition focus:border-[#8A6A4F]"
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="Số điện thoại"
                    className="h-10 w-full rounded-xl border border-[#C8A889] bg-[#F7EFE6] px-4 text-[#5C4033] placeholder:text-[#9A7B5E] outline-none transition focus:border-[#8A6A4F]"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-[#8A6A4F] font-bold uppercase tracking-wide text-white transition hover:bg-[#735743]"
                >
                  <span className="text-zoom">Nhận tư vấn ngay</span>
                </button>
              </form>

              {submitted && (
                <p className="mt-3 text-sm font-medium text-emerald-700">
                  Cảm ơn bạn! Chuyên viên sẽ liên hệ trong thời gian sớm nhất.
                </p>
              )}

              {!submitted && formData.phone && !isValidPhone(formData.phone) && (
                <p className="mt-3 text-sm font-medium text-amber-700">
                  Số điện thoại chưa đúng định dạng Việt Nam.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-lg shadow-2xl">
              <img src={reasonToBuyImage} alt={reasonToBuyImageAlt} className="h-[500px] lg:h-[700px] w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReasonToBuy;
