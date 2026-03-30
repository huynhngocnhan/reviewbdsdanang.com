import { useState } from "react";
import type { ProjectData } from "../../constants/projectData";
import { api } from "../../api/client";

type Props = {
  project: ProjectData;
};

type FormData = {
  fullname: string;
  phonenum: string;
};

const FullWidthForm: React.FC<Props> = ({ project }) => {
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    phonenum: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isValidPhone = (value: string) => /^(0|\+84)[0-9]{9,10}$/.test(value.trim());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        project: project.title,
      });

      setSubmitted(true);
      setFormData({ fullname: "", phonenum: "" });
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
      className="w-full bg-[#17372F] py-10 sm:py-14"
      aria-labelledby="full-width-form-title"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <h2
            id="full-width-form-title"
            className="text-xl font-semibold text-white sm:text-3xl"
          >
            Đăng ký nhận tư vấn dự án {project.title}
          </h2>
        </header>

        <form className="mx-auto mt-8 max-w-5xl" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              type="text"
              name="fullname"
              required
              placeholder="Họ và Tên *"
              value={formData.fullname}
              onChange={handleChange}
              className="h-10 rounded-md border border-black/20 bg-white px-4 text-base text-[#2f2f2f] outline-none focus:border-[#f59e0b]"
              autoComplete="name"
            />
            <input
              type="tel"
              name="phonenum"
              required
              placeholder="Số điện thoại *"
              value={formData.phonenum}
              onChange={handleChange}
              className="h-10 rounded-md border border-black/20 bg-white px-4 text-base text-[#2f2f2f] outline-none focus:border-[#f59e0b]"
              autoComplete="tel"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-10 rounded-md bg-[#f7931e] px-5 text-base font-extrabold uppercase tracking-wide text-white transition hover:bg-[#e58212] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Đang gửi..." : "Đăng ký ngay"}
            </button>
          </div>
        </form>

        {submitted && (
          <p className="mx-auto mt-4 max-w-5xl text-center text-sm font-medium text-emerald-400">
            Cảm ơn bạn! Chuyên viên sẽ liên hệ trong thời gian sớm nhất.
          </p>
        )}

        {errorMsg && (
          <p className="mx-auto mt-4 max-w-5xl text-center text-sm font-medium text-red-400">
            {errorMsg}
          </p>
        )}

        <p className="mx-auto mt-6 text-center text-base text-white/95">
          Lưu ý: Khi gửi thông tin, bạn đồng ý với
          <span className="font-semibold"> Chính sách bảo mật</span> của chúng tôi.
        </p>

        <div className="mt-6 flex justify-center items-center gap-4">
          <a
            href="tel:0962114613"
            className="btn-float inline-flex items-center gap-3 rounded-full bg-[#b96e1b] px-6 py-3 text-base font-extrabold text-white shadow-lg transition hover:bg-[#a46118]"
            aria-label="Gọi hotline 0962114613"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
              aria-hidden="true"
            >
              <path d="M6.62 10.79a15.466 15.466 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
            </svg>
            <span>0962114613</span>
          </a>
          <a href="https://zalo.me/0901830909" target="_blank" rel="noreferrer" className="btn-ladi">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="60" height="60" viewBox="0 0 48 48">
                    <path fill="#2962ff" d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10	c4.722,0,8.883-2.348,11.417-5.931V36H15z"></path><path fill="#eee" d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19	c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742	c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083	C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z"></path><path fill="#2962ff" d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75	S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z"></path><path fill="#2962ff" d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z"></path><path fill="#2962ff" d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75	S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5	c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z"></path><path fill="#2962ff" d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5	c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z"></path>
                    </svg>
                </a>
        </div>
      </div>
    </section>
  );
};

export default FullWidthForm;
