import { useState, type ChangeEvent } from "react";
import type { ProjectData } from "../../../constants/projectData";
import { api } from "../../../api/client";

type Props = {
  project: ProjectData;
  projectOptions: string[];
};

type LeadFormData = {
  fullname: string;
  phonenum: string;
  email: string;
  productType: string;
  note: string;
};

const LeadForm = ({ project, projectOptions }: Props) => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullname: "",
    phonenum: "",
    email: "",
    productType: project.title, // Mặc định là project hiện tại
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const mainFloorplanImage = project.floorplans?.[0]?.floorPlanImage?.[0]?.src || project.coverImage;

  const isValidPhone = (value: string) => /^(0|\+84)[0-9]{9,10}$/.test(value.trim());

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.fullname.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên.");
      return;
    }

    if (!isValidPhone(formData.phonenum)) {
      setErrorMsg("Số điện thoại chưa đúng định dạng Việt Nam.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await api.post("/registrations", {
        fullname: formData.fullname.trim(),
        phonenum: formData.phonenum.trim(),
        email: formData.email.trim() || undefined,
        project: formData.productType || project.title,
        note: formData.note.trim() || undefined,
      });

      setSubmitted(true);
      setFormData({
        fullname: "",
        phonenum: "",
        email: "",
        productType: project.title,
        note: "",
      });
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
      aria-labelledby="lead-form-heading"
      className="w-full bg-[#8A2B1A] py-12 md:py-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#f6d3a3_0,_transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center text-[#F8E8D7]">
          <h2
            id="lead-form-heading"
            className="font-extrabold text-3xl sm:text-4xl lg:text-4xl -tracking-tighter uppercase"
          >
            Quý khách hàng đang quan tâm dự án và chưa tìm được căn ưng ý để đầu tư?
          </h2>
          <p className="mt-3 italic text-[#F6DCC1]/95 text-base sm:text-lg">
            (Hãy để lại yêu cầu của mình, chúng tôi sẽ chọn căn phù hợp và tư vấn chính xác nhất cho quý khách)
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-4 rounded-2xl bg-[#7A2517]/80 border border-[#D7A67A]/40 p-4 sm:p-5 shadow-2xl backdrop-blur-[2px]">
            <form
              onSubmit={handleSubmit}
              className="space-y-3 sm:space-y-4"
              aria-label={`Form đăng ký tư vấn dự án ${project.title}`}
            >
              <label htmlFor="lead-fullname" className="sr-only">
                Họ và tên
              </label>
              <input
                id="lead-fullname"
                name="fullname"
                type="text"
                autoComplete="name"
                required
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Họ và tên"
                className="h-10 w-full rounded-md border border-[#e6c9ad] bg-white px-4 text-[#4A2F23] outline-none focus:border-[#B6742C]"
              />

              <label htmlFor="lead-phonenum" className="sr-only">
                Số điện thoại
              </label>
              <input
                id="lead-phonenum"
                name="phonenum"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={formData.phonenum}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className="h-10 w-full rounded-md border border-[#e6c9ad] bg-white px-4 text-[#4A2F23] outline-none focus:border-[#B6742C]"
              />

              <label htmlFor="lead-email" className="sr-only">
                Email (Tuỳ chọn)
              </label>
              <input
                id="lead-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email (tuỳ chọn)"
                className="h-10 w-full rounded-md border border-[#e6c9ad] bg-white px-4 text-[#4A2F23] outline-none focus:border-[#B6742C]"
              />

              <label htmlFor="lead-productType" className="sr-only">
                Loại dự án
              </label>
              <select
                id="lead-productType"
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="h-10 w-full rounded-md border border-[#e6c9ad] bg-white px-4 text-[#4A2F23] outline-none focus:border-[#B6742C]"
              >
                <option value={project.title}>{project.title}</option>
                {projectOptions.filter((name) => name !== project.title).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <label htmlFor="lead-note" className="sr-only">
                Yêu cầu khác
              </label>
              <textarea
                id="lead-note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Yêu cầu khác (nếu có)"
                rows={3}
                className="w-full rounded-md border border-[#e6c9ad] bg-white px-4 py-3 text-[#4A2F23] outline-none focus:border-[#B6742C]"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-md bg-[#D22020] text-white text-base font-bold tracking-wide uppercase hover:bg-[#b61a1a] transition disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label={`Đăng ký tư vấn dự án ${project.title}`}
              >
                {loading ? "Đang gửi..." : "Đăng ký ngay"}
              </button>
            </form>

            {submitted && (
              <p className="mt-3 text-center text-sm font-medium text-emerald-300">
                Cảm ơn bạn! Chuyên viên sẽ liên hệ trong thời gian sớm nhất.
              </p>
            )}

            {errorMsg && (
              <p className="mt-3 text-center text-sm font-medium text-red-300">
                {errorMsg}
              </p>
            )}
          </div>

          <div className="lg:col-span-8 rounded-2xl overflow-hidden shadow-2xl border border-[#D7A67A]/30">
            <img
              src={mainFloorplanImage}
              alt={`${project.title} - mặt bằng dự án`}
              loading="lazy"
              decoding="async"
              className="w-full h-full min-h-[420px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;
