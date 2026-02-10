import React, { useState } from "react";

interface RegisterFormData {
  fullname: string;
  email: string;
  phonenum: string;
  project: string;
  note: string;
}

interface RegisterFormProps {
  projects: string[];
}

const RegisterForm: React.FC<RegisterFormProps> = ({ projects }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullname: "",
    email: "",
    phonenum: "",
    project: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form Data:", formData);
    setTimeout(() => {
      setLoading(false);
      alert("Đăng ký tư vấn thành công!");
    }, 1000);
  };

  const inputClasses =
    "w-full bg-transparent border-b border-gray-400 py-3 outline-none focus:border-gray-600 transition-colors placeholder:text-gray-300 text-gray-700 uppercase text-xs tracking-widest font-semibold";
  const labelClasses = "block text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] mb-1";

  return (
    <div className="w-full bg-gray-100/90 pt-20 pb-14">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold uppercase text-center text-gray-800 mb-16">
          Đăng ký tư vấn
        </h2>
        <form onSubmit={handleSubmit} className="space-y-12">
           
        {/* Full Name */}
        <div className="relative">
          <label htmlFor="fullname" className={labelClasses}>
            *Họ và tên
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            required
            className={inputClasses}
            value={formData.fullname}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {/* Email */}
          <div className="relative">
            <label htmlFor="email" className={labelClasses}>
              *Địa chỉ Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={inputClasses}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <label htmlFor="phonenum" className={labelClasses}>
              *Số điện thoại
            </label>
            <input
              type="tel"
              id="phonenum"
              name="phonenum"
              required
              className={inputClasses}
              value={formData.phonenum}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Project Select */}
        <div className="relative">
          <label htmlFor="project" className={labelClasses}>
            *Dự án cần tư vấn
          </label>
          <select
            id="project"
            name="project"
            required
            className={`${inputClasses} appearance-none rounded-none cursor-pointer`}
            value={formData.project}
            onChange={handleChange}
          >
            <option value="" disabled className="text-gray-400">
              Chọn dự án...
            </option>
            {projects.map((project) => (
              <option key={project} value={project} className="text-gray-700 uppercase text-xs">
                {project}
              </option>
            ))}
          </select>
        </div>

        {/* Note/Question */}
        <div className="relative pt-4">
          <div className="border border-gray-400 rounded-[2rem] p-8 focus-within:border-gray-600 transition-colors">
            <textarea
              id="note"
              name="note"
              rows={4}
              placeholder="Câu hỏi hoặc ghi chú"
              className="w-full bg-transparent outline-none resize-none text-gray-700 uppercase text-xs tracking-widest placeholder:text-gray-400"
              value={formData.note}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center ">
          <button
            type="submit"
            disabled={loading}
            className={`px-12 py-4 border border-gray-800 text-gray-800 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-yellow-600 hover:text-white transition-all duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Đăng ký tư vấn"}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default RegisterForm;
