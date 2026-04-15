import type React from "react";

const VideoBanner: React.FC = () => {
  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src="https://pub-a9b8df18947f4374831f1b23a3452a21.r2.dev/projects/cover/6e00a497-acc1-4115-96ca-637b5b2e00d6.webp"
        alt="Bất động sản Đà Nẵng - Cầu Rồng và thành phố biển"
        width={1920}
        height={1080}
        sizes="100vw"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-[1]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="absolute inset-0 z-[2] flex items-end">
  <div className="w-full px-4 sm:px-8 lg:px-12 pb-8 sm:pb-20 lg:pb-28 max-w-[720px] text-white">
          
          {/* Badge */}
          <p className="inline-flex rounded-full bg-amber-600/90 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] shadow-lg">
            Đà Nẵng - Thành phố đáng sống nhất Việt Nam
          </p>

          {/* H1 chuẩn SEO */}
          <h1 className="mt-3  text-2xl sm:text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
            Bất động sản <span className="text-amber-500 inline-block">Đà Nẵng</span>
          </h1>

          {/* Sub heading (KHÔNG dùng h2 để tránh conflict SEO) */}
          <p className="mt-2 text-lg sm:text-2xl lg:text-3xl font-semibold text-slate-100 drop-shadow">
            Cho một cuộc sống đẳng cấp
          </p>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-base lg:text-lg text-slate-100 leading-relaxed drop-shadow">
            <strong className="text-amber-500">Reviewbdsdanang.com</strong> là website mua bán bất động sản Đà Nẵng, 
            cập nhật dự án mới, giá bán, vị trí và pháp lý minh bạch giúp bạn dễ dàng lựa chọn nhà ở, đầu tư và an cư lâu dài.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoBanner;
