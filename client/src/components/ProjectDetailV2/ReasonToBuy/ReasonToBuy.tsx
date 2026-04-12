import type React from "react";
import { memo, useState } from "react";
import { MOCK_PROJECTS } from "../../../constants/projectData";
import type { ProjectData } from "../../../constants/projectData";
import ZoomableImage from "../../ZoomableImage";
import { api } from "../../../api/client";

type Props = {
  project: ProjectData;
};

const ReasonToBuy: React.FC<Props> = ({ project }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const mockProject = MOCK_PROJECTS.find((p) => p.slug === project.slug);

  const reasonToBuyTitle = project.reasonToBuyTitle || mockProject?.reasonToBuyTitle || "Giá trị cốt lõi";
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
  const reasonToBuyImage = project.reasonToBuyImage || mockProject?.reasonToBuyImage || project.heroImage;
  const reasonToBuyImageAlt =
    project.reasonToBuyImageAlt || mockProject?.reasonToBuyImageAlt || `Lý do nên đầu tư ${project.title}`;

  const handleChange = (field: "name" | "phone", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg("");
  };

  const isValidPhone = (value: string) => /^(0|\+84)[0-9]{9,10}$/.test(value.trim());

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên.");
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setErrorMsg("Số điện thoại chưa đúng định dạng Việt Nam.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await api.post("/registrations", {
        fullname: formData.name.trim(),
        phonenum: formData.phone.trim(),
        project: project.title,
      });

      setSubmitted(true);
      setFormData({ name: "", phone: "" });
    } catch (err) {
      console.error("Registration error:", err);
      const error = err as { response?: { data?: { message?: string } } };
      setErrorMsg(error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="reason-to-buy"
      aria-labelledby="reason-to-buy-title"
      className="w-full bg-transparent py-8 md:py-10"
      itemScope
      itemType="https://schema.org/WebPageElement"
      data-aos="fade-up"
      data-aos-duration="500"
      data-aos-once="true"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h2
            id="reason-to-buy-title"
            className="text-2xl font-black uppercase tracking-[0.16em] text-white sm:text-3xl lg:text-4xl"
            itemProp="name"
          >
            {reasonToBuyTitle}
            <span className="mt-3 block text-4xl font-extrabold text-[#f9de2b] sm:text-5xl lg:text-6xl">{project.title}</span>
          </h2>
        </header>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-10">
          <article className="rounded-2xl p-4 text-[#6B4E3D] sm:p-7" itemProp="description">
            <p className="whitespace-pre-line text-lg italic leading-8 text-gray-100 lg:text-base">{reasonToBuyDescription}</p>
          </article>

          <figure className="space-y-5">
            <div className="overflow-hidden">
              <ZoomableImage
                src={reasonToBuyImage}
                alt={reasonToBuyImageAlt}
                className="h-full w-full rounded-lg shadow-2xl lg:h-full"
                imageClassName="h-full w-full lg:h-full"
              />
            </div>

            <div className="rounded-2xl border border-[#C8A889] bg-[#E9D9C8] p-5 shadow-xl sm:p-6">
              <h3 className="text-xl font-bold uppercase tracking-wide text-[#5C4033] sm:text-2xl">Đăng ký nhận tư vấn</h3>
              <form className="mt-4 space-y-3" onSubmit={handleSubmit} noValidate aria-label="Form đăng ký nhận tư vấn dự án">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="reason-name" className="sr-only">
                      Họ và tên
                    </label>
                    <input
                      id="reason-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Họ và tên"
                      autoComplete="name"
                      required
                      className="h-10 w-full rounded-xl border border-[#C8A889] bg-[#F7EFE6] px-4 text-[#5C4033] placeholder:text-[#9A7B5E] outline-none transition focus:border-[#8A6A4F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="reason-phone" className="sr-only">
                      Số điện thoại
                    </label>
                    <input
                      id="reason-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="Số điện thoại"
                      autoComplete="tel"
                      required
                      className="h-10 w-full rounded-xl border border-[#C8A889] bg-[#F7EFE6] px-4 text-[#5C4033] placeholder:text-[#9A7B5E] outline-none transition focus:border-[#8A6A4F]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-[#8A6A4F] font-bold uppercase tracking-wide text-white transition hover:bg-[#735743] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="text-zoom">{loading ? "Đang gửi..." : "Nhận tư vấn ngay"}</span>
                </button>
              </form>

              {submitted && (
                <p className="mt-3 text-sm font-medium text-emerald-700">Cảm ơn bạn! Chuyên viên sẽ liên hệ trong thời gian sớm nhất.</p>
              )}

              {errorMsg && <p className="mt-3 text-sm font-medium text-red-600">{errorMsg}</p>}
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default memo(ReasonToBuy);
