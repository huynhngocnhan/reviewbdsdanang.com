import type React from "react";

const VideoBanner: React.FC = () => {
  return (
    <div className="relative w-full min-h-[60vh] sm:min-h-[80vh] lg:min-h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://www.pexels.com/download/video/12737255/"
          type="video/webm"
        />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-slate-900/10 z-[1]" aria-hidden="true" />
    </div>
  );
};

export default VideoBanner;
