import { useMemo } from "react";
import type React from "react";
import type { ProjectData } from "../../constants/projectData";

type ApartmentOption = {
  title: string;
  badge: string;
  price: string;
};

type Props = {
  apartmentOptions: ApartmentOption[];
  project: ProjectData;
};

const ApartmentForm: React.FC<Props> = ({ apartmentOptions, project }) => {
  const selectOptions = useMemo(
    () =>
      apartmentOptions.map((item) => ({
        value: item.badge,
        label: `${item.title} (${item.badge}) - ${item.price}`,
      })),
    [apartmentOptions],
  );

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

          <form className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_1fr_auto]" action="#" method="post">
            <div>
              <label htmlFor="apartmentType" className="mb-2 block text-sm font-semibold text-slate-700">
                Chọn loại căn hộ quan tâm
              </label>
              <select
                id="apartmentType"
                name="apartmentType"
                required
                defaultValue=""
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              >
                <option value="" disabled>
                  Lựa chọn căn hộ anh/chị quan tâm
                </option>
                {selectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">
                Số điện thoại (Zalo)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Nhập số điện thoại của anh/chị"
                pattern="(\\+84|0)[0-9]{9,10}"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <button
              type="submit"
              className=" mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-red-300 lg:mt-[1.7rem]"
            >
              <span className="text-zoom">Tải xuống ngay</span>
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-600 sm:text-sm">
            Thông tin của anh/chị được bảo mật và chỉ dùng để gửi tài liệu dự án theo yêu cầu.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ApartmentForm;
