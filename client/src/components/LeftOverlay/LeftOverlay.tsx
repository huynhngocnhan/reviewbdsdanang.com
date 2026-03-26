import type React from "react";
import { useState } from "react";
import RegisterModalForm from "../RegisterModalForm/RegisterModalForm";

type Props = {
  projectTitle: string;
  projectImage: string;
};

const LeftOverlay: React.FC<Props> = ({ projectTitle, projectImage }) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsRegisterModalOpen(true)}
        className="fixed btn-float-x bottom-24 left-2 z-50 inline-flex px-2 py-3 flex-col items-center justify-center  overflow-hidden rounded-xl border border-white/10 bg-[#df2f2f] text-white shadow-2xl transition hover:bg-[#c92727]"
        aria-label="Mở form hỗ trợ tư vấn"
      >
        <span className="[writing-mode:vertical-rl] text-xs font-bold uppercase tracking-wide leading-none">
          Tải bảng giá hôm nay
        </span>
        <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h14" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m12 6 6 6-6 6" />
        </svg>
        </span>
      </button>

      <RegisterModalForm
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        projectTitle={projectTitle}
        projectImage={projectImage}
      />
    </>
  );
};

export default LeftOverlay;