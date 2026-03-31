import { useState } from "react";
import type React from "react";
import type { ProjectData, ApartmentItem } from "../../constants/projectData";
import { api } from "../../api/client";

type Props = {
  apartmentOptions: ApartmentItem[];
  project: ProjectData;
};

type FormData = {
  fullname: string;
  apartmentType: string;
  phonenum: string;
};

const ApartmentForm: React.FC<Props> = ({ apartmentOptions, project }) => {
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    apartmentType: "",
    phonenum: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isValidPhone = (value: string) => /^(0|\+84)[0-9]{9,10}$/.test(value.trim());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (!formData.apartmentType) {
      setErrorMsg("Vui lòng chọn loại căn hộ quan tâm.");
      return;
    }

    if (!isValidPhone(formData.phonenum)) {
      setErrorMsg("Số điện thoại chưa đúng định dạng Việt Nam.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // Tìm apartment item được chọn để lấy thông tin đầy đủ
      const selectedApartment = apartmentOptions.find((item) => item.label === formData.apartmentType);
      const note = selectedApartment
        ? `Căn hộ: ${selectedApartment.name} (${selectedApartment.label}) - ${selectedApartment.price}`
        : formData.apartmentType;

      await api.post("/registrations", {
        fullname: formData.fullname.trim(),
        phonenum: formData.phonenum.trim(),
        project: project.title,
        note,
      });

      setSubmitted(true);
      setFormData({ fullname: "", apartmentType: "", phonenum: "" });
    } catch (err) {
      console.error("Registration error:", err);
      const error = err as { response?: { data?: { message?: string } } };
      setErrorMsg(error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12" aria-labelledby="apartment-form-title">
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/20 bg-gradient-to-br from-[#FAF7EA] to-[#F3E8C8] p-6 text-[#1E293B] shadow-[0_20px_45px_rgba(0,0,0,0.25)] sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-300/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-yellow-200/30 blur-2xl" />

        <div className="relative z-10">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B45309] md:text-sm">
              {project.title}
            </p>
            <h3 id="apartment-form-title" className="mt-2 text-2xl font-extrabold uppercase text-[#0F172A] sm:text-3xl">
              Nhận file mặt bằng & bảng giá căn hộ
            </h3>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
              Điền thông tin để nhận ngay mặt bằng, bảng giá và chính sách ưu đãi mới nhất qua Zalo/Số điện thoại.
            </p>
          </header>

          <form className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_auto]" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="apartmentType" className="mb-2 block text-sm font-semibold text-slate-700">
                Chọn loại căn hộ quan tâm
              </label>
              <select
                id="apartmentType"
                name="apartmentType"
                required
                value={formData.apartmentType}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              >
                <option value="" disabled>
                  Căn hộ anh/chị quan tâm..
                </option>
                {apartmentOptions.map((item) => (
                  <option key={item.label} value={item.label}>
                    {item.name} ({item.label}) - {item.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fullname" className="mb-2 block text-sm font-semibold text-slate-700">
                Họ và tên
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Họ và tên của anh/chị"
                autoComplete="name"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div>
              <label htmlFor="phonenum" className="mb-2 block text-sm font-semibold text-slate-700">
                Số điện thoại (Zalo)
              </label>
              <input
                id="phonenum"
                name="phonenum"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                required
                value={formData.phonenum}
                onChange={handleChange}
                placeholder="Số điện thoại của anh/chị"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-60 disabled:cursor-not-allowed lg:mt-[1.7rem]"
            >
              <span className="text-zoom">{loading ? "Đang gửi..." : "Tải xuống ngay"}</span>
            </button>
          </form>

          {submitted && (
            <p className="mt-4 text-center text-sm font-medium text-emerald-700">
              Cảm ơn bạn! Chuyên viên sẽ liên hệ trong thời gian sớm nhất.
            </p>
          )}

          {errorMsg && (
            <p className="mt-4 text-center text-sm font-medium text-red-600">
              {errorMsg}
            </p>
          )}

          <p className="mt-4 text-center text-xs text-slate-600 sm:text-sm">
            Thông tin của anh/chị được bảo mật và chỉ dùng để gửi tài liệu dự án theo yêu cầu.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ApartmentForm;
