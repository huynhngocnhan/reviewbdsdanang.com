import type React from "react";
import BrgLogo from "../../assets/partnerLogo/BRG.png"
import FptLogo from "../../assets/partnerLogo/FPT.png"
import MasLogo from "../../assets/partnerLogo/Masterise.png"
import RoxLogo from "../../assets/partnerLogo/Rox.png"
import SunLogo from "../../assets/partnerLogo/Sun.png"
import VinLogo from "../../assets/partnerLogo/Vin.png"


type PartnerLogo = {
  src: string;
  alt: string;
};

const partnerLogos: PartnerLogo[] = [
    {
        src: BrgLogo,
        alt: "BrgLogo",
    },
    {
        src: FptLogo,
        alt: "FptLogo",
    },{
        src: MasLogo,
        alt: "MasLogo",
    },{
        src: RoxLogo,
        alt: "RoxLogo",
    },{
        src: SunLogo,
        alt: "Sun Group",
    },{
        src: VinLogo,
        alt: "VinLogo",
    },
];

const Partner: React.FC = () => {
  const loopLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  return (
    <section className="bg-white py-6 lg:py-10">
      <div
        data-aos="fade-up"
        data-aos-duration="800"
        className="mb-8 flex items-center justify-center gap-3 px-4 sm:gap-4"
      >
        <div className="h-px w-14 bg-amber-200 sm:w-24" />
        <p className="text-center text-xl font-extrabold uppercase tracking-tight text-amber-900 sm:text-3xl">
          Đối tác chính thức
        </p>
        <div className="h-px w-14 bg-amber-200 sm:w-24" />
      </div>

      <div className="relative h-[140px] w-full overflow-hidden sm:h-[170px] lg:h-[180px]">
        <div className="absolute left-0 top-0 w-max animate-partner-infinite">
          <div className="flex items-center gap-5 px-3 sm:gap-8 sm:px-6 pt-4">
            {loopLogos.map((logo, index) => (
              <article
                key={`${logo.alt}-${index}`}
                className="flex h-[78px] w-[132px] flex-shrink-0 items-center justify-center rounded-lg bg-white px-2 py-1.5 sm:h-[110px] sm:w-[180px] sm:px-3 sm:py-2 sm:rounded-xl"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes partnerInfinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-partner-infinite {
          animation: partnerInfinite 35s linear infinite;
        }

        @media (max-width: 640px) {
          .animate-partner-infinite {
            animation-duration: 24s;
          }
        }
      `}</style>
    </section>
  );
};

export default Partner;
