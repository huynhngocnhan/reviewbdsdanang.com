import type React from "react";

import type { ProjectData } from "../../../constants/projectData";
import ZoomableImage from "../../ZoomableImage";

type Props = {
  project: ProjectData;
};

const HandoverStandard: React.FC<Props> = ({ project }) => {
  const handover = project.handoverStandard;

  if (!handover || handover.items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="handover-standard-title" className="text-[#17372F]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <header className="grid gap-6 border-b border-[#17372F]/15 pb-8 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#876347]">Tiêu chuẩn bàn giao</p>
            <h2 id="handover-standard-title" className="mt-3 text-3xl font-extrabold uppercase leading-tight sm:text-5xl">
              {project.title}
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-[#17372F]/85 sm:text-base">{handover.des}</p>
        </header>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {handover.items.map((item, index) => {
            const title = item.title?.trim() || item.subtitle;

            return (
              <article
                key={`${item.subtitle}-${item.title || "item"}-${index}`}
                className="group overflow-hidden rounded-2xl border border-[#17372F]/10 bg-white shadow-[0_16px_45px_rgba(17,24,39,0.12)]"
              >
                <div className="relative">
                  <ZoomableImage
                    src={item.imgUrl}
                    alt={`${item.subtitle}${item.title ? ` - ${item.title}` : ""}`}
                    className="h-56 w-full"
                    imageClassName="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    showHoverOverlay={false}
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                  <div className="pointer-events-none absolute bottom-4 left-4 right-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-200">{item.subtitle}</p>
                    <h3 className="mt-1 text-lg font-bold uppercase text-white sm:text-xl">{title}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm leading-relaxed text-slate-700">{item.des}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HandoverStandard;
