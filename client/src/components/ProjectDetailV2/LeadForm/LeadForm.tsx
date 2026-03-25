import { useState } from "react";
import type React from "react";
import type { ProjectData } from "../../../constants/projectData";

type Props = {
  project: ProjectData;
  projectOptions: string[];
};

type LeadFormData = {
  fullname: string;
  phonenum: string;
  productType: string;
  note: string;
};

const LeadForm: React.FC<Props> = ({ project, projectOptions }) => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullname: "",
    phonenum: "",
    productType: "",
    note: "",
  });

  const mainFloorplanImage = project.floorplans?.[0]?.floorPlanImage?.[0]?.src || project.coverImage;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="w-full bg-[#8A2B1A] py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#f6d3a3_0,_transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center text-[#F8E8D7]">
          <h2 className="font-['Montserrat'] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide uppercase">
            Quý khách hàng đang quan tâm dự án và chưa tìm được căn ưng ý để đầu tư?
          </h2>
          <p className="mt-3 italic text-[#F6DCC1]/95 text-base sm:text-lg">
            (Hãy để lại yêu cầu của mình, chúng tôi sẽ chọn căn phù hợp và tư vấn chính xác nhất cho quý khách)
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-4 rounded-2xl bg-[#7A2517]/80 border border-[#D7A67A]/40 p-4 sm:p-5 shadow-2xl backdrop-blur-[2px]">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <input
                name="fullname"
                required
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Họ và tên"
                className="h-12 w-full rounded-md border border-[#e6c9ad] bg-white px-4 text-[#4A2F23] outline-none focus:border-[#B6742C]"
              />
              <input
                name="phonenum"
                required
                value={formData.phonenum}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className="h-12 w-full rounded-md border border-[#e6c9ad] bg-white px-4 text-[#4A2F23] outline-none focus:border-[#B6742C]"
              />

              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="h-12 w-full rounded-md border border-[#e6c9ad] bg-white px-4 text-[#4A2F23] outline-none focus:border-[#B6742C]"
              >
                <option value="">Loại dự án</option>
                {projectOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Yêu cầu khác (nếu có)"
                rows={4}
                className="w-full rounded-md border border-[#e6c9ad] bg-white px-4 py-3 text-[#4A2F23] outline-none focus:border-[#B6742C]"
              />

              <button
                type="submit"
                className="w-full h-11 rounded-md bg-[#D22020] text-white text-base font-bold tracking-wide uppercase hover:bg-[#b61a1a] transition"
              >
                Đăng ký ngay
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 rounded-2xl overflow-hidden shadow-2xl border border-[#D7A67A]/30">
            <img
              src={mainFloorplanImage}
              alt={`${project.title} - mặt bằng dự án`}
              className="w-full h-full min-h-[420px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;
