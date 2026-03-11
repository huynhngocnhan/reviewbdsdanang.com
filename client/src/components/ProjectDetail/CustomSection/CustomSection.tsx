import type React from "react";
import { useState } from "react";
import { Carousel } from "antd";
import type { CustomSectionItem } from "../../../constants/projectData";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MapIcon,
} from "@heroicons/react/24/outline";

// Single Custom Section Item Component
const CustomSectionItem: React.FC<{ section: CustomSectionItem }> = ({ section }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!section.customTitle) {
    return null;
  }

  const hasContent = section.contents && section.contents.length > 0;
  const contents = section.contents || [];
  const activeContent = contents[activeIndex];

  const goToPrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : contents.length - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev < contents.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="mt-8 sm:mt-12 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 px-4 sm:px-8 lg:px-24">
      {/* Header */}
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="200"
        className="max-w-6xl mx-auto text-center mb-6 sm:mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-800 uppercase tracking-wide">
          {section.customTitle}
        </h2>
        {section.customDes && (
          <p className="mt-4 text-gray-700 leading-relaxed mx-auto max-w-3xl">
            {section.customDes}
          </p>
        )}
      </div>

      {hasContent && contents.length > 0 ? (
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation - Modern Style */}
          <div
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="300"
            className="mb-4 sm:mb-6"
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-0">
              {contents.map((content, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`px-4 sm:px-8 py-3 text-sm sm:text-base font-bold transition-all duration-300 border-b-2 uppercase tracking-wide ${
                    activeIndex === idx
                      ? "text-amber-700 border-amber-600 bg-white shadow-md -mb-px"
                      : "text-gray-500 border-transparent hover:text-amber-600 hover:bg-gray-50"
                  }`}
                >
                  {content.contentTitle || `Nội dung ${idx + 1}`}
                </button>
              ))}
            </div>
          </div>

          {/* Content Display */}
          <div
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="400"
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Description */}
            {activeContent?.contentDes && (
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                  {activeContent.contentDes}
                </p>
              </div>
            )}

            {/* Image Display */}
            {activeContent?.images && activeContent.images.length > 0 && (
              <div className="relative">
                {/* Navigation Arrows */}
                {contents.length > 1 && (
                  <>
                    <button
                      onClick={goToPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white text-gray-700 hover:text-amber-600 transition-all duration-300 hover:scale-110"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white text-gray-700 hover:text-amber-600 transition-all duration-300 hover:scale-110"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Carousel */}
                {activeContent.images.length === 1 ? (
                  <div className="relative">
                    <img
                      src={activeContent.images[0].src}
                      alt={activeContent.images[0].alt}
                      className="w-full max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] object-contain bg-gray-50"
                    />
                    {activeContent.images[0].alt && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <p className="text-white text-center font-medium">
                          {activeContent.images[0].alt}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Carousel
                    autoplay
                    dots={{ className: "custom-dots" }}
                    effect="fade"
                    className="custom-section-carousel"
                  >
                    {activeContent.images.map((image, imageIndex) => (
                      <div key={`${image.src}-${imageIndex}`}>
                        <div className="relative h-[280px] sm:h-[400px] lg:h-[500px]">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="h-full w-full object-contain bg-gray-50"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                            <div className="max-w-3xl mx-auto text-right">
                            {image.alt && (
                                <h3 className="text-sm sm:text-base lg:text-lg font-light text-white">
                                  {image.alt}
                                </h3>
                              )}
                              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-amber-400 mb-2">
                                Hình ảnh {imageIndex + 1} / {activeContent.images.length}
                              </p>

                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Carousel>
                )}
              </div>
            )}
          </div>

          {/* Pagination Dots */}
          {contents.length > 1 && (
            <div className="flex justify-center gap-2 mt-4 sm:mt-6">
              {contents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeIndex === idx
                      ? "bg-amber-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 sm:p-12 text-center">
          <MapIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nội dung đang được cập nhật.</p>
        </div>
      )}
    </section>
  );
};

type Props = {
  project: {
    customSections?: CustomSectionItem[];
  };
};

const CustomSection: React.FC<Props> = ({ project }) => {
  const customSections = project.customSections || [];

  // Don't render if no custom sections
  if (customSections.length === 0) {
    return null;
  }

  return (
    <>
      {customSections.map((section, index) => (
        <CustomSectionItem
          key={index}
          section={section}
        />
      ))}
    </>
  );
};

export default CustomSection;
