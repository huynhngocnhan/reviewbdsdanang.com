import React, { useEffect, useState } from "react";
import { api } from "../../api/client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectImage: string;
};

type FormData = {
  fullname: string;
  phonenum: string;
  email: string;
};

const RegisterModalForm: React.FC<Props> = ({
  isOpen,
  onClose,
  projectTitle,
  projectImage,
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    phonenum: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMessage(null);
    }
  }, [isOpen]);

  const todayLabel = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.post("/registrations", {
        fullname: formData.fullname,
        email: formData.email,
        phonenum: formData.phonenum,
        project: projectTitle,
        note: "Đăng ký từ popup tư vấn dự án",
      });

      setMessage({ type: "success", text: response.data.message || "Đăng ký tư vấn thành công!" });
      setFormData({ fullname: "", phonenum: "", email: "" });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-[#F7EFE6] shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/80 px-3 py-1 text-lg font-bold text-[#5C4033] hover:bg-white"
        >
          ×
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 sm:p-8 md:p-10">
            <h3 className="text-2xl text-center font-extrabold text-[#5C4033]">Bảng giá hôm nay {todayLabel}</h3>
            <p className="mt-2 text-sm text-center text-[#7A5A43]">Thông tin của quý khách sẽ được bảo mật theo <span className="font-extrabold text-[#8A6A4F] underline decoration-2 underline-offset-2">chính sách và quyền riêng tư</span></p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                name="fullname"
                required
                placeholder="Họ và tên"
                value={formData.fullname}
                onChange={handleChange}
                className="h-10 w-full rounded-xl border border-[#D8C3AD] bg-white px-4 text-[#5C4033] outline-none focus:border-[#8A6A4F]"
              />
              <input
                type="tel"
                name="phonenum"
                required
                placeholder="Số điện thoại"
                value={formData.phonenum}
                onChange={handleChange}
                className="h-10 w-full rounded-xl border border-[#D8C3AD] bg-white px-4 text-[#5C4033] outline-none focus:border-[#8A6A4F]"
              />
              <input
                type="email"
                name="email"
                placeholder="Email (không bắt buộc)"
                value={formData.email}
                onChange={handleChange}
                className="h-10 w-full rounded-xl border border-[#D8C3AD] bg-white px-4 text-[#5C4033] outline-none focus:border-[#8A6A4F]"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-[#8A6A4F] font-bold text-white transition hover:bg-[#735743] disabled:opacity-60"
              >
                {loading ? "Đang gửi..." : "Đăng ký nhận bảng giá"}
              </button>

              <p className="w-full rounded-lg bg-[#EADBCB] px-3 py-2 text-center text-sm font-semibold text-[#5C4033]">
                Hotline: 093.888.58.79
              </p>

              {message && (
                <p className={`text-sm ${message.type === "success" ? "text-emerald-700" : "text-red-700"}`}>
                  {message.text}
                </p>
              )}
            </form>

          </div>

          <div className="relative min-h-[300px] md:min-h-full">
            <img src={projectImage} alt={projectTitle} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-black/35 p-3 text-white backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-amber-200">Dự án quan tâm</p>
              <p className="mt-1 text-lg font-bold">{projectTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModalForm;
