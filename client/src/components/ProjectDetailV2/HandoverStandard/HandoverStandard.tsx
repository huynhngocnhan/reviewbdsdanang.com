import type React from "react";

import type { ProjectData } from "../../../constants/projectData";
import ZoomableImage from "../../ZoomableImage";

type Props = {
  project: ProjectData;
};

const getSafeText = (value?: string, fallback = "") => value?.trim() || fallback;

const getDisplayTitle = (subtitle?: string, title?: string) => {
  const cleanTitle = title?.trim();
  const cleanSubtitle = subtitle?.trim();

  if (cleanTitle) return cleanTitle;
  if (cleanSubtitle) return cleanSubtitle;
  return "Không gian bàn giao";
};

const getItemAlt = (projectTitle: string, subtitle?: string, title?: string) => {
  const displaySubtitle = getSafeText(subtitle, "Hạng mục");
  const displayTitle = getDisplayTitle(subtitle, title);
  return `${projectTitle} - ${displaySubtitle} ${displayTitle}`;
};

const getMosaicSpanClass = (index: number) => {
  const pattern = ["lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-5", "lg:col-span-7"];
  return pattern[index % pattern.length];
};

const HandoverStandard: React.FC<Props> = ({ project }) => {
  const handover = project.handoverStandard;

  if (!handover) {
    return null;
  }

  const description = handover.des?.trim() || "";
  const items = (handover.items || []).filter((item) => item.imgUrl || item.title || item.subtitle || item.des);

  const hasDescription = Boolean(description);
  const hasItems = items.length > 0;
  const hasFullContent = hasDescription && hasItems;

  if (!hasDescription && !hasItems) {
    return null;
  }

  const projectTitle = getSafeText(project.title, "Dự án");
  const introItem = items[1];
  const heroItem = items[0];
  const remainItems = items.slice(2);

  if (!hasFullContent) {
    return (
      <section
        id="handover-standard"
        aria-labelledby="handover-standard-title"
        className="relative overflow-hidden bg-[#F3E8DC] text-[#17372F]"
        itemScope
        itemType="https://schema.org/CreativeWork"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(23,55,47,0.06),transparent_38%),radial-gradient(circle_at_86%_12%,rgba(135,99,71,0.10),transparent_42%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-16">
          <p className="text-xl font-extrabold uppercase tracking-[0.2em] text-[#876347]">Tiêu chuẩn bàn giao</p>
          <h2
            id="handover-standard-title"
            className="mt-3 text-4xl font-extrabold uppercase leading-[1.1] tracking-wide sm:text-5xl"
            itemProp="name"
          >
            {projectTitle}
          </h2>
          {hasDescription ? (
            <p className="mx-auto mt-6 max-w-3xl whitespace-pre-line text-left text-base leading-relaxed text-[#17372F]/90 sm:text-center sm:text-lg" itemProp="description">
              {description}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section
      id="handover-standard"
      aria-labelledby="handover-standard-title"
      className="relative overflow-hidden bg-[#F3E8DC] text-[#17372F]"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="numberOfItems" content={String(items.length)} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(23,55,47,0.06),transparent_38%),radial-gradient(circle_at_86%_12%,rgba(135,99,71,0.10),transparent_42%)]" />

      <div className="relative mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-8">
          <header className="lg:col-span-6">
            <p className="text-xl font-extrabold uppercase tracking-[0.2em] text-[#876347]">Tiêu chuẩn bàn giao</p>
            <h2
              id="handover-standard-title"
              className="mt-3 text-4xl font-extrabold uppercase leading-[1.1] tracking-wide sm:text-5xl lg:text-6xl"
              itemProp="name"
            >
              {projectTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#17372F]/85" itemProp="description">
              {description}
            </p>

            {introItem ? (
              <article
                className="mt-8 border-t border-[#17372F]/20 pt-6"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/Thing"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#876347]" itemProp="additionalType">
                  {getSafeText(introItem.subtitle, "Hạng mục")}
                </p>
                <h3 className="mt-2 text-4xl font-extrabold uppercase leading-none sm:text-5xl" itemProp="name">
                  {getDisplayTitle(introItem.subtitle, introItem.title)}
                </h3>
                {introItem.des ? (
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-[#17372F]/90 " itemProp="description">
                    {introItem.des}
                  </p>
                ) : (
                  <p className="sr-only" itemProp="description">
                    {getDisplayTitle(introItem.subtitle, introItem.title)}
                  </p>
                )}

                {introItem.imgUrl ? (
                  <figure className="mt-6 overflow-hidden rounded-lg border border-[#17372F]/15">
                    <ZoomableImage
                      src={introItem.imgUrl}
                      alt={getItemAlt(projectTitle, introItem.subtitle, introItem.title)}
                      className="h-48 w-full sm:h-56"
                      imageClassName="h-48 w-full rounded-lg object-cover sm:h-56"
                      showHoverOverlay={false}
                    />
                    <figcaption className="sr-only">{`${getSafeText(introItem.subtitle, "Hạng mục")} - ${getDisplayTitle(introItem.subtitle, introItem.title)}`}</figcaption>
                  </figure>
                ) : null}
              </article>
            ) : null}
          </header>

          {heroItem ? (
            <article
              className="lg:col-span-6"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/Thing"
            >
              <div className="border-b border-[#17372F]/20 pb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#876347]" itemProp="additionalType">
                  {getSafeText(heroItem.subtitle, "Hạng mục")}
                </p>
                <h3 className="mt-1 text-4xl font-extrabold uppercase leading-tight sm:text-5xl" itemProp="name">
                  {getDisplayTitle(heroItem.subtitle, heroItem.title)}
                </h3>
              </div>

              {heroItem.imgUrl ? (
                <figure className="mt-5 overflow-hidden rounded-lg border border-[#17372F]/15">
                  <ZoomableImage
                    src={heroItem.imgUrl}
                    alt={getItemAlt(projectTitle, heroItem.subtitle, heroItem.title)}
                    className="h-[300px] w-full sm:h-[380px] lg:h-[430px]"
                    imageClassName="h-[300px] w-full rounded-lg object-cover transition duration-700 hover:scale-105 sm:h-[380px] lg:h-[430px]"
                    showHoverOverlay={false}
                  />
                  <figcaption className="sr-only">{`${getSafeText(heroItem.subtitle, "Hạng mục")} - ${getDisplayTitle(heroItem.subtitle, heroItem.title)}`}</figcaption>
                </figure>
              ) : null}

              {heroItem.des ? (
                <p className="mt-5 text-base leading-relaxed text-[#17372F]/90" itemProp="description">
                  {heroItem.des}
                </p>
              ) : (
                <p className="sr-only" itemProp="description">
                  {getDisplayTitle(heroItem.subtitle, heroItem.title)}
                </p>
              )}
            </article>
          ) : null}
        </div>

        {remainItems.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
            {remainItems.map((item, index) => {
              const subtitle = getSafeText(item.subtitle, "Hạng mục");
              const title = getDisplayTitle(item.subtitle, item.title);
              const spanClass = getMosaicSpanClass(index);

              return (
                <article
                  key={`${subtitle}-${title}-${index + 2}`}
                  className={`border rounded-lg border-[#17372F]/15 bg-[#17372F]/[0.04] p-4 sm:p-5 ${spanClass}`}
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/Thing"
                >
                  <div className="flex flex-col gap-4">
                    <div className="border-b border-[#17372F]/15 pb-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#876347]" itemProp="additionalType">
                        {subtitle}
                      </p>
                      <h3 className="mt-1 text-3xl font-extrabold uppercase leading-tight sm:text-4xl" itemProp="name">
                        {title}
                      </h3>
                    </div>

                    {item.des ? (
                      <p className="text-sm leading-relaxed text-[#17372F]/90" itemProp="description">
                        {item.des}
                      </p>
                    ) : (
                      <p className="sr-only" itemProp="description">
                        {`${subtitle} ${title}`}
                      </p>
                    )}

                    {item.imgUrl ? (
                      <figure className="overflow-hidden rounded-lg border border-[#17372F]/15">
                        <ZoomableImage
                          src={item.imgUrl}
                          alt={getItemAlt(projectTitle, item.subtitle, item.title)}
                          className="h-64 w-full md:h-72"
                          imageClassName="h-64 w-full rounded-lg object-cover transition duration-700 hover:scale-105 md:h-72"
                          showHoverOverlay={false}
                        />
                        <figcaption className="sr-only">{`${subtitle} - ${title}`}</figcaption>
                      </figure>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default HandoverStandard;
