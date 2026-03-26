import type React from "react";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  showHoverOverlay?: boolean;
};

const ZoomableImage: React.FC<Props> = ({
  src,
  alt,
  className = "",
  imageClassName = "",
  showHoverOverlay = true,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsPreviewOpen(true)}
        className={`group relative overflow-hidden ${className}`}
        aria-label={`Phóng to ảnh: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] ${imageClassName}`}
        />
        {showHoverOverlay && (
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
        )}
      </button>

      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsPreviewOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xl font-bold text-[#17372F] hover:bg-white"
            aria-label="Đóng ảnh phóng to"
          >
            ×
          </button>

          <img
            src={src}
            alt={`${alt} (phóng to)`}
            className="max-h-[90vh] w-auto max-w-[95vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ZoomableImage;
