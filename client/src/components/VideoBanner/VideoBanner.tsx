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
          src="https://pub-a9b8df18947f4374831f1b23a3452a21.r2.dev/banners/f04507dc-b036-4a4b-bd7d-e53329194578.mp4"
          type="video/webm"
        />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-slate-900/10 z-[1]" aria-hidden="true" />
    </div>
  );
};

export default VideoBanner;
